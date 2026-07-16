import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import EventListing from './pages/EventListing';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import Dashboard from './pages/Dashboard';
import MyRegistrations from './pages/MyRegistrations';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/events" element={<ProtectedRoute><EventListing /></ProtectedRoute>} />
      <Route path="/events/:id" element={<ProtectedRoute><EventDetails /></ProtectedRoute>} />
      <Route path="/create-event" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
      <Route path="/edit-event/:id" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/my-registrations" element={<ProtectedRoute><MyRegistrations /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
