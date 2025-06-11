import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Hero from '../components/landingPage/Hero';
import Features from '../components/landingPage/Features';
import HowItWorks from '../components/landingPage/HowItWorks';
import Pricing from '../components/landingPage/Pricing';
import Footer from '../components/layout/Footer';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default Home; 