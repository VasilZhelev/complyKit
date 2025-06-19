import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { AuthProvider, useAuth } from './utils/AuthContext';
import { ProModeProvider, useProMode } from './utils/ProModeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import QuestionnairePage from './pages/QuestionnairePage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import GenerateDocuments from './pages/GenerateDocuments';
import './App.css';
import { getDocuments, createWhereConstraint } from './utils/db';

function AppRoutes() {
  const { user, loading } = useAuth();
  const { proMode } = useProMode();
  const navigate = useNavigate();
  const location = useLocation();
  const [complianceSummary, setComplianceSummary] = useState<string | undefined>(undefined);
  const lastPathRef = useRef<string | null>(null);

  // Redirect logic (fix loop)
  useEffect(() => {
    if (!loading && proMode && user && location.pathname === '/' && lastPathRef.current !== '/dashboard') {
      navigate('/dashboard', { replace: true });
    }
    lastPathRef.current = location.pathname;
  }, [proMode, user, loading, location.pathname, navigate]);

  // Fetch latest compliance summary for dashboard
  useEffect(() => {
    const fetchSummary = async () => {
      if (user) {
        const userResults = await getDocuments<any>('questionnaire_results', [
          createWhereConstraint('userId', '==', user.uid)
        ]);
        if (userResults.length > 0) {
          userResults.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          setComplianceSummary(userResults[0].aiAnalysis || 'No compliance summary found.');
        } else {
          setComplianceSummary(undefined);
        }
      } else {
        setComplianceSummary(undefined);
      }
    };
    fetchSummary();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/questionnaire" element={<QuestionnairePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/generate-documents" element={<GenerateDocuments />} />
          <Route path="/dashboard" element={<Dashboard complianceSummary={complianceSummary} />} />
          {/* Protected Routes - Only Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProModeProvider>
        <AppRoutes />
      </ProModeProvider>
    </AuthProvider>
  );
}

export default App;