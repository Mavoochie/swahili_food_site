import React, { useState } from 'react';
import { createDish } from '../api/api';

const DishForm = ({ onDishAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await createDish({ name, description, price });
      onDishAdded(res.data);
      setName('');
      setDescription('');
      setPrice('');
    } catch {
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
          required
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
          required
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