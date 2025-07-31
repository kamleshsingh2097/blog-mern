import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function CreatePost() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [title, setTitle]       = useState('');
  const [content, setContent]   = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus]     = useState('draft');
  const [image, setImage]       = useState(null);
  const navigate = useNavigate();

  // Predefined categories
  const predefinedCategories = [
    'Technology',
    'Lifestyle',
    'Education',
    'Finance'
  ];

  // If editing, load the existing post
  useEffect(() => {
    if (isEdit) {
      const token = localStorage.getItem('token');
      axios.get(`http://localhost:5002/api/____fill in___`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const post = res.data.find(p => p._id === id);
        if (post) {
          setTitle(post.title);
          setContent(post.content);
          setCategory(post.category);
          setStatus(post.status);
        }
      })
      .catch(console.error);
    }
  }, [isEdit, id]);

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();

    //const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('status', status);
    if (image) formData.append('image', image);

    try {
      const url    = isEdit
        ? `http://localhost:5002/api/posts/${id}`
        : 'http://localhost:5002/api/posts';
      const method = isEdit ? 'put' : 'post';
      await axios[method](url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/');
    } catch (err) {
      alert(err?.response?.data?.error || 'Submission failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <h2>{isEdit ? 'Edit Post' : 'New Post'}</h2>

      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          className="form-control"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Content</label>
        <textarea
          className="form-control"
          rows={4}
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Category</label>
        <select
          className="form-select"
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
        >
          <option value="">-- Select Category --</option>
          {predefinedCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Status</label>
        <select
          className="form-select"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Image (optional)</label>
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        {isEdit ? 'Update' : 'Submit'}
      </button>
    </form>
  );
}
//t
