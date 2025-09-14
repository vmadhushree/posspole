
import React from 'react'
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import StudentDashboard from './pages/StudentDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageCourses from './pages/admin/ManageCourses'
import ManageStudents from './pages/admin/ManageStudents'
import FeedbackAdmin from './pages/admin/FeedbackAdmin'
import FeedbackForm from './pages/FeedbackForm'

function NavBar(){
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <div className='nav'>
      <div className='container row'>
        <Link to='/' className='brand'>POSSPOLE</Link>
        <div className='spacer'></div>
        {user ? (
          <>
            {user.role==='admin' ? (
              <>
                <Link to='/admin'>Dashboard</Link>
                <Link to='/admin/courses' style={{marginLeft:12}}>Courses</Link>
                <Link to='/admin/students' style={{marginLeft:12}}>Students</Link>
                <Link to='/admin/feedback' style={{marginLeft:12}}>Feedback</Link>
              </>
            ) : (
              <>
                <Link to='/'>My Feedback</Link>
                <Link to='/feedback/new' style={{marginLeft:12}}>New</Link>
              </>
            )}
            <Link to='/profile' style={{marginLeft:12}}>Profile</Link>
            <button className='btn secondary' style={{marginLeft:12}} onClick={()=>{logout(); navigate('/login')}}>Logout</button>
          </>
        ) : (
          <>
            <Link to='/login'>Login</Link>
            <Link to='/signup' style={{marginLeft:12}}>Signup</Link>
          </>
        )}
      </div>
    </div>
  )
}

function Protected({ children }){
  const { user } = useAuth()
  if (!user) return <Navigate to='/login' />
  return children
}

function AdminOnly({ children }){
  const { user } = useAuth()
  if (!user) return <Navigate to='/login' />
  if (user.role !== 'admin') return <Navigate to='/' />
  return children
}

export default function App(){
  return (
    <>
      <NavBar />
      <div className='container'>
        <Routes>
          <Route path='/' element={<Protected><StudentDashboard/></Protected>} />
          <Route path='/feedback/new' element={<Protected><FeedbackForm/></Protected>} />
          <Route path='/feedback/edit/:id' element={<Protected><FeedbackForm edit/></Protected>} />
          <Route path='/profile' element={<Protected><Profile/></Protected>} />

          <Route path='/admin' element={<AdminOnly><AdminDashboard/></AdminOnly>} />
          <Route path='/admin/courses' element={<AdminOnly><ManageCourses/></AdminOnly>} />
          <Route path='/admin/students' element={<AdminOnly><ManageStudents/></AdminOnly>} />
          <Route path='/admin/feedback' element={<AdminOnly><FeedbackAdmin/></AdminOnly>} />

          <Route path='/login' element={<Login/>} />
          <Route path='/signup' element={<Signup/>} />
        </Routes>
      </div>
    </>
  )
}
