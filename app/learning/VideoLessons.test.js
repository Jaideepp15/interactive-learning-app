import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom for custom matchers
import VideoLessons from './VideoLessons';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]), // Return an empty array or mock data as needed
  })
);

describe('VideoLessons Component', () => {
  it('renders the component correctly', () => {
    render(<VideoLessons />);
    expect(screen.getByText(/Video Lessons/i)).toBeInTheDocument();
  });

  // Add more tests as needed
});