// src/components/Sweets/SweetCard.jsx
import React from 'react';

const SweetCard = ({ sweet, onPurchase, onEdit, onDelete, isAdmin }) => {
  const qty = sweet.quantity ?? 0;
  return (
    <div className="card sweet-card" style={{ padding: 12 }}>
      <div style={{ height: 140, marginBottom: 8, background: '#f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {sweet.image ? <img src={sweet.image} alt={sweet.name} style={{ maxHeight: '100%', maxWidth: '100%' }} /> : <div style={{ color: '#aaa' }}>{sweet.name}</div>}
      </div>
      <h3 style={{ margin: '6px 0' }}>{sweet.name}</h3>
      <p style={{ margin: '6px 0', fontSize: 14 }}>{sweet.description}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong>{sweet.price ? `€${sweet.price}` : '—'}</strong>
          <div style={{ fontSize: 12 }}>{qty} left</div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="button" onClick={onPurchase} disabled={qty === 0}>
            {qty === 0 ? 'Sold out' : 'Purchase'}
          </button>

          {isAdmin && (
            <>
              <button className="button" onClick={onEdit}>Edit</button>
              <button className="button" onClick={onDelete}>Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SweetCard;
