import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Navbar = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userStatus = Cookies.get("userStatus");
    const userRole = Cookies.get("userRole");
    console.log(userRole);
    console.log(userStatus)

    if (userStatus === "signedIn") {
      setIsSignedIn(true);
    }

    if (userRole === "Admin") {
      setIsAdmin(true);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("userStatus");
    Cookies.remove("userRole");

    setIsSignedIn(false);
    setIsAdmin(false);
    navigate("/login");
  };

  const confirmDelete = () => {
    if (window.confirm("Na pewno chcesz usunąć konto?")) {
      navigate("/account/delete");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          MyApp
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isSignedIn ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle text-dark"
                  id="accountDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Account
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="accountDropdown">
                  <li>
                    <a className="dropdown-item" href="/account/profile">
                      Profile
                    </a>
                  </li>
                  {!isAdmin ? (
                    <>
                      <li>
                        <a className="dropdown-item" href="/reservations">
                          My Reservations
                        </a>
                      </li>
                      <li>
                        <a href="#" className="dropdown-item text-danger" onClick={confirmDelete}>
                          Delete
                        </a>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <a className="dropdown-item" href="/books/manage">
                          Manage Books
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="/reservations/manage">
                          Manage Reservations
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="/rented/manage">
                          Manage Rented
                        </a>
                      </li>
                    </>
                  )}
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <a className="nav-link text-dark" href="/login">
                    Login
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-dark" href="/register">
                    Register
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
