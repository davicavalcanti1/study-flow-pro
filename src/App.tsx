import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth, isStaff } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import StudyPage from "./pages/StudyPage";
import SchedulePage from "./pages/SchedulePage";
import SubjectsPage from "./pages/SubjectsPage";
import PerformancePage from "./pages/PerformancePage";
import GoalsPage from "./pages/GoalsPage";
import SimulationsPage from "./pages/SimulationsPage";
import EssaysPage from "./pages/EssaysPage";
import ForumPage from "./pages/ForumPage";
import AssessorDashboard from "./pages/AssessorDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import DiretorDashboard from "./pages/DiretorDashboard";
import InvitePage from "./pages/InvitePage";
import { DataProvider } from "./contexts/DataContext";
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-accent" />
    </div>
  );
}

function ProtectedRoute({ children, staffOnly }: { children: ReactNode; staffOnly?: boolean }) {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (staffOnly && !isStaff(user?.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function getDefaultRoute(role?: string) {
  if (role === "manager") return "/manager";
  if (role === "diretor") return "/diretor";
  if (role === "assessor") return "/assessor";
  return "/";
}

function AppRoutes() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to={getDefaultRoute(user?.role)} replace /> : <LoginPage />} />
      <Route path="/cadastro" element={isAuthenticated ? <Navigate to={getDefaultRoute(user?.role)} replace /> : <SignupPage />} />
      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/estudar" element={<ProtectedRoute><StudyPage /></ProtectedRoute>} />
      <Route path="/cronograma" element={<ProtectedRoute><SchedulePage /></ProtectedRoute>} />
      <Route path="/disciplinas" element={<ProtectedRoute><SubjectsPage /></ProtectedRoute>} />
      <Route path="/desempenho" element={<ProtectedRoute><PerformancePage /></ProtectedRoute>} />
      <Route path="/metas" element={<ProtectedRoute><GoalsPage /></ProtectedRoute>} />
      <Route path="/simulados" element={<ProtectedRoute><SimulationsPage /></ProtectedRoute>} />
      <Route path="/redacao" element={<ProtectedRoute><EssaysPage /></ProtectedRoute>} />
      <Route path="/forum" element={<ProtectedRoute><ForumPage /></ProtectedRoute>} />
      <Route path="/assessor" element={<ProtectedRoute staffOnly><AssessorDashboard /></ProtectedRoute>} />
      <Route path="/manager" element={<ProtectedRoute staffOnly><ManagerDashboard /></ProtectedRoute>} />
      <Route path="/diretor" element={<ProtectedRoute staffOnly><DiretorDashboard /></ProtectedRoute>} />
      <Route path="/convite/:token" element={<InvitePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DataProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </DataProvider>
  </QueryClientProvider>
);

export default App;
