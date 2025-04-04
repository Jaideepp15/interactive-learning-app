import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TeacherFeedback from './feedback';

global.fetch = jest.fn();
global.localStorage = {
  getItem: jest.fn(() => 'mock-token'),
};

describe('TeacherFeedback Component', () => {
  const mockStudents = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      parent: null,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    global.window.alert = jest.fn();
  });

  test('renders without crashing', () => {
    const { container } = render(<TeacherFeedback />);
    expect(container).toBeInTheDocument();
    expect(screen.getByText('Send Student Feedback')).toBeInTheDocument();
  });

  test('fetches and displays students', async () => {
    fetch.mockImplementation((url) => {
      switch (url) {
        case '/api/student-details':
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockStudents),
          });
        case '/api/fetch-teacher-details':
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: 1 }),
          });
        default:
          return Promise.resolve({
            ok: false,
            status: 404,
            json: () => Promise.reject(new Error('Unknown API call')),
          });
      }
    });

    render(<TeacherFeedback />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  test('handles form submission', async () => {
    fetch.mockImplementation((url) => {
      switch (url) {
        case '/api/student-details':
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockStudents),
          });
        case '/api/fetch-teacher-details':
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: 1 }),
          });
        case '/api/submit-feedback':
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ message: 'Success' }),
          });
        default:
          return Promise.resolve({
            ok: false,
            json: () => Promise.reject(new Error('Unknown API call')),
          });
      }
    });

    render(<TeacherFeedback />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/feedback title/i), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText(/your feedback/i), { target: { value: 'Test Content' } });
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByText(/send feedback/i));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/submit-feedback', expect.any(Object));
    });
  });

  test('handles API errors', async () => {
    fetch.mockImplementation(() => 
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('API error'))
      })
    );

    render(<TeacherFeedback />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/student-details');
    });
  });
});