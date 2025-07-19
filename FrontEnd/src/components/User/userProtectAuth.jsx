import React, { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const UserVeriAuth = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log('token ',token)
    let data = null;

    if (token) {
      try {
          console.error("enter the token",token);
          data = jwtDecode(token);
          console.error("it is data",data);
      } catch (err) {
        console.error("Invalid token error",err);
      }
    }

    console.log(data == null ? "no user found" : "user found");

    if (data && data.role === "user") {
      navigate("/profile");
    }
  }, [navigate]);

  return <>{children}</>;
};

export default UserVeriAuth;
