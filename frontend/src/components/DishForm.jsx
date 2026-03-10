import React, { useState } from 'react';
import { createDish } from '../api/api';

const DishForm = ({ onDishAdded }) => {
  const [name, setName]                       = useState('');
  const [description, setDescription]         = useState('');
  const [price, setPrice]                     = useState('');
  const [culturalNotes, setCulturalNotes]     = useState('');
  const [preparationSteps, setPreparationSteps] = useState('');
  const [image, setImage]                     = useState(null);
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Dish name is required.'); return; }
    if (!description.trim()) { setError('Description is required.'); return; }
    if (!price || parseFloat(price) <= 0) { setError('Please enter a valid price greater than 0.'); return; }

    setLoading(true);
    try {
      const res = await createDish({
        name,
        description,
        price,
        cultural_notes: culturalNotes,
        preparation_steps: preparationSteps,
        image,
      });
      onDishAdded(res.data);
      setName('');
      setDescription('');
      setPrice('');
      setCulturalNotes('');
      setPreparationSteps('');
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
        <textarea
          id="dish-desc"
          placeholder="A short description of the dish…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
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
        <label htmlFor="dish-cultural">Cultural Notes</label>
        <textarea
          id="dish-cultural"
          placeholder="Cultural and historical background of this dish…"
          value={culturalNotes}
          onChange={(e) => setCulturalNotes(e.target.value)}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="dish-steps">Preparation Steps</label>
        <textarea
          id="dish-steps"
          placeholder="Step-by-step preparation instructions…"
          value={preparationSteps}
          onChange={(e) => setPreparationSteps(e.target.value)}
          rows={3}
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