import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SocketProvider } from "./contexts/SocketContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import '@/styles/driver-overrides.css';
import { useEffect } from 'react';
import { setupTour } from '@/lib/tour';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Development-only tour reset function
    if (process.env.NODE_ENV === 'development') {
      (window as any).resetTour = () => {
        localStorage.removeItem('hasCompletedTour');
        window.location.reload();
      };
    }

    // Start tour for new users
    const hasCompletedTour = localStorage.getItem('hasCompletedTour');
    if (!hasCompletedTour && window.location.pathname === '/') {
      const timer = setTimeout(() => {
        const tour = setupTour();
        tour.drive();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <SocketProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route 
                    path="/" 
                    element={
                      <ProtectedRoute>
                        <Chat />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </TooltipProvider>
            </SocketProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
