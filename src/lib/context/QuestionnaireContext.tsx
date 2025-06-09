import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type {
  QuestionnaireContextType,
  QuestionnaireState,
  QuestionnaireStep,
  RiskLevel,
} from '../types/questionnaire';

const initialState: QuestionnaireState = {
  currentStep: 0,
  answers: {},
  riskLevel: 'low',
  completed: false,
};

type Action =
  | { type: 'UPDATE_ANSWER'; payload: { questionId: string; answer: string | string[] | boolean } }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'CALCULATE_RISK' }
  | { type: 'COMPLETE' };

const questionnaireReducer = (state: QuestionnaireState, action: Action): QuestionnaireState => {
  switch (action.type) {
    case 'UPDATE_ANSWER':
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: action.payload.answer,
        },
      };
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: state.currentStep + 1,
      };
    case 'PREVIOUS_STEP':
      return {
        ...state,
        currentStep: Math.max(0, state.currentStep - 1),
      };
    case 'CALCULATE_RISK':
      return {
        ...state,
        riskLevel: calculateRiskLevel(state.answers),
      };
    case 'COMPLETE':
      return {
        ...state,
        completed: true,
      };
    default:
      return state;
  }
};

const calculateRiskLevel = (answers: Record<string, string | string[] | boolean>): RiskLevel => {
  // Implement risk calculation logic based on answers
  // This is a simplified example - you should implement your actual risk calculation logic
  const highRiskAnswers = Object.values(answers).filter(
    (answer) => typeof answer === 'string' && answer.includes('high-risk')
  ).length;

  const mediumRiskAnswers = Object.values(answers).filter(
    (answer) => typeof answer === 'string' && answer.includes('medium-risk')
  ).length;

  if (highRiskAnswers > 0) return 'high';
  if (mediumRiskAnswers > 0) return 'medium';
  return 'low';
};

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

export const QuestionnaireProvider: React.FC<{
  children: React.ReactNode;
  steps: QuestionnaireStep[];
}> = ({ children, steps }) => {
  const [state, dispatch] = useReducer(questionnaireReducer, initialState);

  const updateAnswer = (questionId: string, answer: string | string[] | boolean) => {
    dispatch({ type: 'UPDATE_ANSWER', payload: { questionId, answer } });
  };

  const nextStep = () => {
    dispatch({ type: 'NEXT_STEP' });
  };

  const previousStep = () => {
    dispatch({ type: 'PREVIOUS_STEP' });
  };

  const calculateRiskLevel = () => {
    dispatch({ type: 'CALCULATE_RISK' });
    return state.riskLevel;
  };

  const isStepComplete = (stepIndex: number) => {
    const step = steps[stepIndex];
    if (!step) return false;

    return step.questions.every((question) => {
      if (!question.required) return true;
      if (question.dependsOn) {
        const dependentAnswer = state.answers[question.dependsOn.questionId];
        if (dependentAnswer !== question.dependsOn.value) return true;
      }
      return state.answers[question.id] !== undefined;
    });
  };

  useEffect(() => {
    if (state.currentStep === steps.length) {
      dispatch({ type: 'COMPLETE' });
    }
  }, [state.currentStep, steps.length]);

  return (
    <QuestionnaireContext.Provider
      value={{
        state,
        steps,
        updateAnswer,
        nextStep,
        previousStep,
        calculateRiskLevel,
        isStepComplete,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
};

export const useQuestionnaire = () => {
  const context = useContext(QuestionnaireContext);
  if (context === undefined) {
    throw new Error('useQuestionnaire must be used within a QuestionnaireProvider');
  }
  return context;
}; 