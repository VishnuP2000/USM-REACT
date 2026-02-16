import "./AdminDashboard.css";
import React, { useEffect, useState,useMemo } from "react";
import axios from "axios";
import Modal from "./Modal"; // Make sure this is the correct path
import UploadImage from "../../User/SignUp/UploadImage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import adminApi from '../adminAxiosInstance'
import debounce from 'lodash.debounce'


function AdminDashboard() {

      const [query, setQuery] = useState("");
  const [searchUsers, setsearchUsers] = useState([]);

  const [users, setUsers] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const usersPerPage = 5;

const indexOfLastUser = currentPage * usersPerPage;
const indexOfFirstUser = indexOfLastUser - usersPerPage;
const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
const searchedUsers = searchUsers.slice(indexOfFirstUser, indexOfLastUser);

const totalPages = Math.ceil(users.length / usersPerPage);


const [isModalOpen, setIsModalOpen] = useState(false);
const [editingUserId, setEditingUserId] = useState(null);
const [isAddModalOpen, setIsAddModalOpen] = useState(false);
const [addUserData, setAddUserData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    location: "",
    image: null,
    password: "",
    confirmPassword: "",
  });
console.log('addUserData',addUserData)
   
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    location: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);
  
  console.log("users", users);
  const fetchUsers = async () => {
    try {
      const res = await adminApi.get("/admin/getUsers");
      if (res.data.message === "succesfully") {

        console.log('res.data',res.data)
        localStorage.setItem('jwtUser',res.data.token)
        setUsers(res.data.user);
      }
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      console.log("it is handleDelete",userId);
      
    const res=await adminApi.delete(`/admin/deleteUser/${userId}`);

      if(res.data.message=="User deleted successfully"){
        console.log('succefully delete data')
        setUsers(users.filter((user) => user._id !== userId));
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user._id); // Save the user ID to update later
    setEditData({
      name: user.name,
      email: user.email,
      contactNumber: user.contactNumber,
      location: user.location,
      image: user.image,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
    const res= await adminApi.put(
        `/admin/editUsers?id=${editingUserId}`, editData,{
         
        });
        if(res.data.message=='successfully'){

          setIsModalOpen(false);
          fetchUsers();
                localStorage.setItem('jwtUser',res.data.token)
        }
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  const handleAddSave=async()=>{
    try {
      console.log('it is handleAddSave')
      const res=await adminApi.post('/admin/AddUser',addUserData,{
      
      })
      if(res.data.message=='success'){
        toast.success('successfully add user')
        console.log('it is res',res.data)
        localStorage.setItem('jwtUser',res.data.token)
        fetchUsers()
        setIsAddModalOpen(false)
      }else if(res.data.message=='exist'){
        toast.error('datas are already exist')
      }
    } catch (error) {
      console.log('it is error',error)
    }
  }

  const handleInputChange = (e) => {
    console.log("it is handleInput");
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imageUrl = await UploadImage(file);
      setEditData({ ...editData, image: imageUrl });
    } catch (err) {
      console.error("Image upload failed", err);
    }
  };
  const handleUploadImage=async(e)=>{
        const file = e.target.files[0];
    if (!file) return;

    try {
      const imageUrl = await UploadImage(file);
      setAddUserData({ ...addUserData, image: imageUrl });
    } catch (err) {
      console.error("Image upload failed", err);
    }
  }
  const handleAddUser = (e) => {
    console.log("it is handleAddUser");
    setAddUserData({ ...addUserData, [e.target.name]: e.target.value });
  };
  const AddUser = () => {
    console.log("it is addUser");
    setIsAddModalOpen(true);
  };
  const logout = () => {
    console.log("it is logout");
    localStorage.removeItem("jwtUser");
    console.log("it is removeItem");
    navigate("/admin");
  };



  // Debounced search function
  const debouncedSearch = useMemo(() =>
    debounce(async (value) => {
      console.log('it is enter the debounceDashsearch')
      if (!value.trim()) return;
      console.log('it is value',value)
      try {
        const res = await axios.get(`https://usm-react.onrender.com/admin/searchUsers?search=${value}`);
      if(res.data.message=='success'){
          console.log('res.data.user',res.data.user)
          setsearchUsers(res.data.user);
          console.log('searchUsers',searchUsers)
      }
      } catch (err) {
        console.error("Error fetching users", err);
      }
    }, 500), []); // 500ms delay

  const handleChange = (e) => {
    console.log('it is handlechange on search')
    console.log('e.target.value',e.target.value)
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  

  return (

    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>






      <div className="ml-96">    
              <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={handleChange}
      />
       




      </div>
      <button
        onClick={AddUser}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Add New User
      </button>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Edit User</h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleUploadImage}
          className="block w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <input
          name="name"
          value={addUserData.name}
          onChange={handleAddUser}
          placeholder="enter name"
        />

        <input
          name="email"
          value={addUserData.email}
          onChange={handleAddUser}
          placeholder="enter email"
        />

        <input
          name="contactNumber"
          value={addUserData.contactNumber}
          onChange={handleAddUser}
          placeholder="enter contact number"
        />

        <input
          name="location"
          value={addUserData.location}
          onChange={handleAddUser}
          placeholder="enter location"
        />
        <input
          type="password"
          name="password"
          placeholder="enter Password"
          value={addUserData.password}
          onChange={handleAddUser}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="enter Confirm Password"
          value={addUserData.confirmPassword}
          onChange={handleAddUser}
        />

        <button
          onClick={() => handleAddSave()}
          className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
        >
          Save
        </button>
        <button
          onClick={() => setIsAddModalOpen(false)}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </Modal>
      <button onClick={logout} className="adminLogout">
        logout
      </button>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Contact Number</th>
            <th className="p-2 border">Location</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
           {(query.trim() ? searchedUsers : currentUsers).map((user) => (
            <tr key={user._id}>
              <td className="h-7 w-7">
                <img src={user.image} alt="" />
              </td>
              <td className="p-2 border">{user.name}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">{user.contactNumber}</td>
              <td className="p-2 border">{user.location}</td>
              <td className="p-2 border">
                <button
                  onClick={() => handleEdit(user)}
                  className="px-2 py-1 bg-blue-500 text-white rounded mr-2 hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <Modal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                >
                  <h2 className="text-xl font-semibold mb-4">Edit User</h2>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full p-2 mb-4 border border-gray-300 rounded"
                  />

                  <input
                    name="name"
                    value={editData.name}
                    onChange={handleInputChange}
                  />

                  <input
                    name="email"
                    value={editData.email}
                    onChange={handleInputChange}
                  />

                  <input
                    name="contactNumber"
                    value={editData.contactNumber}
                    onChange={handleInputChange}
                  />

                  <input
                    name="location"
                    value={editData.location}
                    onChange={handleInputChange}
                  />

                  <button
                    onClick={() => handleSave()}
                    className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </Modal>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    
    <div className="flex justify-center mt-4 space-x-2">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="px-3 py-1 border rounded bg-gray-200"
  >
    Prev
  </button>

  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
    <button
      key={page}
      onClick={() => setCurrentPage(page)}
      className={`px-3 py-1 border rounded ${
        currentPage === page ? "bg-blue-500 text-white" : "bg-white"
      }`}
    >
      {page}
    </button>
  ))}

  <button
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
    className="px-3 py-1 border rounded bg-gray-200"
  >
    Next
  </button>
</div>


      {/* Modal for Editing */}
    </div>
  );
}

export default AdminDashboard;
