import React, { useState } from 'react';
import { createDish } from '../api/api';

const DishForm = ({ onDishAdded }) => {
  const [name, setName]               = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice]             = useState('');
  const [image, setImage]             = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!name.trim()) {
      setError('Dish name is required.');
      return;
    }
    if (!description.trim()) {
      setError('Description is required.');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      setError('Please enter a valid price greater than 0.');
      return;
    }

    setLoading(true);
    try {
      const res = await createDish({ name, description, price, image });
      onDishAdded(res.data);
      setName('');
      setDescription('');
      setPrice('');
      setImage(null);
    } catch (err) {
      console.error(err);
      setError('Failed to add dish. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="dish-form">
      <div className="form-group">
        <label htmlFor="dish-name">Dish Name</label>
        <input
          id="dish-name"
          type="text"
          placeholder="e.g. Chicken Biryani"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="dish-desc">Description</label>
        <input
          id="dish-desc"
          type="text"
          placeholder="A short description…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="dish-price">Price (KES)</label>
        <input
          id="dish-price"
          type="number"
          placeholder="0"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="dish-image">Image</label>
        <input
          id="dish-image"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div>

      {error && <p className="msg-error">{error}</p>}

      <button type="submit" className="btn-primary dish-form-btn" disabled={loading}>
        {loading ? 'Adding…' : '+ Add Dish'}
      </button>
    </form>
  );
};

export default DishForm;