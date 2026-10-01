import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [baseId, setBaseId] = useState(user?.role === 'COMMANDER' ? user?.baseId || '' : '');
  const [equipmentTypeId, setEquipmentTypeId] = useState('');
  const [startDate, setStartDate] = useState('2026-01-01T00:00:00');
  const [endDate, setEndDate] = useState('2026-12-31T23:59:59');

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const params = { startDate, endDate };
      const activeBaseId = user?.role === 'COMMANDER' ? user?.baseId : baseId;
      if (activeBaseId) params.baseId = activeBaseId;
      if (equipmentTypeId) params.equipmentTypeId = equipmentTypeId;

      const res = await API.get('/dashboard/metrics', { params });
      setMetrics(res.data);
    } catch (err) {
      console.error('Failed to fetch dashboard metrics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchMetrics();
  };

  const netMovement = metrics
    ? metrics.purchases + metrics.transfersIn - metrics.transfersOut - metrics.assigned - metrics.expended
    : 0;

  return (
    <div className="page-container">
      <h2 style={{ marginBottom: '16px' }}>Asset Dashboard</h2>

      {/* Responsive Filters Bar */}
      <form onSubmit={handleFilterSubmit} className="filter-bar">
        <div className="filter-group">
          <label>Base ID {user?.role === 'COMMANDER' && '(Locked)'}</label>
          <input
            type="number"
            value={user?.role === 'COMMANDER' ? user?.baseId : baseId}
            onChange={(e) => setBaseId(e.target.value)}
            disabled={user?.role === 'COMMANDER'}
            placeholder="All Bases"
            className="filter-input"
            style={{ backgroundColor: user?.role === 'COMMANDER' ? '#f1f5f9' : '#ffffff' }}
          />
        </div>

        <div className="filter-group">
          <label>Equipment Type ID</label>
          <input
            type="number"
            value={equipmentTypeId}
            onChange={(e) => setEquipmentTypeId(e.target.value)}
            placeholder="All Types"
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Start Date</label>
          <input
            type="datetime-local"
            value={startDate.substring(0, 16)}
            onChange={(e) => setStartDate(e.target.value + ':00')}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>End Date</label>
          <input
            type="datetime-local"
            value={endDate.substring(0, 16)}
            onChange={(e) => setEndDate(e.target.value + ':00')}
            className="filter-input"
          />
        </div>

        <button type="submit" className="filter-btn">Apply Filters</button>
      </form>

      {/* Responsive Metric Cards Grid */}
      {loading ? (
        <div>Loading metrics...</div>
      ) : metrics ? (
        <div className="card-grid">
          <div className="metric-card">
            <span className="metric-title">Opening Balance</span>
            <span className="metric-value">{metrics.openingBalance}</span>
          </div>

          <div className="metric-card" style={{ cursor: 'pointer', backgroundColor: '#eff6ff' }} onClick={() => setShowModal(true)}>
            <span className="metric-title">Net Movement (Details)</span>
            <span className="metric-value" style={{ color: netMovement >= 0 ? '#2563eb' : '#dc2626' }}>
              {netMovement > 0 ? `+${netMovement}` : netMovement}
            </span>
          </div>

          <div className="metric-card">
            <span className="metric-title">Assigned</span>
            <span className="metric-value">{metrics.assigned}</span>
          </div>

          <div className="metric-card">
            <span className="metric-title">Expended</span>
            <span className="metric-value">{metrics.expended}</span>
          </div>

          <div className="metric-card" style={{ backgroundColor: '#f0fdf4' }}>
            <span className="metric-title">Closing Balance</span>
            <span className="metric-value" style={{ color: '#16a34a' }}>{metrics.closingBalance}</span>
          </div>
        </div>
      ) : (
        <div>No data available</div>
      )}

      {/* Pop-up Breakdown Modal */}
      {showModal && metrics && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px' }}>Net Movement Breakdown</h3>
            <table className="custom-table" style={{ minWidth: '100%', marginBottom: '20px' }}>
              <tbody>
                <tr>
                  <td>Purchases (+)</td>
                  <td><strong>{metrics.purchases}</strong></td>
                </tr>
                <tr>
                  <td>Transfers In (+)</td>
                  <td><strong>{metrics.transfersIn}</strong></td>
                </tr>
                <tr>
                  <td>Transfers Out (-)</td>
                  <td><strong>{metrics.transfersOut}</strong></td>
                </tr>
                <tr>
                  <td>Assigned (-)</td>
                  <td><strong>{metrics.assigned}</strong></td>
                </tr>
                <tr>
                  <td>Expended (-)</td>
                  <td><strong>{metrics.expended}</strong></td>
                </tr>
                <tr style={{ borderTop: '2px solid #cbd5e1' }}>
                  <td><strong>Total Net Movement</strong></td>
                  <td><strong>{netMovement}</strong></td>
                </tr>
              </tbody>
            </table>
            <button className="primary-btn" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
