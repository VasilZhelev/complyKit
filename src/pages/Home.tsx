import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Hero from '../components/landingPage/Hero';
import Features from '../components/landingPage/Features';
import HowItWorks from '../components/landingPage/HowItWorks';
import Pricing from '../components/landingPage/Pricing';
import Footer from '../components/layout/Footer';

const Home = () => {
  useEffect(() => {
    // Handle smooth scrolling for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.hash) {
        e.preventDefault();
        const targetElement = document.querySelector(anchor.hash);
        
        if (targetElement) {
          const headerOffset = 80; // Height of the fixed header
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without page reload
          window.history.pushState(null, '', anchor.hash);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-grow">
        <section id="home" className="scroll-mt-20">
          <Hero />
        </section>
        <section id="features" className="scroll-mt-20">
          <Features />
        </section>
        <section id="how-it-works" className="scroll-mt-20">
          <HowItWorks />
        </section>
        <section id="pricing" className="scroll-mt-20">
          <Pricing />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home; 