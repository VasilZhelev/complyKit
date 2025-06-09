import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Features = () => {
  const features = [
    {
      title: 'AI Risk Detective',
      description: 'Our smart system analyzes your AI like a detective, finding potential compliance issues before they become problems.',
      icon: '🔍',
      color: 'from-brand-primary/10 to-brand-primary/5'
    },
    {
      title: 'Magic Document Maker',
      description: 'One click and poof! All your compliance documents appear, ready to go. No legal jargon, just clear, simple language.',
      icon: '✨',
      color: 'from-brand-accent/10 to-brand-accent/5'
    },
    {
      title: 'Compliance Guardian',
      description: 'We keep watch over your AI compliance like a friendly guardian, sending you updates when you need to make changes.',
      icon: '🛡️',
      color: 'from-brand-success/10 to-brand-success/5'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-brand-primary mb-6"
          >
            Making Compliance Fun and Easy
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-brand-neutral-dark"
          >
            No more boring legal stuff. We've made EU AI compliance simple and even a bit fun!
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl transform transition-transform duration-300 group-hover:scale-105`}></div>
              <div className="relative p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-neutral-light hover:border-brand-primary/20 transition-colors duration-300">
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-brand-primary mb-2">{feature.title}</h3>
                <p className="text-brand-neutral-dark">{feature.description}</p>
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
          <Link
            to="/questionnaire"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-brand-primary rounded-xl hover:bg-brand-accent hover:text-brand-primary transition-all duration-300 transform hover:scale-105"
          >
            Try it yourself
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Features; 