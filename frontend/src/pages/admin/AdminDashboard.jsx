
import React, { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function AdminDashboard(){
  const [data, setData] = useState({ feedbackCount:0, studentCount:0, averages:[] })
  useEffect(()=>{ (async()=>{ const { data } = await api.get('/api/admin/metrics'); setData(data) })() },[])
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div className='row'>
        <div className='card' style={{flex:1}}><h3>Total Feedback</h3><div style={{fontSize:28}}>{data.feedbackCount}</div></div>
        <div className='card' style={{flex:1}}><h3>Students</h3><div style={{fontSize:28}}>{data.studentCount}</div></div>
      </div>
      <div className='card'>
        <h3>Average Ratings per Course</h3>
        <table className='table'>
          <thead><tr><th>Course</th><th>Avg Rating</th><th>Count</th></tr></thead>
          <tbody>
            {data.averages.map((r)=> (
              <tr key={r.courseId}><td>{r.courseTitle}</td><td>{r.avgRating}</td><td>{r.count}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
