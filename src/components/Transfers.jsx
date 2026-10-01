import React, { useState, useEffect } from 'react';
import TransactionForm from './TransactionForm';
import API from '../services/api';

const Transfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [equipmentFilter, setEquipmentFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchTransfers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { type: 'TRANSFER' };
      if (equipmentFilter) params.equipmentTypeId = equipmentFilter;

      const response = await API.get('/transactions', { params });
      setTransfers(response.data);
    } catch (err) {
      setError('Failed to load transfer history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, [equipmentFilter]);

  return (
    <div className="page-container">
      {/* Header Bar */}
      <div className="top-bar">
        <h2>Inter-Base Transfers</h2>
        <button className="primary-btn" onClick={() => setShowModal(true)}>
          + Record New Transfer
        </button>
      </div>

      {/* Pop-up Modal Form */}
      {showModal && (
        <TransactionForm
          type="TRANSFER"
          onClose={() => setShowModal(false)}
          onSuccess={fetchTransfers}
        />
      )}

      {/* History Log */}
      <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <h3>Transfer Movement Log</h3>
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
          <div>Loading transfer records...</div>
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
                    <th>Qty</th>
                    <th>From Base</th>
                    <th>To Base</th>
                    <th>Initiated By</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {transfers.length === 0 ? (
                    <tr><td colSpan="8" style={{ textAlign: 'center', color: '#64748b' }}>No transfer records found</td></tr>
                  ) : (
                    transfers.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{new Date(item.createdAt).toLocaleString()}</td>
                        <td>{item.equipmentType?.name || `ID: ${item.equipmentType?.id}`}</td>
                        <td>{item.quantity}</td>
                        <td>{item.fromBase?.name || item.fromBase?.id || 'N/A'}</td>
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
              {transfers.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '16px' }}>No transfer records found</div>
              ) : (
                transfers.map((item) => (
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
                      <span className="data-label">Transfer Qty</span>
                      <span className="data-val" style={{ color: '#2563eb' }}>{item.quantity} units</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">From Base</span>
                      <span className="data-val">{item.fromBase?.name || item.fromBase?.id || 'N/A'}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">To Base</span>
                      <span className="data-val">{item.toBase?.name || item.toBase?.id || 'N/A'}</span>
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

export default Transfers;
