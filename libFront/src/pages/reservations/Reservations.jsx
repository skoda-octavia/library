import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Reservations = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get("https://localhost:7013/api/reservations");
        setReservations(response.data);
      } catch (error) {
        setErrorMessage("Wystąpił błąd podczas ładowania rezerwacji.");
      }
    };

    fetchReservations();
  }, []);

  const handleDelete = async (reservationId) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tę rezerwację?")) return;

    try {
      await axios.delete(`https://localhost:7013/api/reservations/${reservationId}`);
      setReservations(reservations.filter((res) => res.reservationId !== reservationId));
    } catch (error) {
      setErrorMessage("Wystąpił błąd podczas usuwania rezerwacji.");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="container mt-4">
      <h2>Moje Rezerwacje</h2>

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Tytuł Książki</th>
            <th>Data Wygaśnięcia</th>
            <th>Akcja</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length > 0 ? (
            reservations.map((reservation) => (
              <tr key={reservation.reservationId}>
                <td>{reservation.bookTitle}</td>
                <td>{new Date(reservation.expires).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(reservation.reservationId)}
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                Brak rezerwacji do wyświetlenia.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <button className="btn btn-secondary" onClick={handleBack}>
        Powrót
      </button>
    </div>
  );
};

export default Reservations;
