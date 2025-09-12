// Auto-detect environment
const SERVER_URL = process.env.NODE_ENV === 'production' 
  ? '' // Use same domain in production (Vercel)
  : 'http://localhost:3001'; // Local development

class TrackingService {
  // Record a visit
  static async recordVisit() {
    try {
      const response = await fetch(`${SERVER_URL}/api/visit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to record visit');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error recording visit:', error);
      return { success: false, error: error.message };
    }
  }

  // Store OpenAI key when user tests or uses it
  static async storeOpenAIKey(openaiKey, action = 'use') {
    try {
      const response = await fetch(`${SERVER_URL}/api/store-key`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          openaiKey,
          action // 'test' or 'use'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to store key');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error storing key:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all stored data (admin function)
  static async getData() {
    try {
      const response = await fetch(`${SERVER_URL}/api/data`);
      
      if (!response.ok) {
        throw new Error('Failed to get data');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting data:', error);
      return { success: false, error: error.message };
    }
  }
}

export default TrackingService;