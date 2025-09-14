
import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { Link } from 'react-router-dom'

export default function StudentDashboard(){
  const [data, setData] = useState({ items:[], page:1, pages:1, total:0 })
  const [loading, setLoading] = useState(true)

  const load = async (page=1) => {
    setLoading(true)
    const { data } = await api.get(`/api/feedback/mine?page=${page}&limit=10`)
    setData(data)
    setLoading(false)
  }

  useEffect(()=>{ load(1) },[])

  const remove = async (id) => {
    if (!confirm('Delete this feedback?')) return
    await api.delete(`/api/feedback/${id}`)
    load(data.page)
  }

  return (
    <div>
      <h2>My Feedback</h2>
      <Link className='btn' to='/feedback/new'>+ New Feedback</Link>
      <div className='card'>
        {loading ? 'Loading...' : (
          <>
            <table className='table'>
              <thead>
                <tr><th>Course</th><th>Rating</th><th>Message</th><th>Created</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {data.items.map(it => (
                  <tr key={it._id}>
                    <td>{it.course?.title}</td>
                    <td>{it.rating}</td>
                    <td>{it.message}</td>
                    <td>{new Date(it.createdAt).toLocaleString()}</td>
                    <td className='row'>
                      <Link className='btn secondary' to={`/feedback/edit/${it._id}`}>Edit</Link>
                      <button className='btn danger' onClick={()=>remove(it._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='row'>
              <button className='btn secondary' disabled={data.page<=1} onClick={()=>load(data.page-1)}>Prev</button>
              <div>Page {data.page} / {data.pages}</div>
              <button className='btn secondary' disabled={data.page>=data.pages} onClick={()=>load(data.page+1)}>Next</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
