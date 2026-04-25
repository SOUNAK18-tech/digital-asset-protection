import AssetCard from './AssetCard';

function AssetGrid({ assets, onReport }) {
  if (!assets || assets.length === 0) {
    return (
      <div className="empty-state">
        <p>No assets uploaded yet. Upload your first digital asset above!</p>
      </div>
    );
  }

  return (
    <div className="asset-grid">
      {assets.map((asset) => (
        <AssetCard key={asset.id} asset={asset} onReport={onReport} />
      ))}
    </div>
  );
}

export default AssetGrid;
