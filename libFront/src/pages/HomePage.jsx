import React, { useState, useEffect } from "react";
import axios from "axios";

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async (query = "") => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get("https://localhost:7013/api/books/available", {
        params: { query },
      });
      setBooks(response.data);
    } catch (err) {
      setError("Wystąpił błąd podczas ładowania książek.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    loadBooks(searchQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="container mt-4">
      <div className="text-center">
        <h1 className="display-4">Witaj!</h1>
        <p>Oto nasze dostępne do wypożyczenia książki.</p>
      </div>

      <h2>Lista Książek</h2>

      <div className="mb-3 d-flex align-items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="form-control me-2"
          placeholder="Wyszukaj książki po tytule"
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Szukaj
        </button>
      </div>

      {isLoading ? (
        <div className="text-center">Ładowanie...</div>
      ) : error ? (
        <div className="text-center text-danger">{error}</div>
      ) : books.length === 0 ? (
        <div className="text-center">Brak książek do wyświetlenia.</div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Id</th>
              <th>Tytuł</th>
              <th>Wydawca</th>
              <th>Autor</th>
              <th>Data Publikacji</th>
              <th>Cena</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>
                  <a href={`/Books/Details/${book.id}`}>{book.title}</a>
                </td>
                <td>{book.publisher}</td>
                <td>{book.author}</td>
                <td>{new Date(book.published).toLocaleDateString()}</td>
                <td>{book.price.toLocaleString()} zł</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HomePage;
