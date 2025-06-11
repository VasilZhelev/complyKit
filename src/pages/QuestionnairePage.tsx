import React from 'react';
import { motion } from 'framer-motion';
import Questionnaire from '../components/questionnaire/Questionnaire';

const QuestionnairePage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Compliance Assessment
          </h1>
          <p className="text-lg text-gray-600">
            Let's evaluate your AI system's compliance with the EU AI Act
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Questionnaire />
        </div>
      </div>
    </motion.div>
  );
};

export default QuestionnairePage; 