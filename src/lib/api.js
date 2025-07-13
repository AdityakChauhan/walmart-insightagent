const API_BASE = 'http://localhost:8000';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Inventory API
export const fetchInventory = () => apiCall('/inventory');
export const fetchItemById = (itemId) => apiCall(`/inventory/itemid/${itemId}`);
export const fetchItemByName = (itemName) => apiCall(`/inventory/item/${itemName}`);
export const fetchFullItemView = (itemId) => apiCall(`/inventory/${itemId}/full`);

// AI Decisions API
export const fetchDecisions = () => apiCall('/decisions');
export const fetchDecisionsSummary = () => apiCall('/decisions/summary');
export const fetchItemDecision = (itemId) => apiCall(`/inventory/${itemId}/decision`);
export const applyAIAction = (itemId) => apiCall(`/inventory/${itemId}/action`, { method: 'POST' });

// Sustainability API
export const fetchSustainabilityImpact = () => apiCall('/sustainability/impact');
export const fetchItemImpact = (itemId) => apiCall(`/inventory/${itemId}/impact`);

// Simulation API
export const runSimulation = () => apiCall('/simulate', { method: 'POST' });
export const resetSimulation = () => apiCall('/simulate/reset', { method: 'POST' });

// Logs API
export const fetchItemLog = (itemId) => apiCall(`/inventory/${itemId}/log`);

// Chat API
export const chatWithAI = (itemId, message) => apiCall('/chat', {
  method: 'POST',
  body: JSON.stringify({ item_id: itemId, message }),
});

// Health check
export const checkHealth = () => apiCall('/health'); 