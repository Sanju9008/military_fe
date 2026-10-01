import React, { useState, useEffect } from 'react';
import TransactionForm from './TransactionForm';
import API from '../services/api';

const AssignmentsExpenditures = () => {
  const [activeTab, setActiveTab] = useState('ASSIGNMENT');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [equipmentFilter, setEquipmentFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { type: activeTab };
      if (equipmentFilter) params.equipmentTypeId = equipmentFilter;

      const response = await API.get('/transactions', { params });
      setLogs(response.data);
    } catch (err) {
      setError(`Failed to load ${activeTab.toLowerCase()} records`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [activeTab, equipmentFilter]);

  return (
    <div className="page-container">
      {/* Top Header Bar */}
      <div className="top-bar">
        <h2>Assignments & Expenditures</h2>
        <button className="primary-btn" onClick={() => setShowModal(true)}>
          + Record New {activeTab === 'ASSIGNMENT' ? 'Assignment' : 'Expenditure'}
        </button>
      </div>

      {/* Responsive Tab Switcher */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('ASSIGNMENT')}
          style={{
            flex: '1',
            padding: '10px 16px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            backgroundColor: activeTab === 'ASSIGNMENT' ? '#2563eb' : '#f1f5f9',
            color: activeTab === 'ASSIGNMENT' ? '#ffffff' : '#475569',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Personnel Assignments Log
        </button>
        <button
          onClick={() => setActiveTab('EXPENDITURE')}
          style={{
            flex: '1',
            padding: '10px 16px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            backgroundColor: activeTab === 'EXPENDITURE' ? '#2563eb' : '#f1f5f9',
            color: activeTab === 'EXPENDITURE' ? '#ffffff' : '#475569',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Expended Assets Log
        </button>
      </div>

      {/* Pop-up Modal Form */}
      {showModal && (
        <TransactionForm
          type={activeTab}
          onClose={() => setShowModal(false)}
          onSuccess={fetchLogs}
        />
      )}

      {/* Dynamic Log Table */}
      <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <h3>{activeTab === 'ASSIGNMENT' ? 'Personnel Assignment Log' : 'Expended Assets Log'}</h3>
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
          <div>Loading records...</div>
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
                    <th>Source Base</th>
                    {activeTab === 'ASSIGNMENT' && <th>Assigned Personnel</th>}
                    <th>Recorded By</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={activeTab === 'ASSIGNMENT' ? '8' : '7'} style={{ textAlign: 'center', color: '#64748b' }}>
                        No {activeTab.toLowerCase()} records found
                      </td>
                    </tr>
                  ) : (
                    logs.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{new Date(item.createdAt).toLocaleString()}</td>
                        <td>{item.equipmentType?.name || `ID: ${item.equipmentType?.id}`}</td>
                        <td>{item.quantity}</td>
                        <td>{item.fromBase?.name || item.fromBase?.id || 'N/A'}</td>
                        {activeTab === 'ASSIGNMENT' && <td><strong>{item.personnelName || '-'}</strong></td>}
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
              {logs.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '16px' }}>No {activeTab.toLowerCase()} records found</div>
              ) : (
                logs.map((item) => (
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
                    {activeTab === 'ASSIGNMENT' && (
                      <div className="data-row">
                        <span className="data-label">Personnel</span>
                        <span className="data-val">{item.personnelName || '-'}</span>
                      </div>
                    )}
                    <div className="data-row">
                      <span className="data-label">Source Base</span>
                      <span className="data-val">{item.fromBase?.name || item.fromBase?.id || 'N/A'}</span>
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

export default AssignmentsExpenditures;
