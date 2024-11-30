import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import './Login.css';

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundImage = "url('/images/lib.jpeg')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";

    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundAttachment = "";
    };
  }, []);

  const handleUserNameChange = (event) => setUserName(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("https://localhost:7013/api/account/login", {
        userName,
        password,
      });

      if (response.status === 200) {
        Cookies.set("userStatus", "signedIn", { expires: 7 });
        Cookies.set("userRole", response.data.role, { expires: 7 });
        navigate("/");
      }
    } catch (error) {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="account-container">
      <div className="account-box">
        <h2 className="text-center mb-4">Login</h2>

        {error && (
          <div className="text-danger mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="userName" className="form-label">Username</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={handleUserNameChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className="form-control"
            />
          </div>

          <button type="submit" className="btn btn-success w-100 p-2">
            Login
          </button>

          <p className="text-center mt-2">
            Don't have an account yet?{" "}
            <a href="/register" className="text-decoration-none">
              Register
            </a>
          </p>

          <div className="text-center">
            <a href="/" className="text-decoration-none mt-3">
              Back
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
