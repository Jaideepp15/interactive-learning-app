import { render, fireEvent, waitFor } from '@testing-library/react';
import UserProfile from '../components/UserProfile';
import { updateProfile } from '../firebase/profile';

jest.mock('../firebase/profile');

describe('User Profile Tests', () => {
  const mockUser = {
    uid: '789',
    displayName: 'Test User',
    email: 'test@test.com',
    photoURL: 'https://example.com/photo.jpg'
  };

  test('should render user profile information', () => {
    render(<UserProfile user={mockUser} />);
    
    expect(screen.getByText(mockUser.displayName)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });

  test('should update profile successfully', async () => {
    const mockUpdate = jest.fn().mockResolvedValue({ success: true });
    updateProfile.mockImplementation(mockUpdate);

    render(<UserProfile user={mockUser} />);

    const newName = 'Updated Name';
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: newName } });

    const submitButton = screen.getByText('Update Profile');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith({
        ...mockUser,
        displayName: newName
      });
    });
  });

  test('should handle profile update errors', async () => {
    const mockUpdate = jest.fn().mockRejectedValue(new Error('Update failed'));
    updateProfile.mockImplementation(mockUpdate);

    render(<UserProfile user={mockUser} />);

    const submitButton = screen.getByText('Update Profile');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Error updating profile')).toBeInTheDocument();
    });
  });
});