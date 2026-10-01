import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const TransactionForm = ({ type, onClose, onSuccess }) => {
  const { user } = useContext(AuthContext);

  const userBaseId = user?.baseId ? String(user.baseId) : '';
  const isBaseRestricted = user?.role === 'COMMANDER' || user?.role === 'LOGISTICS';

  const [equipmentTypeId, setEquipmentTypeId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [fromBaseId, setFromBaseId] = useState(isBaseRestricted && (type === 'TRANSFER' || type === 'ASSIGNMENT' || type === 'EXPENDITURE') ? userBaseId : '');
  const [toBaseId, setToBaseId] = useState(isBaseRestricted && type === 'PURCHASE' ? userBaseId : '');
  const [personnelName, setPersonnelName] = useState('');
  const [notes, setNotes] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      equipmentTypeId: Number(equipmentTypeId),
      quantity: Number(quantity),
      fromBaseId: fromBaseId ? Number(fromBaseId) : null,
      toBaseId: toBaseId ? Number(toBaseId) : null,
      personnelName,
      notes,
    };

    const endpoint = `/transactions/${type.toLowerCase()}`;

    try {
      await API.post(endpoint, payload);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      if (err.response && typeof err.response.data === 'string') {
        setError(err.response.data);
      } else {
        setError('Failed to record transaction');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={{ margin: 0 }}>Record New {type}</h3>
          <button style={styles.closeX} onClick={onClose}>&times;</button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.group}>
            <label style={styles.label}>Equipment Type ID</label>
            <input
              type="number"
              value={equipmentTypeId}
              onChange={(e) => setEquipmentTypeId(e.target.value)}
              required
              style={styles.input}
              placeholder="e.g. 1"
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              min="1"
              style={styles.input}
              placeholder="e.g. 10"
            />
          </div>

          {(type === 'TRANSFER' || type === 'ASSIGNMENT' || type === 'EXPENDITURE') && (
            <div style={styles.group}>
              <label style={styles.label}>
                From Base ID {isBaseRestricted && '(Locked to your Base)'}
              </label>
              <input
                type="number"
                value={fromBaseId}
                onChange={(e) => setFromBaseId(e.target.value)}
                disabled={isBaseRestricted}
                required
                style={{ ...styles.input, backgroundColor: isBaseRestricted ? '#edf2f7' : '#fff' }}
                placeholder="e.g. 1"
              />
            </div>
          )}

          {(type === 'PURCHASE' || type === 'TRANSFER') && (
            <div style={styles.group}>
              <label style={styles.label}>
                To Base ID {type === 'PURCHASE' && isBaseRestricted && '(Locked to your Base)'}
              </label>
              <input
                type="number"
                value={toBaseId}
                onChange={(e) => setToBaseId(e.target.value)}
                disabled={type === 'PURCHASE' && isBaseRestricted}
                required
                style={{ ...styles.input, backgroundColor: (type === 'PURCHASE' && isBaseRestricted) ? '#edf2f7' : '#fff' }}
                placeholder="e.g. 2"
              />
            </div>
          )}

          {type === 'ASSIGNMENT' && (
            <div style={styles.group}>
              <label style={styles.label}>Personnel Name</label>
              <input
                type="text"
                value={personnelName}
                onChange={(e) => setPersonnelName(e.target.value)}
                required
                style={styles.input}
                placeholder="e.g. Sgt. Marcus Vance"
              />
            </div>
          )}

          <div style={styles.group}>
            <label style={styles.label}>Notes / Reason</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              style={styles.input}
              placeholder="Additional comments..."
            />
          </div>

          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Submitting...' : `Submit ${type}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#ffffff',
    padding: '25px',
    borderRadius: '8px',
    width: '450px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px',
  },
  closeX: {
    background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#718096',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  group: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '13px', color: '#4a5568', marginBottom: '4px' },
  input: { padding: '8px 12px', borderRadius: '4px', border: '1px solid #cbd5e0', fontSize: '14px' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' },
  cancelBtn: { padding: '8px 16px', backgroundColor: '#e2e8f0', color: '#4a5568', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  submitBtn: { padding: '8px 16px', backgroundColor: '#3182ce', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  error: { padding: '10px', marginBottom: '15px', backgroundColor: '#fed7d7', color: '#c53030', borderRadius: '4px', fontSize: '14px' },
};

export default TransactionForm;
