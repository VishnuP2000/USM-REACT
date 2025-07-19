import React, { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const  UserAuth = ({ children }) => {
  const navigate = useNavigate();
console.log('it is userAuth')
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log('token in protected router',token)
    let data = null;

    if (token) {
      try {
        console.log('it is userAuth token ',token)
        data = jwtDecode(token);
        console.log('it is userAuth daaata ',data)
      } catch (error) {
        console.error("Token decode error:", error);
      }
    }

    console.log(data == null ? "no user found" : "user found");

    if (data == null) {
        console.log('userAuth data is null')
        navigate("/");
        console.log('userAuth data is have')
    } else if (data.role != "user") {
      navigate("/");
    }
  }, [navigate]);

  return <>{children}</>;
};

export default UserAuth;
