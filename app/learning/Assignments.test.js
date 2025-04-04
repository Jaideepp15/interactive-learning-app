import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Assignments from './Assignments';

global.fetch = jest.fn();

describe('Assignments Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    const { container } = render(<Assignments />);
    // Check if the component renders by verifying the container exists
    expect(container).toBeInTheDocument();
  });

  test('fetches and displays assignments', async () => {
    const mockAssignments = [
      {
        id: 1,
        title: 'Assignment 1',
        description: 'Description for Assignment 1',
        openDate: '2023-01-01',
        dueDate: '2023-01-10',
        subject: 'Math',
      },
    ];

    const mockUserData = { userId: 1 };
    const mockCompletedAssignments = [];

    fetch.mockImplementation((url) => {
      switch (url) {
        case '/api/assignment':
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockAssignments),
          });
        case '/api/fetch-details':
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockUserData),
          });
        case '/api/completed-assignment?userId=1':
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockCompletedAssignments),
          });
        default:
          return Promise.resolve({
            ok: false,
            status: 404,
            json: () => Promise.reject(new Error('Unknown API call')),
          });
      }
    });

    render(<Assignments />);

    // Wait for the assignment title specifically
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Assignment 1/i })).toBeInTheDocument();
    });
  });

  test('handles errors when fetching assignments', async () => {
    fetch.mockImplementation(() => 
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('API error'))
      })
    );

    render(<Assignments />);

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /Assignment 1/i })).not.toBeInTheDocument();
    });
  });
});