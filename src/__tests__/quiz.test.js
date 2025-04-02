import { render, fireEvent, screen } from '@testing-library/react';
import Quiz from '../components/Quiz';
import { QuizContext } from '../contexts/QuizContext';

describe('Quiz Component Tests', () => {
  const mockQuizData = {
    questions: [
      {
        id: 1,
        question: 'What is 2 + 2?',
        options: ['3', '4', '5', '6'],
        correctAnswer: '4'
      }
    ]
  };

  test('should render quiz question correctly', () => {
    render(
      <QuizContext.Provider value={{ quizData: mockQuizData }}>
        <Quiz />
      </QuizContext.Provider>
    );

    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  test('should handle correct answer selection', () => {
    const mockHandleAnswer = jest.fn();
    render(
      <QuizContext.Provider value={{ 
        quizData: mockQuizData,
        handleAnswer: mockHandleAnswer 
      }}>
        <Quiz />
      </QuizContext.Provider>
    );

    fireEvent.click(screen.getByText('4'));
    expect(mockHandleAnswer).toHaveBeenCalledWith(1, '4');
  });

  test('should show score after quiz completion', async () => {
    const mockScore = 80;
    render(
      <QuizContext.Provider value={{ 
        quizData: mockQuizData,
        isComplete: true,
        score: mockScore 
      }}>
        <Quiz />
      </QuizContext.Provider>
    );

    expect(screen.getByText(`Score: ${mockScore}%`)).toBeInTheDocument();
  });
});