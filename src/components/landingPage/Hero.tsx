import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-screen pt-32 pb-20 bg-gradient-to-b from-brand-neutral-light to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-brand-primary leading-tight">
              EU AI compliance,{' '}
              <span className="text-brand-accent">handled.</span>
            </h1>
            <p className="text-xl text-brand-neutral-dark leading-relaxed">
              We'll handle the compliance while you focus on building your AI product. 
              Get your EU AI Act compliance sorted in minutes, not months.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/questionnaire"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-brand-primary rounded-xl hover:bg-brand-accent hover:text-brand-primary transition-all duration-300 transform hover:scale-105"
              >
                Check my AI compliance
              </Link>
              <Link
                to="#how-it-works"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-brand-primary bg-white border-2 border-brand-primary rounded-xl hover:bg-brand-primary hover:text-white transition-all duration-300"
              >
                How it works
              </Link>
            </div>
          </motion.div>

          {/* Right Column - Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 rounded-3xl p-8">
              <div className="w-full h-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 flex items-center justify-center">
                <span className="text-8xl">⚖️</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <p className="text-brand-neutral-dark mb-8">Trusted by AI startups across Europe</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {/* Replace with actual company logos */}
            <div className="h-8 w-32 bg-brand-neutral-medium rounded"></div>
            <div className="h-8 w-32 bg-brand-neutral-medium rounded"></div>
            <div className="h-8 w-32 bg-brand-neutral-medium rounded"></div>
            <div className="h-8 w-32 bg-brand-neutral-medium rounded"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero; 