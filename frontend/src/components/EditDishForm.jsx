import React, { useState } from 'react';
import { updateDish } from '../api/api';

function EditDishForm({ dish, onUpdated, onCancel }) {
  const [name, setName]               = useState(dish.name);
  const [description, setDescription] = useState(dish.description);
  const [price, setPrice]             = useState(dish.price);
  const [culturalNotes, setCulturalNotes] = useState(dish.cultural_notes || '');
  const [preparationSteps, setPreparationSteps] = useState(dish.preparation_steps || '');
  const [image, setImage]             = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Dish name is required.'); return; }
    if (!description.trim()) { setError('Description is required.'); return; }
    if (!price || parseFloat(price) <= 0) { setError('Please enter a valid price.'); return; }

    setLoading(true);
    try {
      const res = await updateDish(dish.id, {
        name,
        description,
        price,
        cultural_notes: culturalNotes,
        preparation_steps: preparationSteps,
        image,
      });
      onUpdated(res.data);
    } catch {
      setError('Failed to update dish. Please try again.');
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
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description of the dish"
          rows={2}
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

      <div className="form-group">
        <label>Cultural Notes</label>
        <textarea
          value={culturalNotes}
          onChange={(e) => setCulturalNotes(e.target.value)}
          placeholder="Cultural and historical background of this dish…"
          rows={3}
        />
      </div>

      <div className="form-group">
        <label>Preparation Steps</label>
        <textarea
          value={preparationSteps}
          onChange={(e) => setPreparationSteps(e.target.value)}
          placeholder="Step-by-step preparation instructions…"
          rows={3}
        />
      </div>

      <div className="form-group">
        <label>Replace Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div>

      {error && <p className="msg-error">{error}</p>}

      <div className="edit-form-actions">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving…' : 'Save Changes'}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>

    </form>
  );
}

export default EditDishForm;