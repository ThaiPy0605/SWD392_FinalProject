const API_BASE_URL = 'http://localhost:8080/api/v1';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP ${response.status} ${response.statusText}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch (e) {
        if (errorText) errorMessage = errorText;
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`API Call Error [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // Auth API
  login: async (email, password) => {
    return await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Product APIs
  getProducts: async () => {
    return await request('/products', { method: 'GET' });
  },

  getProductById: async (id) => {
    return await request(`/products/${id}`, { method: 'GET' });
  },

  createProduct: async (productData) => {
    return await request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  updateProduct: async (id, productData) => {
    return await request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  deleteProduct: async (id) => {
    return await request(`/products/${id}`, { method: 'DELETE' });
  },

  // Dropdown Metadata APIs
  getCategories: async () => {
    return await request('/categories', { method: 'GET' });
  },

  getBrands: async () => {
    return await request('/brands', { method: 'GET' });
  },
};

export default api;
