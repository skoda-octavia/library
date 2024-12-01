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
        <span
          className="navbar-brand"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          MyApp
        </span>
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
                <span
                  className="nav-link dropdown-toggle text-dark"
                  id="accountDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Account
                </span>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="accountDropdown">
                  <li>
                    <span
                      className="dropdown-item"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/Account/Profile")}
                    >
                      Profile
                    </span>
                  </li>
                  {!isAdmin ? (
                    <>
                      <li>
                        <span
                          className="dropdown-item"
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate("/reservations")}
                        >
                          My Reservations
                        </span>
                      </li>
                      <li>
                        <span
                          className="dropdown-item text-danger"
                          style={{ cursor: "pointer" }}
                          onClick={confirmDelete}
                        >
                          Delete
                        </span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <span
                          className="dropdown-item"
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate("/Books/Manage")}
                        >
                          Manage Books
                        </span>
                      </li>
                      <li>
                        <span
                          className="dropdown-item"
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate("/Reservations/Manage")}
                        >
                          Manage Reservations
                        </span>
                      </li>
                      <li>
                        <span
                          className="dropdown-item"
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate("/Rented/Manage")}
                        >
                          Manage Rented
                        </span>
                      </li>
                    </>
                  )}
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <span
                      className="dropdown-item text-danger"
                      style={{ cursor: "pointer" }}
                      onClick={handleLogout}
                    >
                      Logout
                    </span>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <span
                    className="nav-link text-dark"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </span>
                </li>
                <li className="nav-item">
                  <span
                    className="nav-link text-dark"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </span>
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
