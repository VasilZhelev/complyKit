import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

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
            <Link to="/" className="text-brand-primary hover:text-brand-accent transition-colors">
              Home
            </Link>
            <Link to="/questionnaire" className="text-brand-primary hover:text-brand-accent transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="text-brand-primary hover:text-brand-accent transition-colors">
              Pricing
            </Link>
            <Link 
              to="/questionnaire" 
              className="bg-brand-primary text-white px-6 py-2.5 rounded-lg hover:bg-brand-accent hover:text-brand-primary transition-all"
            >
              Check Compliance
            </Link>
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
              <Link
                to="/"
                className="text-brand-primary hover:text-brand-accent transition-colors px-4 py-2"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/questionnaire"
                className="text-brand-primary hover:text-brand-accent transition-colors px-4 py-2"
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>
              <Link
                to="/pricing"
                className="text-brand-primary hover:text-brand-accent transition-colors px-4 py-2"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/questionnaire"
                className="bg-brand-primary text-white px-6 py-2.5 rounded-lg hover:bg-brand-accent hover:text-brand-primary transition-all mx-4"
                onClick={() => setIsOpen(false)}
              >
                Check Compliance
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header; 