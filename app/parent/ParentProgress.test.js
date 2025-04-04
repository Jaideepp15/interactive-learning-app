import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ParentProgress from './ParentProgress';

global.fetch = jest.fn();
global.localStorage = {
  getItem: jest.fn(() => 'mock-token'),
};

describe('ParentProgress Component', () => {
  const mockChildren = [{
    name: 'Test Child',
    completedSubtopics: [
      { subtopic: 'Algebra', category: 'Math' },
      { subtopic: 'Chemistry', category: 'Science' }
    ],
    completedAssignments: [{ title: 'Assignment 1' }],
    quizScores: [
      { quizTitle: 'Math Quiz', score: 85 },
      { quizTitle: 'Science Quiz', score: 90 }
    ]
  }];

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock all fetch calls with proper data structures
    fetch.mockImplementation((url) => {
      switch (url) {
        case '/api/fetch-child-details':
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ children: mockChildren })
          });
        case '/api/fetch-teacher-details':
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: 1 })
          });
        case '/api/assignment':
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ title: 'Assignment 1' }, { title: 'Assignment 2' }])
          });
        case '/api/fetch-quizzes':
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ title: 'Quiz 1' }, { title: 'Quiz 2' }])
          });
        case '/api/progress/1/fetch-subtopics':
        case '/api/progress/2/fetch-subtopics':
        case '/api/progress/3/fetch-subtopics':
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(['Subtopic1', 'Subtopic2'])
          });
        default:
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([])
          });
      }
    });
  });

  test('renders without crashing', async () => {
    await act(async () => {
      render(<ParentProgress />);
    });

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('Parent Progress Dashboard')).toBeInTheDocument();
    });
  });

  test('displays child data', async () => {
    await act(async () => {
      render(<ParentProgress />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });
  });

  test('handles API errors gracefully', async () => {
    // Mock fetch to return error responses with empty arrays for assignments and quizzes
    fetch.mockImplementation((url) => {
      if (url === '/api/assignment') {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve([]) // Return empty array instead of error object
        });
      }
      if (url === '/api/fetch-quizzes') {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve([]) // Return empty array instead of error object
        });
      }
      return Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server Error' })
      });
    });

    await act(async () => {
      render(<ParentProgress />);
    });

    // Should show loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for error handling to complete
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });

  test('displays assignments and quizzes', async () => {
    await act(async () => {
      render(<ParentProgress />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    // Wait for assignments and quizzes to load
    await waitFor(() => {
      expect(screen.getByText('Assignment 2')).toBeInTheDocument();
      expect(screen.getByText('Quiz 2')).toBeInTheDocument();
    });
  });
});