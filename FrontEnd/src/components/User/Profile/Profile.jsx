// import React, { useState } from 'react';
import "./Profile.css";
import { useSelector } from "react-redux";
import Edit from "../../../assets/edit.png";
import Swal from "sweetalert2";
// import axios from "axios";
import UploadImage from "../SignUp/UploadImage";
import { useDispatch } from "react-redux";
import { login } from "../../../Redux/Redux";
import { logout } from "../../../Redux/Redux";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {  useState } from "react";
import EditModal from "./editModal";
import api from "./axiosInstance";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModal, setIsModal] = useState(false);

  const store = useSelector((state) => state.ums.user);
  console.log('it is useSelector data in profile page',store)
// console.log('store.name',store.name)
  const [editedValues, setEditedValues] = useState({
    name: store?.name || "",
    email: store?.email || "",
    contactNumber: store?.contactNumber || '',
    location: store?.location || "",
    image: store?.image || null,
  });

  // useEffect(()=>{
  //   console.log('it is useEffect of profile')
  //   handleSave()
  // },[])

  const handleLogout = () => {
    try {
      dispatch(logout());
      localStorage.removeItem("accessToken"); // Clear localStorage
      navigate("/");
    } catch (error) {
      console.log("it is error", error);
    }
  };
  const handleImageUpload = async (e) => {
    console.log("imafffffffff", e);
    const image = e.target.files[0];
    if (image) {
      const imageUrl = await UploadImage(image);
      console.log("imageUrl", imageUrl);
      setEditedValues({
        ...editedValues,
        image: imageUrl,
        previewUrl: imageUrl,
      });
    }
  };
  const handleInputChange = (e) => {
    const { name, value, file } = e.target;
    setEditedValues((editedValues) => ({
      ...editedValues,
      [name]: name === "image" ? file[0] : value,
    }));
    // console.log('editedvlue',editedValues)

    // console.log('e.target.value',value)
    if (name == "name") {
      setEditedValues((p) => ({ ...p, name: value }));
    } else if (name == "email") {
      setEditedValues({ ...editedValues, email: value });
    } else if (name == "contactNumber") {
      setEditedValues({ ...editedValues, contactNumber: value });
    } else if (name == "location") {
      setEditedValues({ ...editedValues, location: value });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const { name, email, contactNumber, location, image } = editedValues;
    console.log(
      "name,email,contactNumber,location,image",
      name,
      email,
      contactNumber,
      location,
      image
    );
    const finalContactNumber = (
      editedValues.contactNumber || store.contactNumber
    )?.toString();

    // Validation
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    } else if (!email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Email is required");
      return;
    } else if (!finalContactNumber || finalContactNumber.length !== 10) {
      toast.error("Contact number must be 10 digits");
      console.log(
        " finalContactNumber,finalContactNumber.length",
        finalContactNumber,
        finalContactNumber.length
      );
      return;
    } else if (!location.trim()) {
      toast.error("Location is required");
      return;
    }

    //  const imageUrl=await UploadImage(image)
    console.log("image", image);
    const formData = {
      name: name || store.name,
      email: email || store.email,
      contactNumber: finalContactNumber,
      location: location || store.location,
      image: image || store.image,
      prvEmail: store.email,
      password: store.password,
      confirmPassword: store.confirmPassword,
      id: store._id,
    };

    console.log("formData", formData);

    try {

      const response = await api.post("/editData",formData,
       
      );

      console.log("succesfully ", response);
      if (response.data.message == "success") {
        console.log("succesfully get the response ", response.data.updatedUser);
       localStorage.setItem("accessToken",response.data.accessToken);
      }
      dispatch(login({ token: response.data.accessToken,  user: response.data.updatedUser}));
      toast.success("Profile updated!");
        // setTimeout(() => navigate("/Profile"), 2000);
        setTimeout(()=>{
          navigate('/Profile')
          window.location.reload();

        },2000)
    } catch (error) {
      console.log("it is error", error);
    }
  };

  return (
    <div className="Profile-container ">
      <ToastContainer position="top-right" autoClose={3000} />

      <button className="logout" onClick={handleLogout}>
        logout
      </button>
      <h2>User Profile</h2>

      {store ? (
        <div className="user-profile-card">
          <div className="top-row">
            <img src={store.image} alt="Profile" className="profile-image" />
            {isModal ? (
              <EditModal isOpen={isModal} onClose={() => setIsModal(false)}>
                <form action="" onSubmit={handleSave}>
                  <h2 className="text-xl font-semibold mb-4">Edit User</h2>

                  {editedValues.previewUrl ? (
                    <img
                      src={editedValues.previewUrl}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded mb-4"
                    />
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                  )}

                  <input
                    name="name"
                    value={editedValues.name}
                    placeholder={"hello"}
                    onChange={handleInputChange}
                  />

                  <input
                    name="email"
                    value={editedValues.email}
                    // placeholder={state.email}
                    onChange={handleInputChange}
                  />

                  <input
                    name="contactNumber"
                    // placeholder={editedValues.contactNumber}
                    value={editedValues.contactNumber}
                    onChange={handleInputChange}
                  />

                  <input
                    name="location"
                    // placeholder={editedValues.location}
                    value={editedValues.location}
                    onChange={handleInputChange}
                  />

                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsModal(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </form>
              </EditModal>
            ) : (
              <img
                src={Edit}
                alt="Edit"
                className="edit-icon"
                onClick={() => setIsModal(true)}
              />
            )}
          </div>

          <div className="user-info">
            <p>
              <strong>Name:</strong> {store.name}
            </p>
            <p>
              <strong>Phone:</strong> {store.contactNumber}
            </p>
            <p>
              <strong>Location:</strong> {store.location}
            </p>
            <p>
              <strong>Email:</strong> {store.email}
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
