import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateComplianceSummary } from '../../utils/ComplianceSummaryGeneration';

type RiskLevel = 'HIGH_RISK' | 'LIMITED_RISK' | 'MINIMAL_RISK' | 'UNACCEPTABLE_RISK' | 'OUT_OF_SCOPE';

interface ResultsPageProps {
  riskLevel: RiskLevel;
  companyName: string;
  answers: Record<string, any>;
}


const ResultsPage: React.FC<ResultsPageProps> = ({ riskLevel, companyName, answers }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analysisSteps = [
    'Analyzing system characteristics',
    'Evaluating compliance requirements',
    'Generating personalized insights',
    'Preparing detailed recommendations'
  ];

  useEffect(() => {
    const runAnalysis = async () => {
      try {
        // Start step progression
        const stepInterval = setInterval(() => {
          setCurrentStep(prev => (prev < analysisSteps.length - 1 ? prev + 1 : prev));
        }, 1250);

        // Get the AI analysis
        const analysis = await generateComplianceSummary(answers, riskLevel);
        
        // Clear the interval and update state
        clearInterval(stepInterval);
        setIsAnalyzing(false);
        setAiAnalysis(analysis);
      } catch (error) {
        console.error('Error during analysis:', error);
        setIsAnalyzing(false);
        setError('Failed to generate analysis');
      }
    };

    runAnalysis();
  }, [answers, riskLevel]);

  const getRiskLevelConfig = () => {
    const riskLevelConfig = {
      HIGH_RISK: {
        emoji: '🔴',
        title: 'High-Risk AI System',
        description: 'Your AI system requires comprehensive compliance measures',
        mainMessage: 'We understand the weight of compliance on your shoulders',
        riskAssessment: {
          title: 'Why This Classification?',
          reasons: [
            'Your system operates in a regulated sector (healthcare, finance, or hiring)',
            'It processes sensitive data like biometric information',
            'It makes significant decisions about people\'s lives',
            'It falls under Article 6 of the EU AI Act'
          ],
          impact: 'This classification means you need to implement comprehensive risk management and documentation before deployment.'
        },
        valueProps: [
          {
            title: 'Complete Documentation Suite',
            description: 'All required EU AI Act documents, pre-filled with your system details',
            icon: '📋'
          },
          {
            title: 'Risk Management System',
            description: 'End-to-end risk assessment and mitigation framework',
            icon: '🛡️'
          },
          {
            title: 'Expert Guidance',
            description: 'Step-by-step support from AI compliance specialists',
            icon: '👥'
          },
          {
            title: 'Ongoing Updates',
            description: 'Automatic updates as regulations evolve',
            icon: '🔄'
          }
        ],
        trustIndicators: [
          'Used by 1000+ AI companies',
          '24/7 expert support',
          '30-day money-back guarantee',
          'Regular compliance audits'
        ]
      },
      LIMITED_RISK: {
        emoji: '🟡',
        title: 'Limited Risk AI System',
        description: 'Your AI system needs transparency measures',
        mainMessage: 'Let us handle the transparency requirements',
        riskAssessment: {
          title: 'Why This Classification?',
          reasons: [
            'Your system interacts directly with users',
            'It generates or manipulates content',
            'It requires transparency about AI usage',
            'It falls under Article 52 of the EU AI Act'
          ],
          impact: 'This classification means you need to implement specific transparency measures and maintain clear documentation.'
        },
        valueProps: [
          {
            title: 'Transparency Package',
            description: 'Custom transparency notices and user communications',
            icon: '📢'
          },
          {
            title: 'User Guidelines',
            description: 'Clear documentation for user interaction',
            icon: '📝'
          },
          {
            title: 'Compliance Monitoring',
            description: 'Regular checks to ensure ongoing compliance',
            icon: '👀'
          },
          {
            title: 'Update Service',
            description: 'Automatic updates for new requirements',
            icon: '🔄'
          }
        ],
        trustIndicators: [
          'Trusted by 800+ companies',
          '24/7 support',
          '30-day guarantee',
          'Regular compliance checks'
        ]
      },
      MINIMAL_RISK: {
        emoji: '🟢',
        title: 'Minimal Risk AI System',
        description: 'Your AI system has minimal compliance requirements',
        mainMessage: 'Stay ahead of evolving regulations',
        riskAssessment: {
          title: 'Why This Classification?',
          reasons: [
            'Your system doesn\'t fall under specific EU AI Act categories',
            'It has limited impact on individuals',
            'It operates in a non-regulated domain',
            'It doesn\'t process sensitive data'
          ],
          impact: 'While your current obligations are minimal, staying informed about regulatory changes is important.'
        },
        valueProps: [
          {
            title: 'Compliance Monitoring',
            description: 'Regular checks to maintain your compliant status',
            icon: '📊'
          },
          {
            title: 'Early Warning System',
            description: 'Get notified of regulatory changes before they impact you',
            icon: '🔔'
          },
          {
            title: 'Documentation Updates',
            description: 'Automatic updates to your compliance documents',
            icon: '📝'
          },
          {
            title: 'Expert Support',
            description: 'Access to compliance experts when needed',
            icon: '👥'
          }
        ],
        trustIndicators: [
          'Used by 500+ companies',
          '24/7 support',
          '30-day guarantee',
          'Regular updates'
        ]
      },
      UNACCEPTABLE_RISK: {
        emoji: '❗',
        title: 'Unacceptable Risk Detected',
        description: 'Your AI system requires immediate attention',
        mainMessage: 'Let\'s work together to make your system compliant',
        riskAssessment: {
          title: 'Why This Classification?',
          reasons: [
            'Your system may involve prohibited practices like social scoring',
            'It could be used in ways that violate the EU AI Act',
            'It falls under Article 5 of the EU AI Act',
            'It requires immediate modification to ensure compliance'
          ],
          impact: 'This classification means your system cannot be deployed in its current form and requires significant modifications.'
        },
        valueProps: [
          {
            title: 'System Modification Guide',
            description: 'Step-by-step guidance to make your system compliant',
            icon: '🛠️'
          },
          {
            title: 'Compliance Strategy',
            description: 'Custom strategy to meet all requirements',
            icon: '📈'
          },
          {
            title: 'Risk Mitigation',
            description: 'Comprehensive risk reduction plan',
            icon: '🎯'
          },
          {
            title: 'Ongoing Support',
            description: 'Continuous monitoring and assistance',
            icon: '🤝'
          }
        ],
        trustIndicators: [
          'Expert guidance',
          '24/7 support',
          '30-day guarantee',
          'Regular audits'
        ]
      },
      OUT_OF_SCOPE: {
        emoji: '✅',
        title: 'Out of Scope',
        description: 'Your system is not subject to the EU AI Act',
        mainMessage: 'Stay prepared for future compliance needs',
        riskAssessment: {
          title: 'Why This Classification?',
          reasons: [
            'Your system doesn\'t use AI as defined by the regulation',
            'It has no operational link to the European Union',
            'It falls outside the scope of the regulation',
            'It doesn\'t meet the criteria for any risk level'
          ],
          impact: 'While you\'re currently exempt, expanding to the EU or evolving your system could bring you under regulation.'
        },
        valueProps: [
          {
            title: 'Scope Monitoring',
            description: 'Regular checks to ensure you stay out of scope',
            icon: '📊'
          },
          {
            title: 'Early Warning System',
            description: 'Get notified if regulations change',
            icon: '🔔'
          },
          {
            title: 'Compliance Readiness',
            description: 'Preparation for potential future requirements',
            icon: '📝'
          },
          {
            title: 'Expert Support',
            description: 'Access to compliance experts when needed',
            icon: '👥'
          }
        ],
        trustIndicators: [
          'Used by 300+ companies',
          '24/7 support',
          '30-day guarantee',
          'Regular updates'
        ]
      }
    };
    return riskLevelConfig[riskLevel];
  };

  const config = getRiskLevelConfig();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-neutral-light via-brand-neutral-light/95 to-brand-neutral-light/90 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-primary/5 via-transparent to-transparent"></div>
        <div className="absolute -top-24 -right-24 text-[200px] text-brand-neutral-medium/5 rotate-12">
          {config.emoji}
        </div>
        <div className="absolute -bottom-32 -left-32 text-[200px] text-brand-neutral-medium/5 -rotate-12">
          {config.emoji}
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white via-white to-brand-neutral-light/50 rounded-3xl shadow-xl p-8 backdrop-blur-sm border border-white/20"
        >
          {/* Header Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="text-7xl mb-6"
            >
              {config.emoji}
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-primary to-brand-primary-dark bg-clip-text text-transparent mb-4">
              {config.title}
            </h1>
            <p className="text-xl text-brand-neutral-dark mb-8 max-w-2xl mx-auto">
              {config.description}
            </p>
          </div>

          {/* Problem Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Your Risk Assessment Results
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Based on your answers, we've determined your AI system's risk level and compliance requirements.
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl transform -rotate-1"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl">
                    {config.emoji}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {config.title}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {config.description}
                    </p>
                  </div>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6"></div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Why this classification?
                    </h4>
                    <p className="text-gray-600">
                      {config.riskAssessment.reasons.join(', ')}
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl transform rotate-1"></div>
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        What this means for you
                      </h4>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {config.riskAssessment.impact}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI Compliance Summary Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                AI-Powered Compliance Analysis
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our AI analyzes your system to provide personalized compliance insights
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl transform -rotate-1"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                {/* AI Analysis Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-3xl">
                    🤖
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      AI Compliance Analysis
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {isAnalyzing ? 'Analyzing your system...' : 'Analysis complete'}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6"></div>

                <div className="space-y-8">
                  {/* System Context */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        System Context
                      </h4>
                      <span className="text-sm text-purple-600 font-medium">
                        {isAnalyzing ? 'Analyzing...' : 'Complete'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Company</p>
                        <p className="text-gray-900 font-medium">{companyName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Risk Classification</p>
                        <p className="text-gray-900 font-medium">{config.title}</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Analysis Progress or Results */}
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                    {isAnalyzing ? (
                      <>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xl">
                            ⚡
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            AI Analysis in Progress
                          </h4>
                        </div>
                        
                        {/* Progress Steps */}
                        <div className="space-y-4 mb-8">
                          {analysisSteps.map((step, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                                {index <= currentStep ? (
                                  <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
                                ) : (
                                  <div className="w-3 h-3 rounded-full bg-purple-200"></div>
                                )}
                              </div>
                              <span className={`text-gray-700 ${index <= currentStep ? 'font-medium' : 'text-gray-400'}`}>
                                {step}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Loading Animation */}
                        <div className="relative">
                          <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                              style={{ width: `${((currentStep + 1) / analysisSteps.length) * 100}%` }}
                            ></div>
                          </div>
                          <div className="absolute -bottom-6 left-0 right-0 text-center">
                            <p className="text-sm text-gray-500">
                              Generating your personalized compliance analysis...
                            </p>
                          </div>
                        </div>
                      </>
                    ) : error ? (
                      <div className="text-red-600 p-4 bg-red-50 rounded-lg">
                        {error}
                      </div>
                    ) : (
                      <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                        {aiAnalysis}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Solution Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 relative"
          >
            {/* Background Emojis */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute inset-0 opacity-[0.03] text-8xl">
                {['🤖', '⚡', '🔒', '📊', '💡', '🎯', '🛡️', '📈'].map((emoji, index) => (
                  <div
                    key={index}
                    className="absolute"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      transform: `rotate(${Math.random() * 360}deg)`,
                    }}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Your Path to Compliance
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Let us handle the complex compliance requirements while you focus on building your AI system.
              </p>
            </div>

            {/* Main Message */}
            <div className="relative mb-16">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl transform -rotate-1"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl">
                    ✨
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Complete Compliance Package
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Everything you need to meet EU AI Act requirements
                    </p>
                  </div>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6"></div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Our comprehensive solution includes all necessary documentation, guidance, and support to ensure your AI system meets regulatory requirements. We'll help you navigate the complex landscape of AI compliance with confidence.
                </p>
              </div>
            </div>

            {/* Value Propositions */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: "📄",
                  title: "Automated Documents",
                  description: "Generate all required compliance documentation with our AI-powered system"
                },
                {
                  icon: "🎯",
                  title: "Expert Guidance",
                  description: "Step-by-step guidance from AI compliance experts"
                },
                {
                  icon: "🔄",
                  title: "Future Updates",
                  description: "Stay compliant with automatic updates as regulations evolve"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl transform transition-transform group-hover:scale-105"></div>
                  <div className="relative p-6">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl mb-4">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 mb-16">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Trusted by AI Innovators
                </h3>
                <p className="text-gray-600">
                  Join hundreds of companies who trust us with their compliance needs
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: "👥", text: "1000+ AI companies trust us" },
                  { icon: "💬", text: "24/7 expert support" },
                  { icon: "🛡️", text: "30-day money-back guarantee" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="inline-block"
              >
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-[2px]">
                  <button
                    onClick={() => window.location.href = 'https://buy.stripe.com/your-link'}
                    className="w-full bg-white rounded-xl px-8 py-4 text-lg font-semibold text-gray-900 hover:bg-opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Get Started Now • $29
                  </button>
                </div>
                <p className="mt-4 text-gray-600">
                  One-time payment • No subscription required
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-brand-neutral-medium/20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-brand-neutral-dark">
                Report for: {companyName} • Generated on: {new Date().toLocaleDateString()}
              </p>
              <p className="text-sm text-brand-neutral-dark text-center md:text-right">
                This report is a preliminary analysis and does not constitute legal advice.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsPage; 