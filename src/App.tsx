import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { PatientPortal } from './pages/PatientPortal';
import { PractitionerPortal } from './pages/PractitionerPortal';
import { AdminPortal } from './pages/AdminPortal';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { RegisterCenter } from './pages/RegisterCenter';
import { Profile } from './pages/Profile';
import { Navigation } from './components/Navigation';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Chatbot } from './components/Chatbot';

function App() {
  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', background: '#fcfcfc' }}>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/portal" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientPortal />
            </ProtectedRoute>
          } />

          <Route path="/practitioner" element={
            <ProtectedRoute allowedRoles={['practitioner']}>
              <PractitionerPortal />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPortal />
            </ProtectedRoute>
          } />

          <Route path="/register-center" element={<ProtectedRoute allowedRoles={['admin']}><RegisterCenter /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute allowedRoles={['patient', 'practitioner', 'admin']}><Profile /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Chatbot />
      </div>
    </AuthProvider>
  );
}

export default App;
