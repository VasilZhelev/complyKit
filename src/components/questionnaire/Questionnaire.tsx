import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../utils/AuthContext';
import { setDocument } from '../../utils/firebase';
import ResultsPage from './ResultsPage';
import type { RiskLevel } from '../../types/questionnaire';

// Types
type QuestionType = 'text' | 'select' | 'radio' | 'checkbox' | 'email' | 'url';

interface Question {
  id: string;
  text: string;
  type: QuestionType;
  helperText?: string;
  options?: string[];
  required?: boolean;
  dependsOn?: {
    questionId: string;
    value: string;
  };
}

interface QuestionnaireStep {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

// Questionnaire Steps Data
const questionnaireSteps: QuestionnaireStep[] = [
  {
    id: 'basics',
    title: 'Let\'s get to know each other',
    description: 'Just a few quick questions to help us personalize your experience.',
    questions: [
      {
        id: 'company_name',
        text: 'What\'s your company name?',
        type: 'text',
        helperText: 'e.g., "Celestial AI Inc."',
        required: true
      },
      {
        id: 'role',
        text: 'What\'s your role on the team?',
        type: 'select',
        options: [
          'Founder/CEO',
          'CTO',
          'Product Manager',
          'Engineer',
          'Compliance Officer',
          'Other'
        ],
        required: true
      }
    ]
  },
  {
    id: 'scope',
    title: 'Does the EU AI Act apply to you?',
    description: 'Let\'s quickly check if you need to worry about compliance.',
    questions: [
      {
        id: 'uses_ai',
        text: 'Does your product use AI or machine learning?',
        type: 'radio',
        options: ['Yes', 'No'],
        helperText: 'This includes everything from simple models to complex neural networks.',
        required: true
      },
      {
        id: 'eu_reach',
        text: 'Will your AI be used by people in the European Union?',
        type: 'radio',
        options: ['Yes', 'No', 'Not sure yet'],
        helperText: 'If you have users or clients in any EU country, select "Yes".',
        required: true,
        dependsOn: {
          questionId: 'uses_ai',
          value: 'Yes'
        }
      }
    ]
  },
  {
    id: 'ai_profile',
    title: 'Tell us about your AI',
    description: 'Help us understand what your AI does in simple terms.',
    questions: [
      {
        id: 'purpose',
        text: 'What does your AI system do?',
        type: 'text',
        helperText: 'e.g., "Our AI helps doctors identify early signs of lung cancer from CT scans."',
        required: true
      },
      {
        id: 'users',
        text: 'Who uses your AI system?',
        type: 'select',
        options: [
          'Our internal team only',
          'Business customers (B2B)',
          'The general public (B2C)',
          'Government or public sector'
        ],
        required: true
      },
      {
        id: 'human_oversight',
        text: 'Can humans review and override the AI\'s decisions?',
        type: 'radio',
        options: [
          'Yes, always',
          'Yes, sometimes',
          'No, it\'s fully autonomous'
        ],
        required: true
      }
    ]
  },
  {
    id: 'risk_assessment',
    title: 'Let\'s check the risk level',
    description: 'We\'ll help you understand if your AI needs special attention.',
    questions: [
      {
        id: 'use_areas',
        text: 'Where is your AI used? (Select all that apply)',
        type: 'checkbox',
        options: [
          'Hiring & Employee Management',
          'Critical Infrastructure',
          'Education',
          'Access to Services or Credit',
          'Law Enforcement & Justice',
          'Migration & Border Control',
          'Biometric Identification',
          'None of the above'
        ],
        required: true
      },
      {
        id: 'data_types',
        text: 'What kind of data does your AI analyze? (Select all that apply)',
        type: 'checkbox',
        options: [
          'Facial images or biometric data',
          'Emotional state recognition',
          'Profiling or scoring individuals',
          'Voice patterns',
          'None of the above'
        ],
        required: true
      },
      {
        id: 'ai_interaction',
        text: 'Do people interact with your AI without knowing it\'s an AI?',
        type: 'radio',
        options: ['Yes', 'No'],
        helperText: 'Think of advanced chatbots or systems that generate "deepfake" content.',
        required: true
      }
    ]
  },
  {
    id: 'contact',
    title: 'Almost done!',
    description: 'Just a few final details for your compliance documents.',
    questions: [
      {
        id: 'compliance_email',
        text: 'What\'s the best email for compliance matters?',
        type: 'email',
        helperText: 'This will be listed in your public-facing policies.',
        required: true
      },
      {
        id: 'website',
        text: 'What\'s your company\'s website?',
        type: 'url',
        helperText: 'e.g., "https://www.celestial.ai"',
        required: true
      }
    ]
  }
];

// Risk Assessment Algorithm
const assessRisk = (answers: Record<string, string | string[]>): RiskLevel => {
  // Preamble: Initial Scope Check
  if (answers['uses_ai'] === 'No') {
    return 'OUT_OF_SCOPE';
  }
  if (answers['eu_reach'] === 'No') {
    return 'OUT_OF_SCOPE';
  }

  // Level 1: Unacceptable Risk Check
  const purpose = (answers['purpose'] as string || '').toLowerCase();
  const useAreas = answers['use_areas'] as string[] || [];
  const dataTypes = answers['data_types'] as string[] || [];
  const users = answers['users'] as string || '';
  const humanOversight = answers['human_oversight'] as string || '';

  // Unacceptable Risk: Social scoring and manipulative AI
  if (
    dataTypes.includes('Profiling or scoring individuals') &&
    (purpose.includes('social score') ||
      purpose.includes('social credit') ||
      purpose.includes('citizen score') ||
      purpose.includes('trustworthiness score'))
  ) {
    return 'UNACCEPTABLE_RISK';
  }

  // Unacceptable Risk: Emotion recognition in sensitive areas
  if (
    dataTypes.includes('Emotional state recognition') &&
    (useAreas.includes('Hiring & Employee Management') ||
      useAreas.includes('Education') ||
      useAreas.includes('Law Enforcement & Justice'))
  ) {
    return 'UNACCEPTABLE_RISK';
  }

  // High Risk: Critical infrastructure and essential services
  if (
    useAreas.includes('Critical Infrastructure') ||
    useAreas.includes('Law Enforcement & Justice') ||
    useAreas.includes('Migration & Border Control') ||
    useAreas.includes('Biometric Identification') ||
    (useAreas.includes('Access to Services or Credit') && users === 'The general public (B2C)') ||
    (useAreas.includes('Hiring & Employee Management') && users === 'The general public (B2C)')
  ) {
    return 'HIGH_RISK';
  }

  // High Risk: Biometric data processing
  if (
    dataTypes.includes('Facial images or biometric data') ||
    dataTypes.includes('Voice patterns')
  ) {
    return 'HIGH_RISK';
  }

  // High Risk: Autonomous systems in sensitive areas
  if (
    humanOversight === 'No, it\'s fully autonomous' &&
    (useAreas.includes('Access to Services or Credit') ||
      useAreas.includes('Hiring & Employee Management') ||
      useAreas.includes('Education'))
  ) {
    return 'HIGH_RISK';
  }

  // Limited Risk: AI systems with transparency requirements
  if (
    answers['ai_interaction'] === 'Yes' ||
    purpose.includes('avatar') ||
    purpose.includes('generate video') ||
    purpose.includes('voice cloning') ||
    purpose.includes('deepfake') ||
    purpose.includes('chatbot') ||
    purpose.includes('virtual assistant')
  ) {
    return 'LIMITED_RISK';
  }

  // Limited Risk: B2C applications
  if (users === 'The general public (B2C)') {
    return 'LIMITED_RISK';
  }

  // Minimal Risk: Internal use or B2B with human oversight
  if (
    users === 'Our internal team only' ||
    (users === 'Business customers (B2B)' && humanOversight !== 'No, it\'s fully autonomous')
  ) {
    return 'MINIMAL_RISK';
  }

  // Default to Limited Risk for safety
  return 'LIMITED_RISK';
};

const Questionnaire: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showResults, setShowResults] = useState(false);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('MINIMAL_RISK');

  const handleAnswer = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < questionnaireSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Calculate risk level when completing the questionnaire
      const newRiskLevel = assessRisk(answers);
      setRiskLevel(newRiskLevel);
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSaveResults = async () => {
    const score = calculateScore();
    const result = {
      userId: user?.uid,
      timestamp: new Date().toISOString(),
      answers,
      score,
      riskLevel
    };

    try {
      if (user) {
        // Save to database for logged-in users
        await setDocument('questionnaire_results', result);
        // Store in localStorage as backup
        const savedResults = JSON.parse(localStorage.getItem('questionnaire_results') || '[]');
        savedResults.push(result);
        localStorage.setItem('questionnaire_results', JSON.stringify(savedResults));
      } else {
        // For non-logged-in users, store in localStorage
        const savedResults = JSON.parse(localStorage.getItem('questionnaire_results') || '[]');
        savedResults.push(result);
        localStorage.setItem('questionnaire_results', JSON.stringify(savedResults));
        // Redirect to signup with results in localStorage
        window.location.href = '/signup?plan=pro&price=39';
      }
    } catch (error) {
      console.error('Error saving results:', error);
    }
  };

  // Check for saved results after login/signup
  useEffect(() => {
    const checkSavedResults = async () => {
      if (user) {
        const savedResults = JSON.parse(localStorage.getItem('questionnaire_results') || '[]');
        if (savedResults.length > 0) {
          try {
            // Save all pending results to database
            for (const result of savedResults) {
              await setDocument('questionnaire_results', {
                ...result,
                userId: user.uid
              });
            }
            // Clear localStorage after successful save
            localStorage.removeItem('questionnaire_results');
          } catch (error) {
            console.error('Error saving pending results:', error);
          }
        }
      }
    };

    checkSavedResults();
  }, [user]);

  const calculateScore = (): number => {
    let score = 0;
    const totalQuestions = Object.keys(answers).length;
    
    // Example scoring logic
    if (answers['uses_ai'] === 'Yes') score += 20;
    if (answers['eu_reach'] === 'Yes') score += 20;
    if (answers['human_oversight'] === 'Yes, always') score += 20;
    
    return Math.round((score / totalQuestions) * 100);
  };

  const isLastStep = currentStep === questionnaireSteps.length - 1;
  const isFirstStep = currentStep === 0;
  const progress = ((currentStep + 1) / questionnaireSteps.length) * 100;

  if (showResults) {
    return (
      <ResultsPage
        answers={answers}
        riskLevel={riskLevel}
        onSave={handleSaveResults}
        isAuthenticated={!!user}
      />
    );
  }

  const currentStepData = questionnaireSteps[currentStep];

  return (
    <div className="min-h-screen bg-brand-neutral-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-2 bg-brand-neutral-medium rounded-full">
            <motion.div
              className="h-full bg-brand-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-sm text-brand-neutral-dark mt-2">
            Step {currentStep + 1} of {questionnaireSteps.length}
          </p>
        </div>

        {/* Step content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-3xl font-bold text-brand-primary mb-2">
            {currentStepData.title}
          </h2>
          <p className="text-brand-neutral-dark mb-8">
            {currentStepData.description}
          </p>

          <div className="space-y-6">
            {currentStepData.questions.map((question) => {
              const isVisible = !question.dependsOn || 
                answers[question.dependsOn.questionId] === question.dependsOn.value;

              if (!isVisible) return null;

              return (
                <div key={question.id} className="space-y-2">
                  <label className="block text-lg font-medium text-brand-primary">
                    {question.text}
                  </label>
                  {question.helperText && (
                    <p className="text-sm text-brand-neutral-dark">
                      {question.helperText}
                    </p>
                  )}

                  {question.type === 'text' && (
                    <input
                      type="text"
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswer(question.id, e.target.value)}
                      className="w-full px-4 py-2 border border-brand-neutral-medium rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                      required={question.required}
                    />
                  )}

                  {question.type === 'email' && (
                    <input
                      type="email"
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswer(question.id, e.target.value)}
                      className="w-full px-4 py-2 border border-brand-neutral-medium rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                      required={question.required}
                    />
                  )}

                  {question.type === 'url' && (
                    <input
                      type="url"
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswer(question.id, e.target.value)}
                      className="w-full px-4 py-2 border border-brand-neutral-medium rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                      required={question.required}
                    />
                  )}

                  {question.type === 'select' && question.options && (
                    <select
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswer(question.id, e.target.value)}
                      className="w-full px-4 py-2 border border-brand-neutral-medium rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                      required={question.required}
                    >
                      <option value="">Select an option</option>
                      {question.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}

                  {question.type === 'radio' && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option) => (
                        <label key={option} className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name={question.id}
                            value={option}
                            checked={answers[question.id] === option}
                            onChange={(e) => handleAnswer(question.id, e.target.value)}
                            className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-brand-neutral-medium"
                            required={question.required}
                          />
                          <span className="text-brand-neutral-dark">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === 'checkbox' && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option) => (
                        <label key={option} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            value={option}
                            checked={(answers[question.id] as string[] || []).includes(option)}
                            onChange={(e) => {
                              const currentValues = answers[question.id] as string[] || [];
                              const newValues = e.target.checked
                                ? [...currentValues, option]
                                : currentValues.filter((v: string) => v !== option);
                              handleAnswer(question.id, newValues);
                            }}
                            className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-brand-neutral-medium rounded"
                          />
                          <span className="text-brand-neutral-dark">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Navigation buttons */}
          <div className="mt-8 flex justify-between">
            {!isFirstStep && (
              <button
                onClick={handlePrevious}
                className="px-6 py-2 border border-brand-neutral-medium rounded-lg text-brand-primary hover:bg-brand-neutral-light transition-colors"
              >
                ← Back
              </button>
            )}
            <button
              onClick={handleNext}
              className={`px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-dark transition-colors ${
                isFirstStep ? 'ml-auto' : ''
              }`}
            >
              {isLastStep ? 'Finish' : 'Next →'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Questionnaire;
