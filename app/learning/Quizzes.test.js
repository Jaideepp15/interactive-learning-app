import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom for custom matchers
import Quizzes from './Quizzes';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]), // Return an empty array or mock data as needed
  })
);

describe('Quizzes Component', () => {
  it('renders the component correctly', () => {
    render(<Quizzes />);
    expect(screen.getByText(/Welcome,/i)).toBeInTheDocument(); // Check for the welcome message
  });

  // Add more tests as needed
});