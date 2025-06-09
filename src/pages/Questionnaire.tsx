import React from 'react';
import { QuestionnaireProvider } from '../lib/context/QuestionnaireContext';
import { questionnaireSteps } from '../lib/data/questionnaireSteps';
import QuestionnaireStep from '../components/questionnaire/QuestionnaireStep';
import { useQuestionnaire } from '../lib/context/QuestionnaireContext';

const QuestionnaireContent: React.FC = () => {
  const { state, steps, nextStep, previousStep, isStepComplete } = useQuestionnaire();
  const currentStepIndex = state.currentStep;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    if (isStepComplete(currentStepIndex)) {
      nextStep();
    }
  };

  const handlePrevious = () => {
    previousStep();
  };

  if (state.completed) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Assessment Complete!
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Thank you for completing the assessment. We'll analyze your responses and
          provide you with a detailed compliance report.
        </p>
        <div className="bg-indigo-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-indigo-900 mb-2">
            Risk Level: {state.riskLevel.toUpperCase()}
          </h3>
          <p className="text-indigo-700">
            Based on your responses, your AI system has been classified as{' '}
            {state.riskLevel} risk. Our team will review your assessment and
            provide detailed recommendations.
          </p>
        </div>
        <a
          href="/"
          className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Return to Home
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStepIndex + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Step Content */}
      {steps.map((step, index) => (
        <QuestionnaireStep
          key={step.id}
          step={step}
          isActive={index === currentStepIndex}
        />
      ))}

      {/* Navigation Buttons */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            className={`px-6 py-3 rounded-lg border ${
              currentStepIndex === 0
                ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:border-indigo-600 hover:text-indigo-600'
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!isStepComplete(currentStepIndex)}
            className={`px-6 py-3 rounded-lg ${
              isStepComplete(currentStepIndex)
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLastStep ? 'Complete Assessment' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Questionnaire: React.FC = () => {
  return (
    <QuestionnaireProvider steps={questionnaireSteps}>
      <QuestionnaireContent />
    </QuestionnaireProvider>
  );
};

export default Questionnaire; 