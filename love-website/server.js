import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import crypto from 'crypto';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Folders for persistent server-side caching
const CACHE_DIR = path.join(__dirname, 'cache');
const IMAGE_CACHE_DIR = path.join(CACHE_DIR, 'images');

if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR);
if (!fs.existsSync(IMAGE_CACHE_DIR)) fs.mkdirSync(IMAGE_CACHE_DIR);

const WISHES_FILE = path.join(CACHE_DIR, 'wishes.json');
if (!fs.existsSync(WISHES_FILE)) {
  fs.writeFileSync(WISHES_FILE, JSON.stringify({}));
}

app.use(express.json());

// 1. Custom IP-Based Rate Limiter Middleware (Zero dependencies)
const rateLimits = new Map(); // IP -> { count, startTime }
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 60;

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();
  
  if (!rateLimits.has(ip)) {
    rateLimits.set(ip, { count: 1, startTime: now });
    return next();
  }
  
  const limitData = rateLimits.get(ip);
  if (now - limitData.startTime > RATE_LIMIT_WINDOW_MS) {
    // Reset window
    limitData.count = 1;
    limitData.startTime = now;
    return next();
  }
  
  limitData.count++;
  if (limitData.count > MAX_REQUESTS_PER_MINUTE) {
    return res.status(429).json({
      error: 'Too many requests. Please try again in a minute.',
      retryAfter: Math.round((RATE_LIMIT_WINDOW_MS - (now - limitData.startTime)) / 1000)
    });
  }
  
  next();
};

app.use('/api', rateLimiter);

// 2. Server-side Image Caching Proxy
// Example: /api/image-proxy?url=https://images.unsplash.com/photo...
app.get('/api/image-proxy', async (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) {
    return res.status(400).send('Image URL is required');
  }

  // Create a safe unique filename hash from the URL
  const hash = crypto.createHash('sha256').update(imageUrl).digest('hex');
  const extension = path.extname(new URL(imageUrl).pathname) || '.jpg';
  const cachePath = path.join(IMAGE_CACHE_DIR, `${hash}${extension}`);

  // Check if image exists in server cache
  if (fs.existsSync(cachePath)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year browser cache
    res.setHeader('X-Cache', 'HIT');
    return res.sendFile(cachePath);
  }

  // Fetch from origin and save to disk cache
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Origin returned status ${response.status}`);
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save image to disk
    fs.writeFileSync(cachePath, buffer);

    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('X-Cache', 'MISS');
    res.send(buffer);
  } catch (error) {
    console.error('Image proxy error:', error);
    res.status(500).send('Failed to proxy and cache image');
  }
});

// 3. Text/Wish Caching & Shortener Endpoint
// POST /api/wishes -> stores card JSON on disk, returns 6-digit short ID
app.post('/api/wishes', (req, res) => {
  const wishData = req.body;
  if (!wishData || !wishData.hero || !wishData.letter) {
    return res.status(400).json({ error: 'Invalid wish data' });
  }

  try {
    const wishes = JSON.parse(fs.readFileSync(WISHES_FILE, 'utf8'));
    
    // Generate a unique 6-digit ID
    let shortId;
    do {
      shortId = Math.random().toString(36).substring(2, 8).toUpperCase();
    } while (wishes[shortId]);

    wishes[shortId] = {
      data: wishData,
      createdAt: Date.now()
    };

    // Save to disk
    fs.writeFileSync(WISHES_FILE, JSON.stringify(wishes, null, 2));

    res.json({ id: shortId, url: `${req.protocol}://${req.get('host')}/?id=${shortId}` });
  } catch (error) {
    console.error('Save wish error:', error);
    res.status(500).json({ error: 'Failed to save wish text' });
  }
});

// GET /api/wishes/:id -> retrieves card JSON from disk cache
app.get('/api/wishes/:id', (req, res) => {
  const { id } = req.params;
  
  try {
    const wishes = JSON.parse(fs.readFileSync(WISHES_FILE, 'utf8'));
    const wish = wishes[id?.toUpperCase()];

    if (!wish) {
      return res.status(404).json({ error: 'Wish not found' });
    }

    res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day browser cache
    res.json(wish.data);
  } catch (error) {
    console.error('Read wish error:', error);
    res.status(500).json({ error: 'Failed to retrieve wish text' });
  }
});

// Serve static assets from production React build
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`LoveCraft backend listening on port ${PORT}`);
  console.log(`Image Cache: ${IMAGE_CACHE_DIR}`);
  console.log(`Text Cache file: ${WISHES_FILE}`);
});
