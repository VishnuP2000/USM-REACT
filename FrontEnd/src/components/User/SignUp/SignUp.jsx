import React, { useState } from 'react';
import {useDispatch} from 'react-redux'
import './SignUp.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UploadImage from './UploadImage';
import axios from 'axios';
import {login} from '../../../Redux/Redux' 

function SignUp() {
  const navigate = useNavigate();
  const dispatch=useDispatch()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    location: '',
    password: '',
    confirmPassword: '',
    image: null
  });
  


  const handleChange = (e) => { 
  const { name, value, files } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: name === "image" ? files[0] : value
  }));

  if(name=='name'){
    setFormData({...formData,name:value})
  }else if(name=='email'){
    setFormData({...formData,email:value})
  }else if(name=='contactNumber'){
    setFormData({...formData,contactNumber:value})
  }else if(name=='location'){
    setFormData({...formData,location:value})
  }else if(name=='Password'){
    setFormData({...formData,Password:value})
  }else if(name=='confirmPassword'){
    setFormData({...formData,confirmPassword:value})
  }
};




const handleSubmit = async (e) => {
  e.preventDefault();
 const { name, email, contactNumber, location, password, confirmPassword, image } = formData;



  // Validation
  if (!name.trim()) {
    toast.error('Name is required');
    return;
  }

  if (!email.trim()&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    toast.error('Email is required');
    return;
  }

  if (!contactNumber.trim()) {
    toast.error('Contact Number is required');
  }else if(contactNumber.length!=10){
    toast.error('contact number must be 10 digits')
    return;
  }

  if (!location.trim()) {
    toast.error('Location is required');
    return;
  }

  if (!password.trim()) {
    toast.error('Password is required');
    return;
  }else if(password.length<8){
    toast.error('password must be 8 digits')
    return
  }


  if (password !== confirmPassword) {
    toast.error('Passwords do not match');
    return;
  }

  if (!image) {
    toast.error('Image is required');
    return;
  }

  try {
    const imageUpload=await UploadImage(image);
    console.log('succesfully add image to cloudinary')

    const datas={
      name:name,
      email:email,
      contactNumber:contactNumber,
      location:location,
      password:password,
      confirmPassword:confirmPassword,
      image:imageUpload
    }
    console.log('datas',datas)
    
try {
        const response=await axios.post('http://localhost:4000/signUp',datas)
    console.log('response',response)

 if (response.data.message == 'success') {
  localStorage.setItem('user', JSON.stringify({//it is convert json string in to obect
    token: response.data.token,
    user: response.data.user
  }));
  
  dispatch(login({ token: response.data.token, user: response.data.user }));
  toast.success('Signup successful!');
  setTimeout(() => navigate("/Profile"), 2000);
} else {
  toast.error('Signup failed!');
}
} catch (error) {
  console.log('it is response error',error)
}
    
  } catch (error) {
    console.log('error',error)
    
  }



  console.log('succesfull',formData)

};


  return (
    <div className="container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          
        />
        <input
          type="number"
          name="contactNumber"
          placeholder="Contact Number"
          value={formData.contactNumber}
          onChange={handleChange}
          
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          
        />
        <button type="submit">Register</button>
        <span className="flex">
          Already have an account?{' '}
          <h1 className="cursor-pointer" onClick={() => navigate('/sigIn')}>
            SignIn
          </h1>
        </span>
      </form>

      {/* Toast Container to show toast messages */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default SignUp;
