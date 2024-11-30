import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    rowVersion: "",
    title: "",
    publisher: "",
    author: "",
    published: "",
    price: "",
    unavailable: false,
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});


  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`https://localhost:7013/api/books/${id}`);
        const data = response.data;

        setFormData({
          ...data,
          price: data.price ? data.price.replace(",", ".") : data.price,
          published: data.published.split("T")[0],
        });
      } catch (error) {
        setErrorMessage("Wystąpił błąd podczas ładowania danych książki.");
      }
    };

    fetchBook();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue = type === "checkbox" ? checked : value;

    if (name === "price") {
      newValue = newValue.replace(/[^0-9,.]/g, "").replace(",", ".");
    }

    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const updatedData = {
        ...formData,
        price: formData.price.toString().replace(",", "."),
      };

      await axios.put(`https://localhost:7013/api/books/${id}`, updatedData);
      setSuccessMessage("Książka została pomyślnie zaktualizowana.");
    } catch (error) {
      if (error.response && error.response.data) {
        const { errors: validationErrors } = error.response.data;
        setErrors(validationErrors || {});
      } else {
        setErrorMessage("Wystąpił błąd podczas zapisywania zmian.");
      }
    }
  };

  const handleCancel = () => {
    navigate(`/Books/Details/${id}`);
  };

  return (
    <div className="container mt-4">
      <h2>Edytuj Książkę</h2>

      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input type="hidden" name="id" value={formData.id} />
        <input type="hidden" name="rowVersion" value={formData.rowVersion} />

        <div className="form-group">
          <label htmlFor="title" className="control-label">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="form-control"
          />
          {errors.title && <span className="text-danger">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="publisher" className="control-label">Publisher</label>
          <input
            type="text"
            id="publisher"
            name="publisher"
            value={formData.publisher}
            onChange={handleInputChange}
            className="form-control"
          />
          {errors.publisher && <span className="text-danger">{errors.publisher}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="author" className="control-label">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            className="form-control"
          />
          {errors.author && <span className="text-danger">{errors.author}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="published" className="control-label">Published Date</label>
          <input
            type="date"
            id="published"
            name="published"
            value={formData.published}
            onChange={handleInputChange}
            className="form-control"
          />
          {errors.published && <span className="text-danger">{errors.published}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="price" className="control-label">Price</label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="form-control"
          />
          {errors.price && <span className="text-danger">{errors.price}</span>}
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            id="unavailable"
            name="unavailable"
            checked={formData.unavailable}
            onChange={handleInputChange}
            className="form-check-input"
          />
          <label htmlFor="unavailable" className="form-check-label">Niedostępna</label>
        </div>

        <div className="mt-4">
          <button type="submit" className="btn btn-primary">Zapisz</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={handleCancel}>
            Anuluj
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBook;
