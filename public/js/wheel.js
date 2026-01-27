// Wheel Module
const Wheel = {
  canvas: null,
  ctx: null,
  games: [],
  currentRotation: 0,
  isSpinning: false,
  selectedGame: null,

  colors: [
    '#6366f1', '#8b5cf6', '#f97316', '#22c55e',
    '#ec4899', '#14b8a6', '#f59e0b', '#3b82f6'
  ],

  init() {
    this.canvas = document.getElementById('wheel');
    this.ctx = this.canvas.getContext('2d');
    this.loadGames();
  },

  async loadGames() {
    this.games = await API.getGamesForWheel();
    this.draw();
  },

  draw() {
    const ctx = this.ctx;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(this.currentRotation);

    if (this.games.length === 0) {
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#1a1a2e';
      ctx.fill();
      ctx.fillStyle = '#a0a0b0';
      ctx.font = '16px Poppins';
      ctx.textAlign = 'center';
      ctx.fillText('Ingen spill lagt til', 0, 0);
      ctx.restore();
      return;
    }

    const sliceAngle = (Math.PI * 2) / this.games.length;

    this.games.forEach((game, i) => {
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = this.colors[i % this.colors.length];
      ctx.fill();
      ctx.strokeStyle = '#0f0f1a';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Poppins';

      let name = game.name;
      if (name.length > 15) {
        name = name.substring(0, 12) + '...';
      }

      ctx.fillText(name, radius - 20, 5);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#0f0f1a';
    ctx.fill();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();
  },

  spin() {
    if (this.isSpinning || this.games.length === 0) return;

    this.isSpinning = true;
    document.getElementById('spinBtn').disabled = true;

    const spinDuration = 4000 + Math.random() * 2000;
    const totalRotation = (5 + Math.random() * 5) * Math.PI * 2;
    const startRotation = this.currentRotation;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);

      const easeOut = 1 - Math.pow(1 - progress, 3);
      this.currentRotation = startRotation + totalRotation * easeOut;

      this.draw();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isSpinning = false;
        document.getElementById('spinBtn').disabled = false;
        this.determineWinner();
      }
    };

    requestAnimationFrame(animate);
  },

  determineWinner() {
    if (this.games.length === 0) return;

    const sliceAngle = (Math.PI * 2) / this.games.length;

    let normalizedRotation = this.currentRotation % (Math.PI * 2);
    if (normalizedRotation < 0) normalizedRotation += Math.PI * 2;

    const pointerAngle = (Math.PI * 2 - normalizedRotation + Math.PI * 1.5) % (Math.PI * 2);
    const winningIndex = Math.floor(pointerAngle / sliceAngle) % this.games.length;

    this.selectedGame = this.games[winningIndex];
    this.showGameIntro();
  },

  async showGameIntro() {
    if (!this.selectedGame) return;

    const game = await API.getGame(this.selectedGame.id);

    document.getElementById('introGameName').textContent = game.name;
    document.getElementById('introGameRules').textContent = game.rules;
    document.getElementById('introGameTime').textContent = game.time;
    document.getElementById('introGamePlayers').textContent = game.players;

    GameManager.setCurrentGame(game);

    const introEl = document.getElementById('gameIntro');
    introEl.classList.remove('hidden');
    introEl.classList.add('show');

    Confetti.fire();
  }
};

// Game Manager Module
const GameManager = {
  currentGame: null,
  webPlayer: '',
  devopsPlayer: '',

  setCurrentGame(game) {
    this.currentGame = game;
  },

  showPlayerSelect() {
    document.getElementById('gameIntro').classList.add('hidden');

    document.getElementById('playerSelectGameName').textContent = this.currentGame.name;

    document.getElementById('selectPlayersModal').classList.remove('hidden');
  },

  startGame() {
    const webPlayer = document.getElementById('selectWebPlayer').value;
    const devopsPlayer = document.getElementById('selectDevopsPlayer').value;

    this.webPlayer = webPlayer || 'Team Web';
    this.devopsPlayer = devopsPlayer || 'Team DevOps';

    document.getElementById('selectPlayersModal').classList.add('hidden');

    document.getElementById('activeGameName').textContent = this.currentGame.name;
    document.getElementById('activeGameRules').textContent = this.currentGame.rules;
    document.getElementById('activeWebPlayer').textContent = this.webPlayer;
    document.getElementById('activeDevopsPlayer').textContent = this.devopsPlayer;

    document.getElementById('gameActive').classList.remove('hidden');
  },

  endGame() {
    document.getElementById('gameActive').classList.add('hidden');

    document.getElementById('resultGameId').value = this.currentGame.id;
    document.getElementById('resultGameName').value = this.currentGame.name;
    document.getElementById('resultWebPlayer').value = this.webPlayer;
    document.getElementById('resultDevopsPlayer').value = this.devopsPlayer;

    document.getElementById('resultGameDisplay').textContent = this.currentGame.name;
    document.getElementById('resultWebPlayerName').textContent = this.webPlayer;
    document.getElementById('resultDevopsPlayerName').textContent = this.devopsPlayer;
    document.getElementById('winnerWebName').textContent = this.webPlayer;
    document.getElementById('winnerDevopsName').textContent = this.devopsPlayer;

    document.querySelectorAll('input[name="winner"]').forEach(r => r.checked = false);

    document.getElementById('resultModal').classList.remove('hidden');
  }
};

// Confetti Module
const Confetti = {
  canvas: null,
  ctx: null,
  particles: [],
  animating: false,

  init() {
    this.canvas = document.getElementById('confetti');
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  },

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  fire() {
    this.particles = [];

    for (let i = 0; i < 150; i++) {
      this.particles.push({
        x: this.canvas.width / 2,
        y: this.canvas.height / 2,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20 - 10,
        color: ['#6366f1', '#8b5cf6', '#f97316', '#22c55e', '#ec4899', '#f59e0b'][Math.floor(Math.random() * 6)],
        size: Math.random() * 10 + 5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2
      });
    }

    if (!this.animating) {
      this.animating = true;
      this.animate();
    }
  },

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.5;
      p.rotation += p.rotationSpeed;

      if (p.y > this.canvas.height) return false;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      this.ctx.restore();

      return true;
    });

    if (this.particles.length > 0) {
      requestAnimationFrame(() => this.animate());
    } else {
      this.animating = false;
    }
  }
};
