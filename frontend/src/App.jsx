import { useState, useEffect } from 'react';
import './index.css';
import UploadForm from './components/UploadForm';
import AssetGrid from './components/AssetGrid';

function App() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssets = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/assets');
      const data = await response.json();
      setAssets(data);
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleUploadSuccess = (newAsset) => {
    setAssets((prev) => [...prev, newAsset]);
  };

  const handleReport = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/assets/${id}/report`, {
        method: 'PATCH',
      });
      if (response.ok) {
        setAssets((prev) =>
          prev.map((asset) => (asset.id === id ? { ...asset, status: 'Reported' } : asset))
        );
      }
    } catch (error) {
      console.error('Error reporting asset:', error);
    }
  };

  const [filter, setFilter] = useState('All');

  const filteredAssets = assets.filter(
    (asset) => filter === 'All' || asset.status === filter
  );

  return (
    <div className="app-container">
      <header>
        <h1>Digital Asset Protection</h1>
        <p className="subtitle">Securely store and manage your digital assets</p>
      </header>

      <main>
        <UploadForm onUploadSuccess={handleUploadSuccess} />
        
        <div className="filter-container">
          <button 
            className={`filter-btn ${filter === 'All' ? 'active' : ''}`} 
            onClick={() => setFilter('All')}
          >
            Show All
          </button>
          <button 
            className={`filter-btn ${filter === 'Safe' ? 'active' : ''}`} 
            onClick={() => setFilter('Safe')}
          >
            Show Safe
          </button>
          <button 
            className={`filter-btn ${filter === 'Reported' ? 'active' : ''}`} 
            onClick={() => setFilter('Reported')}
          >
            Show Reported
          </button>
        </div>

        {loading ? (
          <div className="empty-state">Loading assets...</div>
        ) : (
          <AssetGrid assets={filteredAssets} onReport={handleReport} />
        )}
      </main>
    </div>
  );
}

export default App;
