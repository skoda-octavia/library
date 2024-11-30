import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    loadBookDetails();
    checkUserRole();
  }, [id]);

  const loadBookDetails = async () => {
    try {
      const response = await axios.get(`https://localhost:7013/api/books/${id}`);
      setBook(response.data);
    } catch (error) {
      console.error("Wystąpił błąd podczas ładowania szczegółów książki:", error);
    }
  };

  const checkUserRole = () => {
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
  };

  const handleReserve = async () => {
    try {
      const response = await axios.post(`https://localhost:7013/api/reservations`, {
        bookId: id,
      });
      setMessage("Książka została zarezerwowana pomyślnie!");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Wystąpił błąd podczas rezerwacji.");
      console.error(error);
    }
  };

  const handleEdit = () => {
    navigate(`/Books/Edit/${id}`);
  };

  const handleBack = () => {
    navigate("/");
  };

  if (!book) {
    return <div>Ładowanie szczegółów książki...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Szczegóły Książki</h2>
      <div>
        <h4>{book.title}</h4>
        <hr />
        <dl className="row">
          <dt className="col-sm-2">Wydawca</dt>
          <dd className="col-sm-10">{book.publisher}</dd>

          <dt className="col-sm-2">Autor</dt>
          <dd className="col-sm-10">{book.author}</dd>

          <dt className="col-sm-2">Data Publikacji</dt>
          <dd className="col-sm-10">{new Date(book.published).toLocaleDateString()}</dd>

          <dt className="col-sm-2">Cena</dt>
          <dd className="col-sm-10">{book.price} zł</dd>
        </dl>
      </div>

      <div className="d-flex justify-content-start align-items-center">
        {isAdmin && (
          <button className="btn btn-primary me-2" onClick={handleEdit}>
            Edytuj
          </button>
        )}

        {isSignedIn && !isAdmin && (
          <button className="btn btn-success me-2" onClick={handleReserve}>
          Rezerwuj
          </button>
        )}

        <button className="btn btn-secondary ms-2" onClick={handleBack}>
          Powrót
        </button>
      </div>

      {message && (
        <div className="alert alert-success mt-3 w-100">
          {message}
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger mt-3 w-100">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default BookDetails;
