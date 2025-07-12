import React from 'react'
import Login from './components/User/login/login'
import { Route, Routes } from 'react-router-dom'
import SignUp from './components/User/SignUp/SignUp'
import Profile from './components/User/Profile/Profile'
import AdminLogin from './components/Admin/login/adminLogin'
import AdminDashboard from './components/Admin/AdminDashboard/adminDashboard'
import UserProtectAuth from './components/User/userProtectAuth'
import UserAuth from './components/User/userAuth'
import AdminProtectedAuth from './components/Admin/adminProtectedAuth'
import AdminAuth from './components/Admin/adminAuth'


function App() {
  return (
    <div>
      <Routes>
        <Route 
        path={'/'} element={
       <UserProtectAuth>
          <Login/>
          </UserProtectAuth>
        } />
        <Route path={'/sigIn'} element={
          <UserProtectAuth>
          <Login/>
           </UserProtectAuth>
          } />
        <Route
         path={'/profile'} element={
          <UserAuth>
             <Profile/>
          </UserAuth>
         
         }  />
        <Route path={'/signUp'} element={
          <UserProtectAuth>
              <SignUp/>
          </UserProtectAuth>
          }  />
        <Route path={'/admin'} element={
          <AdminProtectedAuth>
             <AdminLogin/>
          </AdminProtectedAuth>
          }  />
        
        <Route path={'/admin/dashboard'} element={
          <AdminAuth>
            <AdminDashboard/>
          </AdminAuth>
          }  />

      </Routes>
     
    </div>
  )
}

export default App
