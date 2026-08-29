const BASE_URL = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('agroconnect_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(response) {
  if (!response.ok) {
    let errorDetail = 'Network request failed';
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.message || errorDetail;
    } catch {
      errorDetail = response.statusText;
    }
    throw new Error(errorDetail);
  }
  return response.json();
}

export const api = {
  // Auth API
  async login(email, password) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async register(userData) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async getDemoAccounts() {
    const res = await fetch(`${BASE_URL}/auth/demo-accounts`);
    return handleResponse(res);
  },

  // Produce Catalog API
  async getProduceLots(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.commodity) query.append('commodity', params.commodity);
    if (params.grade) query.append('grade', params.grade);
    if (params.min_price) query.append('min_price', params.min_price);
    if (params.max_price) query.append('max_price', params.max_price);
    if (params.max_moq) query.append('max_moq', params.max_moq);
    if (params.sort_by) query.append('sort_by', params.sort_by);

    const res = await fetch(`${BASE_URL}/produce?${query.toString()}`);
    return handleResponse(res);
  },

  async getProduceDetail(id) {
    const res = await fetch(`${BASE_URL}/produce/${id}`);
    return handleResponse(res);
  },

  async getCategories() {
    const res = await fetch(`${BASE_URL}/produce/categories`);
    return handleResponse(res);
  },

  async getMyFarmerLots() {
    const res = await fetch(`${BASE_URL}/produce/farmer/my-lots`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async createProduceLot(lotData) {
    const res = await fetch(`${BASE_URL}/produce`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(lotData),
    });
    return handleResponse(res);
  },

  async updateProduceLot(id, lotData) {
    const res = await fetch(`${BASE_URL}/produce/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(lotData),
    });
    return handleResponse(res);
  },

  async deleteProduceLot(id) {
    const res = await fetch(`${BASE_URL}/produce/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Orders API
  async placeOrder(orderData) {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    return handleResponse(res);
  },

  async getMyOrders() {
    const res = await fetch(`${BASE_URL}/orders/my-orders`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async getFarmerOrders() {
    const res = await fetch(`${BASE_URL}/orders/farmer-orders`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async getOrderDetail(orderId) {
    const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async updateOrderStatus(orderId, status) {
    const res = await fetch(`${BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },

  getInvoiceDownloadUrl(orderId) {
    return `${BASE_URL}/orders/${orderId}/invoice`;
  },

  // Mandi & Analytics API
  async getMandiRates() {
    const res = await fetch(`${BASE_URL}/mandi/rates`);
    return handleResponse(res);
  },

  async getPriceComparison() {
    const res = await fetch(`${BASE_URL}/mandi/comparison`);
    return handleResponse(res);
  },

  async getPlatformOverview() {
    const res = await fetch(`${BASE_URL}/analytics/overview`);
    return handleResponse(res);
  },

  async getFarmerSummary() {
    const res = await fetch(`${BASE_URL}/analytics/farmer-summary`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Kisan AI Assistant API
  async sendAIChat(message, language = 'en') {
    const res = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language }),
    });
    return handleResponse(res);
  },

  // Admin Ashish Central Control API
  async getAdminMetrics() {
    const res = await fetch(`${BASE_URL}/admin/metrics`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async updateAdminMandiRate(rateId, modal_price_per_kg, trend) {
    const res = await fetch(`${BASE_URL}/admin/mandi-rates/${rateId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ modal_price_per_kg, trend }),
    });
    return handleResponse(res);
  },

  getAdminExportCsvUrl() {
    return `${BASE_URL}/admin/export-csv`;
  },
};
