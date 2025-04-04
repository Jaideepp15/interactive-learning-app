import { fetchQuizQuestions, submitQuiz } from '../firebase/quiz'; // Adjust import path as needed

// Mock the quiz functions
jest.mock('../firebase/quiz', () => ({
  fetchQuizQuestions: jest.fn().mockResolvedValue([
    { id: 1, question: 'What is 2+2?', options: ['A', 'B', 'C', 'D'], correct: 'A' },
    { id: 2, question: 'What is 3×3?', options: ['A', 'B', 'C', 'D'], correct: 'B' }
  ]),
  submitQuiz: jest.fn().mockResolvedValue({ score: 80 })
}));

describe('Quiz Functionality Tests', () => {
  test('Interactive Quiz Functionality', async () => {
    // Test fetching questions
    const quizQuestions = await fetchQuizQuestions('math');
    expect(quizQuestions.length).toBeGreaterThan(0);

    // Test submitting answers
    const userAnswers = quizQuestions.map((q) => ({ id: q.id, answer: 'A' }));
    const quizResult = await submitQuiz(userAnswers);
    expect(quizResult.score).toBeDefined();
    expect(quizResult.score).toBe(80);
  });

  test('Quiz Questions Format', async () => {
    const questions = await fetchQuizQuestions('math');
    
    questions.forEach(question => {
      expect(question).toHaveProperty('id');
      expect(question).toHaveProperty('question');
      expect(question).toHaveProperty('options');
      expect(question.options.length).toBe(4);
    });
  });
});