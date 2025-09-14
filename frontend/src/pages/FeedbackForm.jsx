
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'

export default function FeedbackForm({ edit=false }){
  const params = useParams()
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [courseId, setCourseId] = useState('')
  const [rating, setRating] = useState(5)
  const [message, setMessage] = useState('')

  useEffect(()=>{
    (async()=>{
      const { data } = await api.get('/api/courses')
      setCourses(data.courses)
    })()
  },[])

  useEffect(()=>{
    if (edit) {
      (async()=>{
        // Load existing feedback
        // There's no GET /feedback/:id, so fetch mine and find the record (simple client-side fallback)
        const { data } = await api.get('/api/feedback/mine?limit=1000')
        const item = data.items.find(x=>x._id===params.id)
        if (item){
          setCourseId(item.course?._id)
          setRating(item.rating)
          setMessage(item.message)
        }
      })()
    }
  },[edit, params.id])

  const submit = async (e)=>{
    e.preventDefault()
    if (!courseId) return alert('Select a course')
    if (edit) {
      await api.put(`/api/feedback/${params.id}`, { rating: Number(rating), message })
    } else {
      await api.post('/api/feedback', { courseId, rating: Number(rating), message })
    }
    navigate('/')
  }

  return (
    <div className='card' style={{maxWidth:560, margin:'20px auto'}}>
      <h2>{edit? 'Edit' : 'New'} Feedback</h2>
      <form onSubmit={submit}>
        <label>Course</label>
        <select className='input' value={courseId} onChange={e=>setCourseId(e.target.value)}>
          <option value=''>-- Select --</option>
          {courses.map(c=> <option key={c._id} value={c._id}>{c.title}</option>)}
        </select>
        <label>Rating (1-5)</label>
        <input className='input' type='number' min='1' max='5' value={rating} onChange={e=>setRating(e.target.value)} />
        <label>Message</label>
        <textarea className='input' rows='4' value={message} onChange={e=>setMessage(e.target.value)} />
        <button className='btn' type='submit'>{edit? 'Save' : 'Submit'}</button>
      </form>
    </div>
  )
}
