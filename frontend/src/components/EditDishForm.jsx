import React, { useState } from 'react';
import { updateDish } from '../api/api';

function EditDishForm({ dish, onUpdated, onCancel }) {
  const [name, setName] = useState(dish.name);
  const [price, setPrice] = useState(dish.price);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await updateDish(dish.id, { name, price });
      onUpdated(res.data);
    } catch {
      setError('Failed to update dish.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <div className="form-group">
        <label>Dish Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Dish name"
          required
        />
      </div>
      <div className="form-group">
        <label>Price (KES)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          min="0"
          required
        />
      </div>

      {error && <p className="msg-error">{error}</p>}

      <div className="edit-form-actions">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving…' : 'Save'}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EditDishForm;