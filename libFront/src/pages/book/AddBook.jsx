import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddBook = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    publisher: "",
    author: "",
    published: "",
    price: "",
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setGeneralError("");

    try {
      await axios.post("https://localhost:7013/api/books", formData);
      navigate("/Books/ManageBooks");
    } catch (error) {
      if (error.response && error.response.data) {
        const { errors: validationErrors } = error.response.data;
        setErrors(validationErrors || {});
      } else {
        setGeneralError("An error occurred while saving the book.");
      }
    }
  };

  const handleCancel = () => {
    navigate("/Books/ManageBooks");
  };

  return (
    <div className="container mt-4">
      <h2>Add Book</h2>

      {generalError && (
        <div className="alert alert-danger" role="alert">
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="form-control"
          />
          {errors.price && <span className="text-danger">{errors.price}</span>}
        </div>

        <div className="mt-4">
          <button type="submit" className="btn btn-primary">Save</button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;
