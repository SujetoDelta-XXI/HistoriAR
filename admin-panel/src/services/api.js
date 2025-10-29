const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      // Manejar tokens expirados o inválidos
      if (response.status === 401 || response.status === 403) {
        // Limpiar datos de autenticación
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Recargar la página para forzar el logout
        window.location.reload();
        
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
      
      const error = await response.json().catch(() => ({ message: 'Error de red' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Monuments
  async getMonuments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/monuments${queryString ? `?${queryString}` : ''}`);
  }

  async getMonument(id) {
    return this.request(`/monuments/${id}`);
  }

  async createMonument(data) {
    return this.request('/monuments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMonument(id, data) {
    return this.request(`/monuments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMonument(id) {
    return this.request(`/monuments/${id}`, {
      method: 'DELETE',
    });
  }

  // Institutions
  async getInstitutions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/institutions${queryString ? `?${queryString}` : ''}`);
  }

  async getInstitution(id) {
    return this.request(`/institutions/${id}`);
  }

  async createInstitution(data) {
    return this.request('/institutions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateInstitution(id, data) {
    return this.request(`/institutions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteInstitution(id) {
    return this.request(`/institutions/${id}`, {
      method: 'DELETE',
    });
  }

  // Users
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users${queryString ? `?${queryString}` : ''}`);
  }

  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  async updateUser(id, data) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Visits
  async getVisits(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/visits${queryString ? `?${queryString}` : ''}`);
  }

  // Categories
  async getCategories(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/categories${queryString ? `?${queryString}` : ''}`);
  }

  async getCategory(id) {
    return this.request(`/categories/${id}`);
  }

  async createCategory(data) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id, data) {
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id) {
    return this.request(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Quizzes
  async getQuizzes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/quizzes${queryString ? `?${queryString}` : ''}`);
  }

  async getQuiz(id) {
    return this.request(`/quizzes/${id}`);
  }

  async createQuiz(data) {
    return this.request('/quizzes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateQuiz(id, data) {
    return this.request(`/quizzes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteQuiz(id) {
    return this.request(`/quizzes/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();