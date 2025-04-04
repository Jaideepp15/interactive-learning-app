import { registerUser, loginUser } from '../firebase/auth'; // Adjust the import path based on your project structure

describe('Authentication Tests', () => {
  test('User Registration and Login', async () => {
    const user = { 
      name: 'Test User', 
      email: 'test@example.com', 
      password: 'password123' 
    };
    
    // Mock registration API call
    const registrationResponse = await registerUser(user);
    expect(registrationResponse.status).toBe(201);

    // Mock login API call
    const loginResponse = await loginUser(user.email, user.password);
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.data.token).toBeDefined();
  });
});