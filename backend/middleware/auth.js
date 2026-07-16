const admin = require('../config/firebaseAdmin');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = await admin.auth().verifyIdToken(token);
      let user = await User.findOne({ firebaseUid: decoded.uid });

      if (!user) {
        user = await User.create({
          firebaseUid: decoded.uid,
          name: decoded.name || decoded.email.split('@')[0],
          email: decoded.email
        });
      }

      req.user = user;
      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
