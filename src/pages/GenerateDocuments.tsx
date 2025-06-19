import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { GoogleGenAI } from "@google/genai";
import { useAuth } from '../utils/AuthContext';
import { getDocuments, createWhereConstraint } from '../utils/db';
import jsPDF from 'jspdf';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

const prompts = {
  transparency: (context: string) => `You are an expert in AI compliance. Generate a clear, user-friendly Transparency Notice for an AI system, based on the following context: ${context}. The notice should explain what the system does, what data it uses, and how it impacts users, in plain language.`,
  datasheet: (context: string) => `You are an expert in AI compliance. Generate a Data Sheet for an AI system, based on the following context: ${context}. Include sections for system purpose, data sources, intended use, limitations, and known risks. Use a professional, structured format.`,
  risk: (context: string) => `You are an expert in AI compliance. Generate a Risk Policy for an AI system, based on the following context: ${context}. Outline the main risks, mitigation strategies, and monitoring plans. Be concise, actionable, and clear for a business audience.`,
};

const GenerateDocuments: React.FC = () => {
  const { user } = useAuth();
  const [context, setContext] = useState('');
  const [results, setResults] = useState({ transparency: '', datasheet: '', risk: '' });
  const [loading, setLoading] = useState({ transparency: false, datasheet: false, risk: false });
  const [fetching, setFetching] = useState(true);
  const [pdfModal, setPdfModal] = useState<{ type: string | null }>({ type: null });

  useEffect(() => {
    const fetchLatestAnswers = async () => {
      if (!user) return;
      setFetching(true);
      try {
        const userResults = await getDocuments<any>('questionnaire_results', [
          createWhereConstraint('userId', '==', user.uid)
        ]);
        if (userResults.length > 0) {
          // Sort by timestamp, newest first
          userResults.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          const latest = userResults[0];
          setContext(JSON.stringify(latest.answers));
        }
      } catch (e) {
        setContext('');
      } finally {
        setFetching(false);
      }
    };
    fetchLatestAnswers();
  }, [user]);

  const handleGenerate = async (type: 'transparency' | 'datasheet' | 'risk') => {
    setLoading(l => ({ ...l, [type]: true }));
    try {
      const prompt = prompts[type](context);
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: { maxOutputTokens: 5000 },
      });
      setResults(r => ({ ...r, [type]: response.text || 'No response.' }));
    } catch (e) {
      setResults(r => ({ ...r, [type]: 'Error generating document.' }));
    } finally {
      setLoading(l => ({ ...l, [type]: false }));
    }
  };

  const handleDownloadPdf = (type: 'transparency' | 'datasheet' | 'risk') => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(type.replace(/^[a-z]/, c => c.toUpperCase()) + ' Document', 10, 20);
    doc.setFontSize(11);
    const text = results[type] || 'No content available.';
    doc.text(doc.splitTextToSize(text, 180), 10, 30);
    doc.save(`${type}-document.pdf`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-brand-primary mb-8 text-center">Generate Key Compliance Documents</h1>
          {fetching ? (
            <div className="text-center text-lg text-brand-primary py-12">Loading your latest questionnaire answers...</div>
          ) : !context ? (
            <div className="text-center text-lg text-red-600 py-12">No questionnaire answers found. Please complete the assessment first.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Transparency Notice */}
              <div className="bg-white rounded-lg shadow p-6 flex flex-col">
                <h2 className="text-xl font-bold text-brand-accent mb-4">Transparency Notice</h2>
                <div className="flex gap-2 mb-2">
                  <button
                    className="px-3 py-1 bg-brand-accent text-white rounded hover:bg-brand-primary text-sm"
                    onClick={() => handleDownloadPdf('transparency')}
                    disabled={!results.transparency}
                  >
                    Download as PDF
                  </button>
                  <button
                    className="px-3 py-1 bg-brand-primary text-white rounded hover:bg-brand-accent text-sm"
                    onClick={() => setPdfModal({ type: 'transparency' })}
                    disabled={!results.transparency}
                  >
                    View as PDF
                  </button>
                </div>
                <button
                  className="mb-4 px-4 py-2 bg-brand-accent text-white rounded hover:bg-brand-primary transition-all disabled:opacity-50"
                  onClick={() => handleGenerate('transparency')}
                  disabled={loading.transparency}
                >
                  {loading.transparency ? 'Generating...' : 'Generate'}
                </button>
                <div className="flex-1 overflow-y-auto whitespace-pre-wrap text-gray-700 text-sm border-t pt-2 mt-2">
                  {results.transparency}
                </div>
              </div>
              {/* Data Sheet */}
              <div className="bg-white rounded-lg shadow p-6 flex flex-col">
                <h2 className="text-xl font-bold text-brand-accent mb-4">Data Sheet</h2>
                <div className="flex gap-2 mb-2">
                  <button
                    className="px-3 py-1 bg-brand-accent text-white rounded hover:bg-brand-primary text-sm"
                    onClick={() => handleDownloadPdf('datasheet')}
                    disabled={!results.datasheet}
                  >
                    Download as PDF
                  </button>
                  <button
                    className="px-3 py-1 bg-brand-primary text-white rounded hover:bg-brand-accent text-sm"
                    onClick={() => setPdfModal({ type: 'datasheet' })}
                    disabled={!results.datasheet}
                  >
                    View as PDF
                  </button>
                </div>
                <button
                  className="mb-4 px-4 py-2 bg-brand-accent text-white rounded hover:bg-brand-primary transition-all disabled:opacity-50"
                  onClick={() => handleGenerate('datasheet')}
                  disabled={loading.datasheet}
                >
                  {loading.datasheet ? 'Generating...' : 'Generate'}
                </button>
                <div className="flex-1 overflow-y-auto whitespace-pre-wrap text-gray-700 text-sm border-t pt-2 mt-2">
                  {results.datasheet}
                </div>
              </div>
              {/* Risk Policy */}
              <div className="bg-white rounded-lg shadow p-6 flex flex-col">
                <h2 className="text-xl font-bold text-brand-accent mb-4">Risk Policy</h2>
                <div className="flex gap-2 mb-2">
                  <button
                    className="px-3 py-1 bg-brand-accent text-white rounded hover:bg-brand-primary text-sm"
                    onClick={() => handleDownloadPdf('risk')}
                    disabled={!results.risk}
                  >
                    Download as PDF
                  </button>
                  <button
                    className="px-3 py-1 bg-brand-primary text-white rounded hover:bg-brand-accent text-sm"
                    onClick={() => setPdfModal({ type: 'risk' })}
                    disabled={!results.risk}
                  >
                    View as PDF
                  </button>
                </div>
                <button
                  className="mb-4 px-4 py-2 bg-brand-accent text-white rounded hover:bg-brand-primary transition-all disabled:opacity-50"
                  onClick={() => handleGenerate('risk')}
                  disabled={loading.risk}
                >
                  {loading.risk ? 'Generating...' : 'Generate'}
                </button>
                <div className="flex-1 overflow-y-auto whitespace-pre-wrap text-gray-700 text-sm border-t pt-2 mt-2">
                  {results.risk}
                </div>
              </div>
            </div>
          )}
          {/* PDF Modal */}
          {pdfModal.type && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative">
                <button
                  onClick={() => setPdfModal({ type: null })}
                  className="absolute top-2 right-2 text-gray-500 hover:text-brand-primary"
                >
                  ✕
                </button>
                <iframe
                  title="Document PDF Preview"
                  srcDoc={`<html><body style='margin:0;padding:2em;font-family:sans-serif;'><h2>${pdfModal.type && pdfModal.type.replace(/^[a-z]/, c => c.toUpperCase())} Document</h2><pre style='white-space:pre-wrap;'>${results[pdfModal.type as 'transparency' | 'datasheet' | 'risk'] || 'No content available.'}</pre></body></html>`}
                  style={{ width: '100%', height: '500px', border: 'none' }}
                />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GenerateDocuments; 