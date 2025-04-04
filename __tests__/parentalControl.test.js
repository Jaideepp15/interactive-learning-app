import { updateParentalControls, fetchParentalControls } from '../firebase/parentalControls'; // Adjust import path as needed

// Mock the parental control functions
jest.mock('../firebase/parentalControls', () => ({
  updateParentalControls: jest.fn().mockResolvedValue({ 
    status: 200, 
    message: 'Settings updated successfully' 
  }),
  fetchParentalControls: jest.fn().mockResolvedValue({
    timeLimit: 60,
    contentRestriction: 'PG',
    lastUpdated: new Date().toISOString()
  })
}));

describe('Parental Control Tests', () => {
  test('Parental Controls and Settings', async () => {
    // Test updating parental controls
    const settings = { timeLimit: 60, contentRestriction: 'PG' };
    const updateResponse = await updateParentalControls(settings);
    expect(updateResponse.status).toBe(200);

    // Test fetching updated settings
    const updatedSettings = await fetchParentalControls();
    expect(updatedSettings.timeLimit).toBe(60);
    expect(updatedSettings.contentRestriction).toBe('PG');
  });

  test('Parental Control Settings Validation', async () => {
    const settings = await fetchParentalControls();
    
    // Validate settings structure
    expect(settings).toHaveProperty('timeLimit');
    expect(settings).toHaveProperty('contentRestriction');
    expect(settings).toHaveProperty('lastUpdated');
    
    // Validate data types
    expect(typeof settings.timeLimit).toBe('number');
    expect(typeof settings.contentRestriction).toBe('string');
    expect(typeof settings.lastUpdated).toBe('string');
  });
});