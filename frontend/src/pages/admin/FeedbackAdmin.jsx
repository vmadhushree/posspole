
import React, { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function FeedbackAdmin(){
  const [courses, setCourses] = useState([])
  const [filters, setFilters] = useState({ courseId:'', rating:'', studentEmail:'' })
  const [data, setData] = useState({ items:[], page:1, pages:1, total:0 })

  useEffect(()=>{ (async()=>{ const { data } = await api.get('/api/courses'); setCourses(data.courses) })() },[])

  const load = async (page=1)=>{
    const params = new URLSearchParams()
    if (filters.courseId) params.set('courseId', filters.courseId)
    if (filters.rating) params.set('rating', filters.rating)
    if (filters.studentEmail) params.set('studentEmail', filters.studentEmail)
    params.set('page', page); params.set('limit', 10)
    const { data } = await api.get(`/api/admin/feedback?${params.toString()}`)
    setData(data)
  }

  useEffect(()=>{ load(1) },[])

  const exportCsv = async ()=>{
    const params = new URLSearchParams()
    if (filters.courseId) params.set('courseId', filters.courseId)
    if (filters.rating) params.set('rating', filters.rating)
    if (filters.studentEmail) params.set('studentEmail', filters.studentEmail)
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/admin/feedback/export?${params.toString()}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'feedback.csv'; a.click(); window.URL.revokeObjectURL(url)
  }

  return (
    <div>
      <h2>All Feedback</h2>
      <div className='card row'>
        <select className='input' value={filters.courseId} onChange={e=>setFilters({...filters, courseId:e.target.value})}>
          <option value=''>All Courses</option>
          {courses.map(c=> <option key={c._id} value={c._id}>{c.title}</option>)}
        </select>
        <select className='input' value={filters.rating} onChange={e=>setFilters({...filters, rating:e.target.value})}>
          <option value=''>Any Rating</option>
          {[1,2,3,4,5].map(r=> <option key={r} value={r}>{r}</option>)}
        </select>
        <input className='input' placeholder='Student email' value={filters.studentEmail} onChange={e=>setFilters({...filters, studentEmail:e.target.value})} />
        <button className='btn' onClick={()=>load(1)}>Apply</button>
        <button className='btn secondary' onClick={exportCsv}>Export CSV</button>
      </div>
      <div className='card'>
        <table className='table'>
          <thead><tr><th>Course</th><th>Student</th><th>Email</th><th>Rating</th><th>Message</th><th>Created</th></tr></thead>
          <tbody>
            {data.items.map(it=> (
              <tr key={it._id}>
                <td>{it.course?.title}</td>
                <td>{it.student?.name}</td>
                <td>{it.student?.email}</td>
                <td>{it.rating}</td>
                <td>{it.message}</td>
                <td>{new Date(it.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='row'>
          <button className='btn secondary' disabled={data.page<=1} onClick={()=>load(data.page-1)}>Prev</button>
          <div>Page {data.page} / {data.pages}</div>
          <button className='btn secondary' disabled={data.page>=data.pages} onClick={()=>load(data.page+1)}>Next</button>
        </div>
      </div>
    </div>
  )
}
