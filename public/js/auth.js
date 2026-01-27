// Auth Module
const Auth = {
  TOKEN_KEY: 'tvekamp_auth_token',

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  },

  setToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
  },

  removeToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  },

  isLoggedIn() {
    return !!this.getToken();
  },

  async login(password) {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        const data = await res.json();
        this.setToken(data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  async verifyToken() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const res = await fetch('/api/auth/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  logout() {
    this.removeToken();
    document.body.classList.remove('admin-mode');
    App.updateAuthUI();
  },

  async checkAndApplyAuth() {
    if (await this.verifyToken()) {
      document.body.classList.add('admin-mode');
      return true;
    } else {
      this.removeToken();
      document.body.classList.remove('admin-mode');
      return false;
    }
  }
};
