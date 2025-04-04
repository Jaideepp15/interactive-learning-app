import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import LearningGoals from './learning-goals';

global.fetch = jest.fn();
global.localStorage = {
  getItem: jest.fn(() => 'mock-token'),
};

describe('LearningGoals Component', () => {
  const mockChildren = [{
    id: 1,
    name: 'Test Child',
    completedSubtopics: [{ subtopic: 'Algebra' }]
  }];

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockImplementation((url) => {
      switch (url) {
        case '/api/fetch-child-details':
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ children: mockChildren })
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
      render(<LearningGoals />);
    });
    expect(screen.getByText('Set Learning Goals for Your Child')).toBeInTheDocument();
  });

  test('loads and displays children', async () => {
    await act(async () => {
      render(<LearningGoals />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });
  });

  test('handles subject selection', async () => {
    await act(async () => {
      render(<LearningGoals />);
    });

    // Wait for child data to load and select a child
    await waitFor(() => {
      const childSelect = screen.getByRole('combobox');
      fireEvent.change(childSelect, { target: { value: '1' } });
    });

    // Wait for the Math button to appear and click it
    await waitFor(() => {
      const mathButton = screen.getByText(/pending subtopics for math/i);
      fireEvent.click(mathButton);
    });

    // Wait for subtopics to appear
    await waitFor(() => {
      expect(screen.getByText('Subtopic1')).toBeInTheDocument();
    });
  });

  test('handles goal submission', async () => {
    // Mock the save-learning-goals endpoint
    fetch.mockImplementation((url) => {
      if (url === '/api/save-learning-goals') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Goals saved successfully' })
        });
      }
      if (url === '/api/fetch-child-details') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ children: mockChildren })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      });
    });

    // Setup window.alert mock
    window.alert = jest.fn();

    await act(async () => {
      render(<LearningGoals />);
    });

    // Wait for child data to load and select a child
    await waitFor(() => {
      const childSelect = screen.getByRole('combobox');
      fireEvent.change(childSelect, { target: { value: '1' } });
    });

    // Find and click the save button
    const saveButton = screen.getByText(/save learning goals/i);
    await act(async () => {
      fireEvent.click(saveButton);
    });

    // Verify alert was shown
    expect(window.alert).toHaveBeenCalledWith('Please select at least one subject to set goals.');
  });
});