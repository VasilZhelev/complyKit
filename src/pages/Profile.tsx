import React, { useEffect, useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import { getDocuments, createWhereConstraint } from '../utils/db';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom';

interface QuestionnaireResult {
  id: string;
  timestamp: string;
  answers: Record<string, any>;
  score: number;
  riskLevel: string;
}

const Profile = () => {
  const { user, logout } = useAuth();
  const [results, setResults] = useState<QuestionnaireResult[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (user) {
        try {
          const userResults = await getDocuments<QuestionnaireResult>('questionnaire_results', [
            createWhereConstraint('userId', '==', user.uid)
          ]);
          // Sort results by timestamp, newest first
          setResults(userResults.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          ));
        } catch (error) {
          console.error('Error fetching results:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchResults();
  }, [user]);

  if (!user) {
    return null; // ProtectedRoute will handle redirection
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <button
                onClick={handleLogout}
                className="text-brand-primary hover:text-brand-accent transition-colors border border-brand-primary px-4 py-2 rounded-lg hover:bg-brand-primary hover:text-white"
              >
                Logout
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Email</h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Account Created</h2>
                <p className="text-gray-600">
                  {user?.metadata.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Assessment History</h2>
            {loading ? (
              <p className="text-gray-600">Loading results...</p>
            ) : results.length > 0 ? (
              <div className="space-y-6">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Assessment {new Date(result.timestamp).toLocaleDateString()}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className="text-sm font-medium text-gray-500">Score</span>
                          <p className="text-lg font-semibold text-brand-primary">
                            {result.score}%
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-gray-500">Risk Level</span>
                          <p className={`text-lg font-semibold ${getRiskLevelColor(result.riskLevel)}`}>
                            {result.riskLevel}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Key Findings:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(result.answers).map(([key, value]) => (
                          <div key={key} className="bg-gray-50 p-3 rounded">
                            <p className="text-sm font-medium text-gray-700">{formatQuestion(key)}</p>
                            <p className="text-sm text-gray-600 mt-1">{formatAnswer(value)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No assessment results yet.</p>
                <a
                  href="/questionnaire"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-accent hover:text-brand-primary transition-all"
                >
                  Take Assessment
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const getRiskLevelColor = (riskLevel: string): string => {
  switch (riskLevel.toLowerCase()) {
    case 'high':
      return 'text-red-600';
    case 'medium':
      return 'text-yellow-600';
    case 'low':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
};

const formatQuestion = (key: string): string => {
  // Convert camelCase to Title Case and add spaces
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

const formatAnswer = (value: any): string => {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  return String(value);
};

export default Profile; 