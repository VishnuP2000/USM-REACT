// import axios from 'axios';
import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css'
import { login } from '../../../Redux/Redux';
// import {login} from '../../../Redux/Redux'


function Login() {
    const dispatch=useDispatch()
    const navigate = useNavigate();
 
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });


  const handleChange = (e) => {
    const {name,value}=e.target;
    setFormData(prev => ({
      ...prev,
      [name]:value
    }));
    if(name=='email'){
      setFormData({...formData,email:value})
    }else if(name=='password'){
      setFormData({...formData,password:value})
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {email,password}=formData


  if (!email.trim()) {
  toast.error('Email is required');
  return;
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  toast.error('Invalid email format');
  return;
}


if (!password) {
  toast.error('Password is required');
  return;
}
if (password.length < 8) {
  toast.error('Password must be at least 8 characters');
  return;
}

const response=await axios.post('https://usm-react.onrender.com/admin/Login',formData)


if (response.data.message === 'success') {
  console.log('resp',response.data)
  localStorage.setItem("jwtUser", response.data.token)
  console.log('response.data',response.data.token)
  dispatch(login({token:response.data.token,user:response.data.user}))
  console.log('admin login response success');
  toast.success("Login successful!");
  setTimeout(() => navigate("/admin/dashboard"), 2000);
} else if(response.data.message=='failure') {
  console.log('datas are not match')
  toast.error("Invalid credentials");
}
   
    <ToastContainer/>
  }

  

  return (
    <div>

    
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-gray-500 p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-1" htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-200"
        >
          Login
        </button>
        
      <span className='flex' >
            {/* Create a new account ?<h1 className='cursor-pointer ' onClick={()=>navigate('/signUp')} >Sign Up </h1> */}
        </span>
      </form>
      <ToastContainer/>
    </div>
    </div>
    
  );
}

export default Login;
