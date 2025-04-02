import { render, fireEvent, waitFor } from '@testing-library/react';
import { signIn, signUp } from '../firebase/auth';
import { AuthContext } from '../contexts/AuthContext';

jest.mock('../firebase/auth');

describe('Authentication Tests', () => {
  test('should sign in user with correct credentials', async () => {
    const mockSignIn = jest.fn().mockResolvedValue({
      user: { uid: '123', email: 'test@test.com' }
    });
    signIn.mockImplementation(mockSignIn);

    const credentials = {
      email: 'test@test.com',
      password: 'password123'
    };

    const result = await signIn(credentials.email, credentials.password);
    expect(result.user).toBeTruthy();
    expect(result.user.email).toBe(credentials.email);
  });

  test('should fail sign in with incorrect credentials', async () => {
    const mockSignIn = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
    signIn.mockImplementation(mockSignIn);

    const credentials = {
      email: 'wrong@test.com',
      password: 'wrongpassword'
    };

    await expect(signIn(credentials.email, credentials.password))
      .rejects
      .toThrow('Invalid credentials');
  });

  test('should create new user account successfully', async () => {
    const mockSignUp = jest.fn().mockResolvedValue({
      user: { uid: '456', email: 'newuser@test.com' }
    });
    signUp.mockImplementation(mockSignUp);

    const newUser = {
      email: 'newuser@test.com',
      password: 'newpassword123'
    };

    const result = await signUp(newUser.email, newUser.password);
    expect(result.user).toBeTruthy();
    expect(result.user.email).toBe(newUser.email);
  });
});