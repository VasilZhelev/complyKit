import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-brand-neutral-light">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold text-brand-primary">
              How It Works
            </h2>
            <p className="text-xl text-brand-neutral-dark leading-relaxed">
              Think of us as your friendly AI compliance buddy. We'll guide you through the process step by step, making sure you understand everything along the way.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-accent/20 rounded-full flex items-center justify-center">
                  <span className="text-lg">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-primary">Tell us about your AI</h3>
                  <p className="text-brand-neutral-dark">Just answer a few simple questions about your AI system. No technical jargon, we promise!</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-accent/20 rounded-full flex items-center justify-center">
                  <span className="text-lg">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-primary">Get your risk level</h3>
                  <p className="text-brand-neutral-dark">We'll analyze your AI and tell you exactly what you need to do to stay compliant.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-accent/20 rounded-full flex items-center justify-center">
                  <span className="text-lg">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-primary">Get your documents</h3>
                  <p className="text-brand-neutral-dark">We'll generate all the necessary documents in plain, easy-to-understand language.</p>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <Link
                to="/questionnaire"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-brand-primary rounded-xl hover:bg-brand-accent hover:text-brand-primary transition-all duration-300 transform hover:scale-105"
              >
                Start your compliance journey
              </Link>
            </div>
          </motion.div>

          {/* Right Column - Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 rounded-3xl p-8">
              <div className="w-full h-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 flex items-center justify-center">
                <span className="text-8xl">⚖️</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 