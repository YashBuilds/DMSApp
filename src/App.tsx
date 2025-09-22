import React, { useState, useEffect } from 'react';
import { FileText, Search, Upload, Phone, Shield, Tag, Calendar, User, Filter, Download, Eye } from 'lucide-react';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import UploadDocument from './components/UploadDocument';
import SearchDocuments from './components/SearchDocuments';

function App() {
  const [currentView, setCurrentView] = useState('auth');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState('');

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('auth_token');
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
      setCurrentView('dashboard');
    }
  }, []);

  const handleAuth = (token: string) => {
    setAuthToken(token);
    setIsAuthenticated(true);
    localStorage.setItem('auth_token', token);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setAuthToken('');
    setIsAuthenticated(false);
    localStorage.removeItem('auth_token');
    setCurrentView('auth');
  };

  const renderCurrentView = () => {
    if (!isAuthenticated) {
      return <AuthScreen onAuth={handleAuth} />;
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard token={authToken} />;
      case 'upload':
        return <UploadDocument token={authToken} />;
      case 'search':
        return <SearchDocuments token={authToken} />;
      default:
        return <Dashboard token={authToken} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && (
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <span className="text-xl font-semibold text-gray-900">Document Manager</span>
                </div>
                
                <div className="hidden md:flex space-x-6">
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentView === 'dashboard'
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>
                  
                  <button
                    onClick={() => setCurrentView('upload')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentView === 'upload'
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                  </button>
                  
                  <button
                    onClick={() => setCurrentView('search')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentView === 'search'
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </nav>
      )}
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;