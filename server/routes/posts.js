const router = require('express').Router();
const Post   = require('../models/Post');
const jwt    = require('jsonwebtoken');

// Helper: extract user ID from header
const getUserId = header => {
  if (!header) return null;
  try {
    const token = header.split(' ')[1];
 return jwt.verify(token, process.env.JWT_SECRET).userId;
  } catch {
    return null;
  }
};


router.get('/', async (req, res) => {
  const userId = getUserId(req.headers.authorization);
  const filter = userId
    ? { author: userId }
    : { status: 'published' };     
  const posts = await Post.find(filter)
    .populate('author', 'name email');
  res.json(posts);
});

// Auth middleware
const requireAuth = (req, res, next) => {
  const userId = getUserId(req.headers.authorization);
  if (!userId) return res.status(401).json({ error: 'Authentication required' });
  req.userId = userId;
  next();
};

// CREATE
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, content, category, status } = req.body;
    const imagePath = req.file ? req.file.filename : null;
    const post = await Post.create({
      title, content, category, status, imagePath, author: req.userId
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', requireAuth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Not found' });
  if (post.author.toString() !== req.userId)
    return res.status(403).json({ error: 'Forbidden' });

  const { title, content, category, status } = req.body;
  post.title    = title;
  post.content  = content;
  post.category = category;
  post.status   = status;
  if (req.file) post.imagePath = req.file.filename;
  await post.save();
  res.json(post);
});

// GET /api/posts/:id → fetch a single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email');
    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// DELETE
router.delete('/:id', requireAuth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Not found' });
  if (post.author.toString() !== req.userId)
    return res.status(403).json({ error: 'Forbidden' });

  await post.deleteOne();
  res.json({ message: 'Deleted' });
});

module.exports = router;
