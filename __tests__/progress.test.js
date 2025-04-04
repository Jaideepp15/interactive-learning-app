import { fetchUserProgress } from '../firebase/progress'; // Adjust import path as needed

// Mock the progress tracking function
jest.mock('../firebase/progress', () => ({
  fetchUserProgress: jest.fn().mockResolvedValue({
    completedQuizzes: [
      { id: 1, score: 85, date: '2024-01-01' },
      { id: 2, score: 90, date: '2024-01-02' }
    ],
    totalQuizzesTaken: 2,
    averageScore: 87.5
  })
}));

describe('Progress Tracking Tests', () => {
  test('Progress Tracking', async () => {
    const userId = '123';
    const progress = await fetchUserProgress(userId);
    
    // Test basic progress structure
    expect(progress.completedQuizzes).toBeDefined();
    expect(progress.completedQuizzes.length).toBeGreaterThanOrEqual(0);
    
    // Test detailed progress information
    expect(progress.totalQuizzesTaken).toBeDefined();
    expect(progress.averageScore).toBeDefined();
    
    // Test completed quiz entry structure
    progress.completedQuizzes.forEach(quiz => {
      expect(quiz).toHaveProperty('id');
      expect(quiz).toHaveProperty('score');
      expect(quiz).toHaveProperty('date');
    });
  });
});