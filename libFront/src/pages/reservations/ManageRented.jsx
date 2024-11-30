import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageRented = () => {
  const [rentedBooks, setRentedBooks] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRentedBooks = async () => {
      try {
        const response = await axios.get("https://localhost:7013/api/rented");
        setRentedBooks(response.data);
      } catch (error) {
        console.error("Wystąpił błąd podczas pobierania danych.", error);
      }
    };

    fetchRentedBooks();
  }, []);

  const handleReturn = async (reservationId) => {
    if (!window.confirm("Czy na pewno chcesz oznaczyć książkę jako zwróconą?")) return;

    try {
      const response = await axios.post(`https://localhost:7013/api/rented/return`, {
        id: reservationId,
      });

      setMessage(response.data.message || "Książka została oznaczona jako zwrócona.");
      setRentedBooks(rentedBooks.filter((reservation) => reservation.reservationId !== reservationId));
    } catch (error) {
      console.error("Wystąpił błąd podczas zwracania książki.", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage Rented</h2>

      {message && (
        <div className="alert alert-success" role="alert">
          {message}
        </div>
      )}

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Book Title</th>
            <th>Expires</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rentedBooks.length > 0 ? (
            rentedBooks.map((reservation) => (
              <tr key={reservation.reservationId}>
                <td>{reservation.reservationId}</td>
                <td>{reservation.username}</td>
                <td>{reservation.bookTitle}</td>
                <td>{new Date(reservation.expires).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleReturn(reservation.reservationId)}
                  >
                    Return
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                Brak wypożyczonych książek do wyświetlenia.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageRented;
