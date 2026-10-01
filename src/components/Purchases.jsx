import React, { useState, useEffect } from 'react';
import TransactionForm from './TransactionForm';
import API from '../services/api';

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [equipmentFilter, setEquipmentFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchPurchases = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { type: 'PURCHASE' };
      if (equipmentFilter) params.equipmentTypeId = equipmentFilter;

      const response = await API.get('/transactions', { params });
      setPurchases(response.data);
    } catch (err) {
      setError('Failed to load purchase history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [equipmentFilter]);

  return (
    <div className="page-container">
      {/* Header Bar */}
      <div className="top-bar">
        <h2>Asset Purchases</h2>
        <button className="primary-btn" onClick={() => setShowModal(true)}>
          + Record New Purchase
        </button>
      </div>

      {/* Pop-up Modal Form */}
      {showModal && (
        <TransactionForm
          type="PURCHASE"
          onClose={() => setShowModal(false)}
          onSuccess={fetchPurchases}
        />
      )}

      {/* History Log */}
      <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <h3>Purchase History Log</h3>
          <div className="filter-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
            <label style={{ whiteSpace: 'nowrap' }}>Filter Equipment ID: </label>
            <input
              type="number"
              value={equipmentFilter}
              onChange={(e) => setEquipmentFilter(e.target.value)}
              placeholder="All Types"
              className="filter-input"
              style={{ width: '140px' }}
            />
          </div>
        </div>

        {loading ? (
          <div>Loading purchase records...</div>
        ) : error ? (
          <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px' }}>{error}</div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Timestamp</th>
                    <th>Equipment Type</th>
                    <th>Quantity</th>
                    <th>Target Base</th>
                    <th>Recorded By</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.length === 0 ? (
                    <tr><td colSpan="7" style={{ textAlign: 'center', color: '#64748b' }}>No purchase records found</td></tr>
                  ) : (
                    purchases.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{new Date(item.createdAt).toLocaleString()}</td>
                        <td>{item.equipmentType?.name || `ID: ${item.equipmentType?.id}`}</td>
                        <td>{item.quantity}</td>
                        <td>{item.toBase?.name || item.toBase?.id || 'N/A'}</td>
                        <td>{item.createdBy?.username || 'System'}</td>
                        <td>{item.notes || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="mobile-card-list">
              {purchases.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '16px' }}>No purchase records found</div>
              ) : (
                purchases.map((item) => (
                  <div key={item.id} className="data-card">
                    <div className="data-row">
                      <span className="data-label">ID / Date</span>
                      <span className="data-val">#{item.id} - {new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">Equipment</span>
                      <span className="data-val">{item.equipmentType?.name || `ID: ${item.equipmentType?.id}`}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">Quantity</span>
                      <span className="data-val" style={{ color: '#2563eb' }}>{item.quantity} units</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">Target Base</span>
                      <span className="data-val">{item.toBase?.name || item.toBase?.id || 'N/A'}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">Recorded By</span>
                      <span className="data-val">{item.createdBy?.username || 'System'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Purchases;
