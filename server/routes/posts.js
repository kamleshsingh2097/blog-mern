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

// GET /api/posts
// • if logged in → only that user’s posts (drafts + published)
// • if not → only published posts
router.get('/', async (req, res) => {
  const userId = getUserId(req.headers.authorization);
  const filter = userId
    ? { author: userId }
    : { status: 'published' };      // only published for public
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
