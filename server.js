const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Data paths
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
const PARTICIPANTS_FILE = path.join(DATA_DIR, 'participants.json');
const GAMES_FILE = path.join(DATA_DIR, 'games.json');
const RESULTS_FILE = path.join(DATA_DIR, 'results.json');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');

// Ensure directories exist
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Admin password (hashed)
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('admin', 10);
const AUTH_TOKEN = 'tvekamp-admin-token-2024';

// Helper functions
function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Auth middleware
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token === AUTH_TOKEN) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// Optional auth - sets req.isAdmin
function optionalAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  req.isAdmin = token === AUTH_TOKEN;
  next();
}

// Auth endpoint
app.post('/api/auth', (req, res) => {
  const { password } = req.body;
  if (bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
    res.json({ token: AUTH_TOKEN });
  } else {
    res.status(401).json({ error: 'Wrong password' });
  }
});

// Verify token endpoint
app.get('/api/auth/verify', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token === AUTH_TOKEN) {
    res.json({ valid: true });
  } else {
    res.status(401).json({ valid: false });
  }
});

// Upload image endpoint
app.post('/api/upload', (req, res) => {
  const { image } = req.body; // base64 image
  if (!image) {
    return res.status(400).json({ error: 'No image provided' });
  }

  // Extract base64 data
  const matches = image.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!matches) {
    return res.status(400).json({ error: 'Invalid image format' });
  }

  const ext = matches[1];
  const data = matches[2];
  const filename = `${uuidv4()}.${ext}`;
  const filepath = path.join(UPLOADS_DIR, filename);

  fs.writeFileSync(filepath, data, 'base64');
  res.json({ url: `/uploads/${filename}` });
});

// Participants endpoints
app.get('/api/participants', (req, res) => {
  const participants = readJSON(PARTICIPANTS_FILE);
  res.json(participants);
});

app.post('/api/participants', (req, res) => {
  const participants = readJSON(PARTICIPANTS_FILE);
  const newParticipant = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  participants.push(newParticipant);
  writeJSON(PARTICIPANTS_FILE, participants);
  res.json(newParticipant);
});

app.delete('/api/participants/:id', requireAuth, (req, res) => {
  let participants = readJSON(PARTICIPANTS_FILE);
  participants = participants.filter(p => p.id !== req.params.id);
  writeJSON(PARTICIPANTS_FILE, participants);
  res.json({ success: true });
});

// Games endpoints - everyone can see all games
app.get('/api/games', (req, res) => {
  const games = readJSON(GAMES_FILE);
  res.json(games);
});

// Public games endpoint for wheel (only visible games)
app.get('/api/games/wheel', (req, res) => {
  const games = readJSON(GAMES_FILE);
  const visibleGames = games.filter(g => g.visible);
  res.json(visibleGames.map(g => ({ id: g.id, name: g.name })));
});

// Get single game (public - for showing after wheel spin)
app.get('/api/games/:id', (req, res) => {
  const games = readJSON(GAMES_FILE);
  const game = games.find(g => g.id === req.params.id);
  if (game) {
    res.json(game);
  } else {
    res.status(404).json({ error: 'Game not found' });
  }
});

// Everyone can add games (but they start as not visible)
app.post('/api/games', (req, res) => {
  const games = readJSON(GAMES_FILE);
  const newGame = {
    id: uuidv4(),
    ...req.body,
    visible: false, // Admin must enable
    createdAt: new Date().toISOString()
  };
  games.push(newGame);
  writeJSON(GAMES_FILE, games);
  res.json(newGame);
});

// Toggle game visibility (admin only)
app.patch('/api/games/:id/visibility', requireAuth, (req, res) => {
  const games = readJSON(GAMES_FILE);
  const game = games.find(g => g.id === req.params.id);
  if (game) {
    game.visible = req.body.visible;
    writeJSON(GAMES_FILE, games);
    res.json(game);
  } else {
    res.status(404).json({ error: 'Game not found' });
  }
});

app.delete('/api/games/:id', requireAuth, (req, res) => {
  let games = readJSON(GAMES_FILE);
  games = games.filter(g => g.id !== req.params.id);
  writeJSON(GAMES_FILE, games);
  res.json({ success: true });
});

// Results endpoints
app.get('/api/results', (req, res) => {
  const results = readJSON(RESULTS_FILE);
  res.json(results);
});

// Everyone can add results
app.post('/api/results', (req, res) => {
  const results = readJSON(RESULTS_FILE);
  const newResult = {
    id: uuidv4(),
    ...req.body,
    timestamp: new Date().toISOString()
  };
  results.push(newResult);
  writeJSON(RESULTS_FILE, results);
  res.json(newResult);
});

app.delete('/api/results/:id', requireAuth, (req, res) => {
  let results = readJSON(RESULTS_FILE);
  results = results.filter(r => r.id !== req.params.id);
  writeJSON(RESULTS_FILE, results);
  res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`Tvekamp server running at http://localhost:${PORT}`);
});
