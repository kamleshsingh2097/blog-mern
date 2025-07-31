// client/src/pages/Home.js
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function Home() {
  const [posts, setPosts] = useState([])
  const token = localStorage.getItem('token')

  useEffect(() => {
axios
  .get('http://localhost:5002/api/posts', {

        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      .then(res => setPosts(res.data))
      .catch(console.error)
  }, [token])

  const handleDelete = async id => {
    if (!window.confirm('Delete this post?')) return
    await axios.delete(`http://localhost:5002/api/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
setPosts(p => p.filter(post => post._id !== id))

  }

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '2rem',
        fontFamily: 'sans-serif',
        background: '#f0f2f5'
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        {token ? 'My Posts' : 'All Posts'}
      </h1>
      
      {/* Grid Container */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}
      >
{Array.isArray(posts) && posts.map(p => (

          <div
            key={p._id}
            style={{
              background: '#fff',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {p.imagePath && (
              <img
               src={`http://localhost:5002/uploads/${p.imagePath}`}

                alt={p.title}
                style={{ width: '100%', height: 180, objectFit: 'cover' }}
              />
            )}
            <div style={{ padding: '1rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem' }}>{p.title}</h3>
              <p style={{ color: '#555', flexGrow: 1 }}>
                {p.content.length > 100 ? p.content.slice(0,100) + '…' : p.content}
              </p>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                <Link
                  to={`/post/${p._id}`}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    border: '1px solid #007bff',
                    color: '#007bff'
                  }}
                >
                  Read More
                </Link>
                {token && (
                  <>
                    <Link
                      to={`/edit/${p._id}`}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        border: '1px solid #6c757d',
                        color: '#6c757d'
                      }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p._id)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        border: '1px solid #dc3545',
                        background: 'transparent',
                        color: '#dc3545',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
