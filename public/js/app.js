// Main App Module
const App = {
  currentSection: 'wheel',
  selectedImageData: null,

  async init() {
    await Auth.checkAndApplyAuth();
    Wheel.init();
    Confetti.init();

    this.setupNavigation();
    this.setupAuth();
    this.setupParticipants();
    this.setupGames();
    this.setupResults();
    this.setupGameFlow();
    this.setupModals();

    this.loadParticipants();
    this.loadResults();

    document.getElementById('spinBtn').addEventListener('click', () => Wheel.spin());

    this.updateAuthUI();
  },

  // Navigation
  setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        this.showSection(section);
      });
    });
  },

  showSection(section) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.section === section);
    });

    document.querySelectorAll('.section').forEach(sec => {
      sec.classList.remove('active');
      sec.classList.add('hidden');
    });

    const activeSection = document.getElementById(`${section}-section`);
    if (activeSection) {
      activeSection.classList.remove('hidden');
      activeSection.classList.add('active');
    }

    this.currentSection = section;

    if (section === 'admin' && Auth.isLoggedIn()) {
      this.loadAdminGames();
    }
  },

  // Auth
  setupAuth() {
    const authBtn = document.getElementById('authBtn');
    const authModal = document.getElementById('authModal');
    const authForm = document.getElementById('authForm');
    const authError = document.getElementById('authError');

    authBtn.addEventListener('click', () => {
      if (Auth.isLoggedIn()) {
        Auth.logout();
        this.showSection('wheel');
      } else {
        authModal.classList.remove('hidden');
      }
    });

    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const password = document.getElementById('password').value;

      const success = await Auth.login(password);
      if (success) {
        authModal.classList.add('hidden');
        authForm.reset();
        authError.classList.add('hidden');
        document.body.classList.add('admin-mode');
        this.updateAuthUI();
        this.showSection('admin');
      } else {
        authError.classList.remove('hidden');
      }
    });
  },

  updateAuthUI() {
    const authBtn = document.getElementById('authBtn');
    if (Auth.isLoggedIn()) {
      authBtn.classList.add('logged-in');
      authBtn.title = 'Logg ut';
    } else {
      authBtn.classList.remove('logged-in');
      authBtn.title = 'Admin Login';
    }
  },

  // Participants
  setupParticipants() {
    const addBtn = document.getElementById('addParticipantBtn');
    const modal = document.getElementById('participantModal');
    const form = document.getElementById('participantForm');
    const imageInput = document.getElementById('imageFile');
    const imagePreview = document.getElementById('imagePreview');

    addBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
    });

    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedImageData = e.target.result;
          imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
          imagePreview.classList.add('has-image');
        };
        reader.readAsDataURL(file);
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      let imageUrl = '';
      if (this.selectedImageData) {
        const uploadResult = await API.uploadImage(this.selectedImageData);
        imageUrl = uploadResult.url;
      }

      const participant = {
        name: document.getElementById('name').value,
        team: document.getElementById('team').value,
        funFact: document.getElementById('funFact').value,
        superpower: document.getElementById('superpower').value,
        imageUrl: imageUrl
      };

      await API.addParticipant(participant);
      form.reset();
      this.selectedImageData = null;
      imagePreview.innerHTML = '';
      imagePreview.classList.remove('has-image');
      modal.classList.add('hidden');
      this.loadParticipants();
    });
  },

  async loadParticipants() {
    const participants = await API.getParticipants();

    const webTeam = participants.filter(p => p.team === 'web');
    const devopsTeam = participants.filter(p => p.team === 'devops');

    document.getElementById('webCount').textContent = webTeam.length;
    document.getElementById('devopsCount').textContent = devopsTeam.length;
    document.getElementById('totalCount').textContent = participants.length;

    document.getElementById('webTeam').innerHTML = webTeam.map(p => this.renderParticipantCard(p)).join('');
    document.getElementById('devopsTeam').innerHTML = devopsTeam.map(p => this.renderParticipantCard(p)).join('');

    document.querySelectorAll('.participant-card .delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        await API.deleteParticipant(id);
        this.loadParticipants();
      });
    });

    this.updatePlayerSelects(participants);
  },

  renderParticipantCard(p) {
    const initials = p.name.split(' ').map(n => n[0]).join('').toUpperCase();
    const imageHtml = p.imageUrl
      ? `<img src="${p.imageUrl}" alt="${p.name}" class="participant-image" onerror="this.outerHTML='<div class=\\'participant-image placeholder\\'>${initials}</div>'">`
      : `<div class="participant-image placeholder">${initials}</div>`;

    return `
      <div class="participant-card">
        <button class="delete-btn admin-only" data-id="${p.id}">&times;</button>
        ${imageHtml}
        <div class="participant-name">${p.name}</div>
        ${p.superpower ? `<div class="participant-superpower">${p.superpower}</div>` : ''}
        ${p.funFact ? `<div class="participant-funfact">"${p.funFact}"</div>` : ''}
      </div>
    `;
  },

  updatePlayerSelects(participants) {
    const webPlayers = participants.filter(p => p.team === 'web');
    const devopsPlayers = participants.filter(p => p.team === 'devops');

    // Update all web player selects
    const webSelects = [
      document.getElementById('selectWebPlayer')
    ];

    // Update all devops player selects
    const devopsSelects = [
      document.getElementById('selectDevopsPlayer')
    ];

    webSelects.forEach(select => {
      if (select) {
        select.innerHTML = '<option value="">Velg spiller...</option>' +
          webPlayers.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
      }
    });

    devopsSelects.forEach(select => {
      if (select) {
        select.innerHTML = '<option value="">Velg spiller...</option>' +
          devopsPlayers.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
      }
    });
  },

  // Games (Public suggestion + Admin management)
  setupGames() {
    // Public game suggestion
    const addBtn = document.getElementById('addGameBtn');
    const modal = document.getElementById('gameFormModal');
    const form = document.getElementById('gameForm');

    addBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const game = {
        name: document.getElementById('gameName').value,
        rules: document.getElementById('gameRules').value,
        time: parseInt(document.getElementById('gameTime').value) || 5,
        players: parseInt(document.getElementById('gamePlayers').value) || 2
      };

      await API.addGame(game);
      form.reset();
      modal.classList.add('hidden');

      // Show success message
      alert('Takk for forslaget! Admin vil vurdere det.');

      if (Auth.isLoggedIn()) {
        this.loadAdminGames();
      }
    });

    // Admin add game (same modal, different button)
    const adminAddBtn = document.getElementById('adminAddGameBtn');
    if (adminAddBtn) {
      adminAddBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
      });
    }
  },

  async loadAdminGames() {
    const games = await API.getGames();
    const gamesList = document.getElementById('adminGamesList');

    if (games.length === 0) {
      gamesList.innerHTML = '<p style="text-align:center;color:var(--text-secondary);padding:2rem;">Ingen spill lagt til enda.</p>';
      return;
    }

    gamesList.innerHTML = games.map(g => `
      <div class="game-card ${g.visible ? '' : 'not-visible'}">
        <div class="game-info">
          <h3>${g.name}</h3>
          <p>${g.rules}</p>
          <div class="game-meta">
            <span>${g.time} min</span>
            <span>${g.players} spillere</span>
          </div>
        </div>
        <div class="game-controls">
          <div class="visibility-toggle">
            <label class="toggle-switch">
              <input type="checkbox" ${g.visible ? 'checked' : ''} data-id="${g.id}">
              <span class="toggle-slider"></span>
            </label>
            <span class="toggle-label">På hjulet</span>
          </div>
          <button class="delete-btn" data-id="${g.id}" style="position:static;opacity:1;">&times;</button>
        </div>
      </div>
    `).join('');

    gamesList.querySelectorAll('.toggle-switch input').forEach(toggle => {
      toggle.addEventListener('change', async () => {
        const id = toggle.dataset.id;
        const visible = toggle.checked;
        await API.toggleGameVisibility(id, visible);
        this.loadAdminGames();
        Wheel.loadGames();
      });
    });

    gamesList.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const gameName = btn.closest('.game-card').querySelector('h3').textContent;

        // Show confirmation modal
        const confirmed = await this.showDeleteConfirm(gameName);
        if (confirmed) {
          await API.deleteGame(id);
          this.loadAdminGames();
          Wheel.loadGames();
        }
      });
    });
  },

  // Game Flow: Intro -> Select Players -> Active Game -> Result
  setupGameFlow() {
    // Select players button (in intro)
    document.getElementById('selectPlayersBtn').addEventListener('click', () => {
      GameManager.showPlayerSelect();
    });

    // Start game button (in player select modal)
    document.getElementById('startGameBtn').addEventListener('click', () => {
      GameManager.startGame();
    });

    // End game button (in active game)
    document.getElementById('endGameBtn').addEventListener('click', () => {
      GameManager.endGame();
    });
  },

  // Results
  setupResults() {
    const resultForm = document.getElementById('resultForm');

    resultForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const winner = document.querySelector('input[name="winner"]:checked');
      if (!winner) {
        alert('Velg en vinner!');
        return;
      }

      const result = {
        gameId: document.getElementById('resultGameId').value,
        gameName: document.getElementById('resultGameName').value,
        winner: winner.value,
        webPlayer: document.getElementById('resultWebPlayer').value,
        devopsPlayer: document.getElementById('resultDevopsPlayer').value
      };

      await API.addResult(result);
      resultForm.reset();
      document.getElementById('resultModal').classList.add('hidden');
      this.loadResults();

      // Big celebration!
      Confetti.fire();
      setTimeout(() => Confetti.fire(), 300);
      setTimeout(() => Confetti.fire(), 600);
    });
  },

  async loadResults() {
    const results = await API.getResults();

    const webWins = results.filter(r => r.winner === 'web').length;
    const devopsWins = results.filter(r => r.winner === 'devops').length;

    document.getElementById('webScore').textContent = webWins;
    document.getElementById('devopsScore').textContent = devopsWins;

    const history = document.getElementById('resultsHistory');
    if (results.length === 0) {
      history.innerHTML = '<p style="text-align:center;color:var(--text-secondary)">Ingen kamper spilt enda</p>';
      return;
    }

    history.innerHTML = results.slice().reverse().map(r => `
      <div class="result-item ${r.winner}-win">
        <div>
          <div class="result-game">${r.gameName}</div>
          <div class="result-players">${r.webPlayer || 'Team Web'} vs ${r.devopsPlayer || 'Team DevOps'}</div>
        </div>
        <span class="result-winner">${r.winner === 'web' ? 'Web' : 'DevOps'} vant!</span>
      </div>
    `).join('');
  },

  // Modals
  setupModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('close-modal')) {
          modal.classList.add('hidden');
          if (modal.id === 'participantModal') {
            this.selectedImageData = null;
            document.getElementById('imagePreview').innerHTML = '';
            document.getElementById('imagePreview').classList.remove('has-image');
          }
        }
      });
    });

    document.getElementById('gameIntro').addEventListener('click', (e) => {
      if (e.target.id === 'gameIntro') {
        document.getElementById('gameIntro').classList.add('hidden');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
        document.getElementById('gameIntro').classList.add('hidden');
      }
    });
  },

  // Delete confirmation
  showDeleteConfirm(gameName) {
    return new Promise((resolve) => {
      const modal = document.getElementById('deleteConfirmModal');
      const nameEl = document.getElementById('deleteGameName');
      const confirmBtn = document.getElementById('confirmDeleteBtn');
      const cancelBtn = document.getElementById('cancelDeleteBtn');

      nameEl.textContent = gameName;
      modal.classList.remove('hidden');

      const cleanup = () => {
        modal.classList.add('hidden');
        confirmBtn.removeEventListener('click', onConfirm);
        cancelBtn.removeEventListener('click', onCancel);
      };

      const onConfirm = () => {
        cleanup();
        resolve(true);
      };

      const onCancel = () => {
        cleanup();
        resolve(false);
      };

      confirmBtn.addEventListener('click', onConfirm);
      cancelBtn.addEventListener('click', onCancel);
    });
  }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
