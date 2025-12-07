import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Tools from './pages/Tools';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Survey from './pages/Survey';
import Resources from './pages/Resources';

import { useEffect } from 'react';
import { NotificationService } from './services/NotificationService';
import { GamificationProvider } from './context/GamificationContext';

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    NotificationService.init();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GamificationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/survey" element={<Survey />} />

            {/* Protected Routes (Mocked for now) */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chat" element={<Navigate to="/chat/warren" replace />} />
              <Route path="/chat/:personaId" element={<Chat />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <Toaster />
        <Sonner />
      </GamificationProvider>
    </QueryClientProvider>
  );
}

export default App;
