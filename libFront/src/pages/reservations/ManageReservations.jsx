import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get("https://localhost:7013/api/reservations");
        setReservations(response.data);
      } catch (error) {
        console.error("Wystąpił błąd podczas pobierania danych rezerwacji.", error);
      }
    };

    fetchReservations();
  }, []);

  const handleRent = async (reservationId) => {
    if (!window.confirm("Czy na pewno chcesz oznaczyć rezerwację jako wypożyczoną?")) return;

    try {
      const response = await axios.post("https://localhost:7013/api/reservations/rent", {
        id: reservationId,
      });

      setMessage(response.data.message || "Rezerwacja została oznaczona jako wypożyczona.");
      setReservations(reservations.filter((res) => res.reservationId !== reservationId));
    } catch (error) {
      console.error("Wystąpił błąd podczas oznaczania rezerwacji jako wypożyczonej.", error);
    }
  };

  const handleDelete = async (reservationId) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tę rezerwację?")) return;

    try {
      await axios.delete(`https://localhost:7013/api/reservations/${reservationId}`);

      setMessage("Rezerwacja została usunięta.");
      setReservations(reservations.filter((res) => res.reservationId !== reservationId));
    } catch (error) {
      console.error("Wystąpił błąd podczas usuwania rezerwacji.", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage Reservations</h2>

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
          {reservations.length > 0 ? (
            reservations.map((reservation) => (
              <tr key={reservation.reservationId}>
                <td>{reservation.reservationId}</td>
                <td>{reservation.username}</td>
                <td>{reservation.bookTitle}</td>
                <td>{new Date(reservation.expires).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-success me-2"
                    onClick={() => handleRent(reservation.reservationId)}
                  >
                    Rent
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(reservation.reservationId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                Brak rezerwacji do wyświetlenia.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageReservations;
