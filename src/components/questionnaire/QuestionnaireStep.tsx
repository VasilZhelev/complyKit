import React from 'react';
import type { QuestionnaireStep as StepType } from '../../lib/types/questionnaire';
import Question from './Question';

interface QuestionnaireStepProps {
  step: StepType;
  isActive: boolean;
}

const QuestionnaireStep: React.FC<QuestionnaireStepProps> = ({ step, isActive }) => {
  if (!isActive) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h2>
        <p className="text-gray-600">{step.description}</p>
      </div>

      <div className="space-y-8">
        {step.questions.map((question) => (
          <Question key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
};

export default QuestionnaireStep; 