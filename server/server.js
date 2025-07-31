require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const multer   = require('multer');
const fs       = require('fs');
const path     = require('path');
require('dotenv').config();

// 1️⃣ Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// Connect to MongoDB using the URI from .env
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));


// 2️⃣ Multer setup (writes into our absolute uploadDir)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename:    (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext    = file.originalname.split('.').pop();
    cb(null, `${unique}.${ext}`);
  }
});
const upload = multer({ storage });

const app = express();

// ✅ 3️⃣ CORS setup — allow only frontend (change URL if needed)
app.use(cors({
  origin: 'http://localhost:3000', // Change to your frontend domain if deployed
  credentials: true
}));

// ✅ 4️⃣ Parse JSON bodies
app.use(express.json());

// ✅ 5️⃣ Serve uploaded images
app.use('/uploads', express.static(uploadDir));

// ✅ 6️⃣ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser:    true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB error:', err.message));

// ✅ 7️⃣ API routes
app.use('/api/auth',  require('./routes/auth'));
app.use('/api/posts', upload.single('image'), require('./routes/posts'));

// ✅ 8️⃣ Start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
