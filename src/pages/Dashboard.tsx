import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import jsPDF from 'jspdf';
import { ExclamationTriangleIcon, InformationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface DashboardProps {
  complianceSummary?: string;
}

const updateCards = [
  {
    type: 'danger',
    title: 'Critical Update',
    message: 'The EU AI Act has introduced new high-risk system requirements. Review your compliance status immediately.',
    icon: <ExclamationTriangleIcon className="w-7 h-7 text-red-600" />,
    color: 'bg-red-50 border-red-200',
    flag: 'Danger',
  },
  {
    type: 'info',
    title: 'Transparency Reminder',
    message: 'Transparency notices are now mandatory for all limited-risk AI systems. Make sure your documentation is up to date.',
    icon: <InformationCircleIcon className="w-7 h-7 text-blue-600" />,
    color: 'bg-blue-50 border-blue-200',
    flag: 'Info',
  },
  {
    type: 'update',
    title: 'Compliance Deadline',
    message: 'The next compliance deadline is September 30, 2024. Prepare your risk policy and data sheet in advance.',
    icon: <CheckCircleIcon className="w-7 h-7 text-green-600" />,
    color: 'bg-green-50 border-green-200',
    flag: 'Update',
  },
];

const Dashboard: React.FC<DashboardProps> = ({ complianceSummary }) => {
  const navigate = useNavigate();
  const [showPdfModal, setShowPdfModal] = useState(false);

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Compliance Summary', 10, 20);
    doc.setFontSize(11);
    const text = complianceSummary || 'No compliance summary available.';
    doc.text(doc.splitTextToSize(text, 180), 10, 30);
    doc.save('compliance-summary.pdf');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Back to Landing Page Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-accent transition-all shadow"
            >
              Back to Landing Page
            </button>
          </div>
          {/* Section 1: Stay Updated */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6 text-brand-primary">Stay Updated on the AI EU Act</h2>
            <div className="flex flex-col md:flex-row gap-6">
              {updateCards.map((card, idx) => (
                <div
                  key={idx}
                  className={`relative flex-1 min-w-[260px] max-w-md border ${card.color} rounded-2xl shadow-lg p-6 flex flex-col justify-between`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {card.icon}
                    <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                      card.type === 'danger' ? 'bg-red-100 text-red-700' :
                      card.type === 'info' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>{card.flag}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-brand-primary">{card.title}</h3>
                  <p className="text-brand-neutral-dark mb-2 text-sm">{card.message}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Compliance Summary */}
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-brand-primary">Compliance Summary</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadPdf}
                  className="px-3 py-1 bg-brand-accent text-white rounded hover:bg-brand-primary text-sm"
                >
                  Download as PDF
                </button>
                <button
                  onClick={() => setShowPdfModal(true)}
                  className="px-3 py-1 bg-brand-primary text-white rounded hover:bg-brand-accent text-sm"
                >
                  View as PDF
                </button>
              </div>
            </div>
            <p className="text-gray-700 whitespace-pre-line">
              {complianceSummary || 'Your latest compliance summary will be shown here. (Demo placeholder)'}
            </p>
          </section>

          {/* PDF Modal */}
          {showPdfModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative">
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-brand-primary"
                >
                  ✕
                </button>
                <iframe
                  title="Compliance Summary PDF Preview"
                  srcDoc={`<html><body style='margin:0;padding:2em;font-family:sans-serif;'><h2>Compliance Summary</h2><pre style='white-space:pre-wrap;'>${complianceSummary || 'No compliance summary available.'}</pre></body></html>`}
                  style={{ width: '100%', height: '500px', border: 'none' }}
                />
              </div>
            </div>
          )}

          {/* Section 3: Document Generation */}
          <section className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-brand-primary">Generate Key Documents</h2>
            <p className="text-gray-700 mb-4 text-center">Generate your Transparency Notice, Data Sheet, and Risk Policy using AI.</p>
            <button
              onClick={() => navigate('/generate-documents')}
              className="px-8 py-3 bg-brand-accent text-white rounded-lg font-semibold text-lg hover:bg-brand-primary transition-all shadow"
            >
              Go to Document Generation
            </button>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard; 