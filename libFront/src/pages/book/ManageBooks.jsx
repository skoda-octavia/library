import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ManageBooks = () => {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("https://localhost:7013/api/books");
        setBooks(response.data);
      } catch (error) {
        setErrorMessage("Wystąpił błąd podczas ładowania książek.");
      }
    };

    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tę książkę?")) return;

    try {
      await axios.delete(`https://localhost:7013/api/books/${id}`);
      setBooks(books.filter((book) => book.id !== id));
    } catch (error) {
      setErrorMessage("Wystąpił błąd podczas usuwania książki.");
    }
  };

  const handleAddBook = () => {
    navigate("/Books/AddStart");
  };

  const handleEdit = (id) => {
    navigate(`/Books/Edit/${id}`);
  };

  return (
    <div className="container mt-4">
      <h2>Manage Books</h2>

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="mb-3">
        <button className="btn btn-success" onClick={handleAddBook}>
          Add Book
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Publisher</th>
            <th>Author</th>
            <th>Price</th>
            <th>Unavailable</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.length > 0 ? (
            books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.publisher}</td>
                <td>{book.author}</td>
                <td>{book.price}</td>
                <td>
                  {book.unavailable ? (
                    <span className="badge bg-danger">Unavailable</span>
                  ) : (
                    <span className="badge bg-success">Available</span>
                  )}
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEdit(book.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(book.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                Brak książek do wyświetlenia.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBooks;
