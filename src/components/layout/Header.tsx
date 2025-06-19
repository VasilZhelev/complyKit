import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../utils/AuthContext';
import { useProMode } from '../../utils/ProModeContext';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { proMode } = useProMode();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-neutral-medium"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">⚖️</span>
            <span className="text-xl font-semibold text-brand-primary">ComplyKit</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/#home" className="text-brand-primary hover:text-brand-accent transition-colors">
              Home
            </a>
            <a href="/#features" className="text-brand-primary hover:text-brand-accent transition-colors">
              Features
            </a>
            <a href="/#pricing" className="text-brand-primary hover:text-brand-accent transition-colors">
              Pricing
            </a>
            {proMode && (
              <Link to="/dashboard" className="text-brand-primary hover:text-brand-accent transition-colors font-semibold">
                Dashboard
              </Link>
            )}
            {user ? (
              <>
                <Link to="/profile" className="text-brand-primary hover:text-brand-accent transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-brand-primary hover:text-brand-accent transition-colors border border-brand-primary px-4 py-2 rounded-lg hover:bg-brand-primary hover:text-white">
                  Login
                </Link>
                <Link to="/signup" className="bg-brand-accent text-white px-4 py-2 rounded-lg hover:bg-brand-primary hover:text-white transition-all">
                  Sign Up
                </Link>
              </>
            )}
            {!user && (
              <Link 
                to="/questionnaire" 
                className="bg-brand-primary text-white px-6 py-2.5 rounded-lg hover:bg-brand-accent hover:text-brand-primary transition-all"
              >
                Check Compliance
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="h-6 w-6 text-brand-primary"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4"
          >
            <div className="flex flex-col space-y-4">
              <a
                href="/#home"
                className="text-brand-primary hover:text-brand-accent transition-colors px-4 py-2"
                onClick={() => setIsOpen(false)}
              >
                Home
              </a>
              <a
                href="/#features"
                className="text-brand-primary hover:text-brand-accent transition-colors px-4 py-2"
                onClick={() => setIsOpen(false)}
              >
                Features
              </a>
              <a
                href="/#pricing"
                className="text-brand-primary hover:text-brand-accent transition-colors px-4 py-2"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </a>
              {proMode && (
                <Link
                  to="/dashboard"
                  className="text-brand-primary hover:text-brand-accent transition-colors px-4 py-2 font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="text-brand-primary hover:text-brand-accent transition-colors px-4 py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center">
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </div>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-brand-primary hover:text-brand-accent transition-colors border border-brand-primary px-4 py-2 rounded-lg hover:bg-brand-primary hover:text-white mx-4"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-brand-accent text-white px-4 py-2 rounded-lg hover:bg-brand-primary hover:text-white transition-all mx-4"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
              {!user && (
                <Link
                  to="/questionnaire"
                  className="bg-brand-primary text-white px-6 py-2.5 rounded-lg hover:bg-brand-accent hover:text-brand-primary transition-all mx-4"
                  onClick={() => setIsOpen(false)}
                >
                  Check Compliance
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header; 