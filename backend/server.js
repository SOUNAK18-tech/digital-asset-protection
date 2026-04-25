const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

app.use('/uploads', express.static(UPLOADS_DIR));

// In-memory storage for assets
let assets = [];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// Routes
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const isVideo = req.file.mimetype.startsWith('video/');

  const newAsset = {
    id: Date.now().toString(),
    filename: req.file.filename,
    originalName: req.file.originalname,
    type: isVideo ? 'video' : 'image',
    url: `/uploads/${req.file.filename}`,
    status: 'Safe',
    uploadDate: new Date().toISOString()
  };

  assets.push(newAsset);
  res.status(201).json(newAsset);
});

app.get('/api/assets', (req, res) => {
  res.json(assets);
});

app.patch('/api/assets/:id/report', (req, res) => {
  const { id } = req.params;
  const asset = assets.find(a => a.id === id);
  
  if (!asset) {
    return res.status(404).json({ error: 'Asset not found' });
  }

  asset.status = 'Reported';
  res.json(asset);
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
