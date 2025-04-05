import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Quizzes from './Quizzes';

global.fetch = jest.fn();
global.localStorage = {
  getItem: jest.fn(() => 'mock-token'),
};

describe('Quizzes Component', () => {
  const mockQuizzes = [
    {
      id: 1,
      title: 'Math Quiz',
      subject: 'Mathematics',
      difficulty: 'Medium',
      category: 'Math',
      questions: []
    },
    {
      id: 2,
      title: 'Science Quiz',
      subject: 'Physics',
      difficulty: 'Hard',
      category: 'Science',
      questions: []
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockImplementation((url) => {
      if (url === './api/quizzes') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockQuizzes)
        });
      }
      if (url === '/api/user-details') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ name: 'Test User' })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      });
    });
  });

  test('renders the component correctly', async () => {
    await act(async () => {
      render(<Quizzes />);
    });

    await waitFor(() => {
      expect(screen.getByText('Welcome,')).toBeInTheDocument();
      expect(screen.getByText('Quizzes')).toBeInTheDocument();
    });
  });

  test('loads and displays quizzes', async () => {
    await act(async () => {
      render(<Quizzes />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Math Quiz')).toBeInTheDocument();
      expect(screen.getByText('Science Quiz')).toBeInTheDocument();
    });
  });

  test('displays quiz details', async () => {
    await act(async () => {
      render(<Quizzes />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Subject: Mathematics')).toBeInTheDocument();
      expect(screen.getByText('Subject: Physics')).toBeInTheDocument();
      expect(screen.getByText('Difficulty: Medium')).toBeInTheDocument();
      expect(screen.getByText('Difficulty: Hard')).toBeInTheDocument();
    });
  });

  test('handles API error gracefully', async () => {
    fetch.mockImplementationOnce((url) => {
      if (url === './api/quizzes') {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve([])
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ name: 'Test User' })
      });
    });

    await act(async () => {
      render(<Quizzes />);
    });
    
    await waitFor(() => {
      expect(screen.queryByText('Math Quiz')).not.toBeInTheDocument();
    });
  });
});
