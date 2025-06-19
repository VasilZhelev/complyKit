import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProMode } from '../../utils/ProModeContext';

const Pricing = () => {
  const { proMode, setProMode } = useProMode();
  const plans = [
    {
      name: 'Free',
      price: '€0',
      description: 'Perfect for trying out our compliance checker',
      features: [
        'Basic risk assessment',
        'Essential compliance guide',
        'Community support',
        'Basic documentation'
      ],
      cta: 'Start Free',
      highlighted: false
    },
    {
      name: 'Pro',
      price: '€39',
      description: 'Everything you need for full compliance',
      features: [
        'Full risk assessment',
        'One-click documentation',
        'Priority support',
        'Regular updates',
        'Compliance monitoring'
      ],
      cta: 'Get Pro',
      highlighted: true
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-brand-neutral-light">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-brand-primary mb-6"
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-brand-neutral-dark"
          >
            Start free, upgrade when you need more features. No hidden fees.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`relative ${plan.highlighted ? 'md:-mt-8 md:mb-8' : ''}`}
            >
              <div className={`h-full p-8 rounded-2xl ${
                plan.highlighted 
                  ? 'bg-brand-primary text-white shadow-xl' 
                  : 'bg-white border border-brand-neutral-light'
              }`}>
                <div className="mb-8">
                  <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-brand-primary'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline mb-4">
                    <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-brand-primary'}`}>
                      {plan.price}
                    </span>
                    {plan.price !== '€0' && (
                      <span className={`ml-2 ${plan.highlighted ? 'text-white/80' : 'text-brand-neutral-dark'}`}>
                        /one-time
                      </span>
                    )}
                  </div>
                  <p className={`${plan.highlighted ? 'text-white/80' : 'text-brand-neutral-dark'}`}>
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <svg 
                        className={`w-5 h-5 mr-3 ${plan.highlighted ? 'text-brand-accent' : 'text-brand-primary'}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M5 13l4 4L19 7" 
                        />
                      </svg>
                      <span className={plan.highlighted ? 'text-white/90' : 'text-brand-neutral-dark'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/questionnaire"
                  className={`block w-full text-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    plan.highlighted
                      ? 'bg-brand-accent text-brand-primary hover:bg-white'
                      : 'bg-brand-primary text-white hover:bg-brand-accent hover:text-brand-primary'
                  }`}
                >
                  {plan.cta}
                </Link>
                {/* Pro Mode Slider below Get Pro button for Pro plan */}
                {plan.highlighted && (
                  <div className="flex items-center space-x-2 bg-white/80 px-4 py-2 rounded-xl shadow border w-fit mt-4 mx-auto">
                    <label htmlFor="pro-mode-toggle-pricing" className="font-semibold text-brand-primary">Pro Mode (Demo)</label>
                    <input
                      id="pro-mode-toggle-pricing"
                      type="checkbox"
                      checked={proMode}
                      onChange={e => setProMode(e.target.checked)}
                      className="w-6 h-6 accent-brand-accent cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-brand-neutral-dark mb-4">Need a custom solution for your team?</p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-brand-primary bg-white border-2 border-brand-primary rounded-xl hover:bg-brand-primary hover:text-white transition-all duration-300"
          >
            Contact us
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing; 