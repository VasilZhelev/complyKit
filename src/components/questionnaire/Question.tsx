import React from 'react';
import type { Question as QuestionType } from '../../lib/types/questionnaire';
import { useQuestionnaire } from '../../lib/context/QuestionnaireContext';

interface QuestionProps {
  question: QuestionType;
}

const Question: React.FC<QuestionProps> = ({ question }) => {
  const { state, updateAnswer } = useQuestionnaire();
  const currentAnswer = state.answers[question.id];

  const handleSingleSelect = (optionId: string) => {
    updateAnswer(question.id, optionId);
  };

  const handleMultipleSelect = (optionId: string) => {
    const currentAnswers = (currentAnswer as string[]) || [];
    const newAnswers = currentAnswers.includes(optionId)
      ? currentAnswers.filter((id) => id !== optionId)
      : [...currentAnswers, optionId];
    updateAnswer(question.id, newAnswers);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateAnswer(question.id, e.target.value);
  };

  const handleBooleanChange = (value: boolean) => {
    updateAnswer(question.id, value);
  };

  if (question.dependsOn) {
    const dependentAnswer = state.answers[question.dependsOn.questionId];
    if (dependentAnswer !== question.dependsOn.value) {
      return null;
    }
  }

  return (
    <div className="mb-8">
      <label className="block text-lg font-medium text-gray-900 mb-2">
        {question.text}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {question.type === 'single' && question.options && (
        <div className="space-y-2">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSingleSelect(option.id)}
              className={`w-full text-left px-4 py-3 rounded-lg border ${
                currentAnswer === option.id
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-gray-300 hover:border-indigo-600'
              }`}
            >
              {option.text}
            </button>
          ))}
        </div>
      )}

      {question.type === 'multiple' && question.options && (
        <div className="space-y-2">
          {question.options.map((option) => (
            <label
              key={option.id}
              className="flex items-center space-x-3 p-4 rounded-lg border border-gray-300 hover:border-indigo-600 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={(currentAnswer as string[])?.includes(option.id) || false}
                onChange={() => handleMultipleSelect(option.id)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <span className="text-gray-900">{option.text}</span>
            </label>
          ))}
        </div>
      )}

      {question.type === 'text' && (
        <textarea
          value={(currentAnswer as string) || ''}
          onChange={handleTextChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
          rows={4}
          placeholder="Enter your answer here..."
        />
      )}

      {question.type === 'boolean' && (
        <div className="flex space-x-4">
          <button
            onClick={() => handleBooleanChange(true)}
            className={`px-6 py-3 rounded-lg border ${
              currentAnswer === true
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-300 hover:border-indigo-600'
            }`}
          >
            Yes
          </button>
          <button
            onClick={() => handleBooleanChange(false)}
            className={`px-6 py-3 rounded-lg border ${
              currentAnswer === false
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-300 hover:border-indigo-600'
            }`}
          >
            No
          </button>
        </div>
      )}
    </div>
  );
};

export default Question; 