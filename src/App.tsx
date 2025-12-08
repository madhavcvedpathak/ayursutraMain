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
      <div className="min-h-screen bg-[#dcdcdc] flex justify-center items-center p-0 md:p-5">
        <div className="w-full max-w-[1440px] bg-white min-h-screen md:min-h-[95vh] rounded-none md:rounded-[24px] overflow-hidden relative shadow-none md:shadow-2xl border-0 md:border-8 border-[#f0ede6]">
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
      </div>
    </AuthProvider>
  );
}

export default App;
