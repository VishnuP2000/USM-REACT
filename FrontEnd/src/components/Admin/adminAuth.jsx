import React, { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const UserAuth = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtUser");
    console.log('token',token)
    let data = null;

    if (token) {
      try {
        console.log('it is userAuth token ',token)
        data = jwtDecode(token);
      } catch (error) {
        console.error("Token decode error:", error);
      }
    }

    console.log(data == null ? "no user found" : "user found");

    if (data == null) {
        console.log('userAuth data is null')
        navigate("/admin");
        console.log('userAuth data is have')
    } else if (data.role != "admin") {
      navigate("/admin");
    }
  }, [navigate]);

  return <>{children}</>;
};

export default UserAuth;
