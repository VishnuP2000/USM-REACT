// import React, { useState } from 'react';
import "./Profile.css";
import { useSelector } from "react-redux";
import Edit from "../../../assets/edit.png";
import Swal from "sweetalert2";
import axios from "axios";
import UploadImage from "../SignUp/UploadImage";
import { useDispatch } from "react-redux";
import { login } from "../../../Redux/Redux";
import { logout } from "../../../Redux/Redux";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const state = useSelector((state) => state);

  const handleEdit = () => {
    Swal.fire({
      title: "Edit Profile",
      html: `<input id="name" class="swal2-input" placeholder="Name" value="${state.ums.user.name}" />
       <input id="phone" class="swal2-input" placeholder="Phone" value="${state.ums.user.contactNumber}" />
       <input id="location" class="swal2-input" placeholder="Location" value="${state.ums.user.location}" />
       <input id="email" class="swal2-input" placeholder="Email" value="${state.ums.user.email}" />
          <input
          id="image"
          type="file"
          name="image"
          accept="image/*"
          
          
        />
        `,

      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save",
      preConfirm: async () => {
        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const location = document.getElementById("location").value;
        const email = document.getElementById("email").value;
        const imageInput = document.getElementById("image");
        const imageFile = imageInput.files[0];

        let imageUrl = state.ums.user.image; // default to existing image

        if (imageFile) {
          imageUrl = await UploadImage(imageFile); // upload to Cloudinary
        }

        const formData = {
          name: name,
          phone: phone,
          location: location,
          email: email,
          image: imageUrl,
          password: state.ums.user.password,
          confirmPassword: state.ums.user.confirmPassword,
          prvEmail: state.ums.user.email,
          id: state.ums.user._id,
        };

        try {
          const response = await axios.post(
            "http://localhost:4000/editData",
            formData,{
              headers:{
                Authorization:localStorage.getItem('jwtUser')
              }
            }
          );
          if (response.data.message == "success") {
            localStorage.setItem(
              "user",
              JSON.stringify({
                //it is convert json string in to obect
                token: response.data.token,
                user: response.data.user,
              })
            );
            dispatch(
              login({ token: response.data.token, user: response.data.user })
            );
            toast.success("Signup successful!");
            setTimeout(() => navigate("/Profile"), 2000);
          }
          Swal.fire("Success", "Profile updated successfully", "success");
        } catch (error) {
          console.error("Update failed:", error);
          Swal.fire("Error", "Failed to update profile", "error");
        }
      },
    });
  };

  const handleLogout = () => {
    try {
      dispatch(logout());
      localStorage.removeItem("user"); // Clear localStorage
      navigate("/");
    } catch (error) {
      console.log("it is error", error);
    }
  };

  return (
    <div className="Profile-container ">
      <button className="logout" onClick={handleLogout}>
        logout
      </button>
      <h2>User Profile</h2>

      {state.ums.user ? (
        <div className="user-profile-card">
          <div className="top-row">
            <img
              src={state.ums.user.image}
              alt="Profile"
              className="profile-image"
            />
            <img
              src={Edit}
              alt="Edit"
              className="edit-icon"
              onClick={handleEdit}
            />
          </div>

          <div className="user-info">
            <p>
              <strong>Name:</strong> {state.ums.user.name}
            </p>
            <p>
              <strong>Phone:</strong> {state.ums.user.contactNumber}
            </p>
            <p>
              <strong>Location:</strong> {state.ums.user.location}
            </p>
            <p>
              <strong>Email:</strong> {state.ums.user.email}
            </p>
          </div>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}

export default Profile;
