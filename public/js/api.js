// API Module
const API = {
  baseUrl: '/api',

  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = Auth.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  // Image Upload
  async uploadImage(base64Image) {
    const res = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ image: base64Image })
    });
    return res.json();
  },

  // Participants
  async getParticipants() {
    const res = await fetch(`${this.baseUrl}/participants`);
    return res.json();
  },

  async addParticipant(data) {
    const res = await fetch(`${this.baseUrl}/participants`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteParticipant(id) {
    const res = await fetch(`${this.baseUrl}/participants/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return res.json();
  },

  // Games
  async getGames() {
    const res = await fetch(`${this.baseUrl}/games`);
    return res.json();
  },

  async getGamesForWheel() {
    const res = await fetch(`${this.baseUrl}/games/wheel`);
    return res.json();
  },

  async getGame(id) {
    const res = await fetch(`${this.baseUrl}/games/${id}`);
    return res.json();
  },

  async addGame(data) {
    const res = await fetch(`${this.baseUrl}/games`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async toggleGameVisibility(id, visible) {
    const res = await fetch(`${this.baseUrl}/games/${id}/visibility`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ visible })
    });
    return res.json();
  },

  async deleteGame(id) {
    const res = await fetch(`${this.baseUrl}/games/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return res.json();
  },

  // Results
  async getResults() {
    const res = await fetch(`${this.baseUrl}/results`);
    return res.json();
  },

  async addResult(data) {
    const res = await fetch(`${this.baseUrl}/results`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteResult(id) {
    const res = await fetch(`${this.baseUrl}/results/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return res.json();
  }
};
