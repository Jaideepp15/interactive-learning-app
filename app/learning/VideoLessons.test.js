import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import VideoLessons from './VideoLessons';

global.fetch = jest.fn();
global.localStorage = {
  getItem: jest.fn(() => 'mock-token'),
};

describe('VideoLessons Component', () => {
  const mockVideos = [
    {
      id: 1,
      name: 'Mathematics',
      topics: [
        {
          id: 1,
          title: 'Math Basics',
          description: 'Learn basic math concepts',
          videoUrl: 'https://youtube.com/watch?v=123',
          thumbnailUrl: 'https://example.com/thumbnail1.jpg'
        }
      ]
    },
    {
      id: 2,
      name: 'Science',
      topics: [
        {
          id: 2,
          title: 'Science Fundamentals',
          description: 'Introduction to science',
          videoUrl: 'https://youtube.com/watch?v=456',
          thumbnailUrl: 'https://example.com/thumbnail2.jpg'
        }
      ]
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockImplementation((url) => {
      if (url === './api/videos') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockVideos)
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
      render(<VideoLessons />);
    });

    await waitFor(() => {
      expect(screen.getByText('Video Lessons')).toBeInTheDocument();
      expect(screen.getByText('Mathematics')).toBeInTheDocument();
      expect(screen.getByText('Science')).toBeInTheDocument();
    });
  });

  test('loads and displays video lessons', async () => {
    await act(async () => {
      render(<VideoLessons />);
    });
    
    await waitFor(() => {
      const mathSection = screen.getByText('Mathematics').closest('div');
      const scienceSection = screen.getByText('Science').closest('div');
      expect(mathSection).toBeInTheDocument();
      expect(scienceSection).toBeInTheDocument();
    });
  });

  test('displays video details', async () => {
    await act(async () => {
      render(<VideoLessons />);
    });
    
    await waitFor(() => {
      const mathSection = screen.getByText('Mathematics');
      const scienceSection = screen.getByText('Science');
      expect(mathSection).toBeInTheDocument();
      expect(scienceSection).toBeInTheDocument();
    });
  });

  test('handles API error gracefully', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve([])
      })
    );

    await act(async () => {
      render(<VideoLessons />);
    });
    
    await waitFor(() => {
      expect(screen.queryByText('Math Basics')).not.toBeInTheDocument();
    });
  });
});
