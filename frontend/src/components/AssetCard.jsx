function AssetCard({ asset, onReport }) {
  const isVideo = asset.type === 'video';

  const BASE_URL = "https://assetguard-backend-dzfp.onrender.com";

  return (
    <div className="asset-card">
      <div className="media-container">
        {isVideo ? (
          <video
            src={`${BASE_URL}${asset.url}`}
            controls
            className="media-content"
          />
        ) : (
          <img
            src={`${BASE_URL}${asset.url}`}
            alt={asset.originalName}
            className="media-content"
            loading="lazy"
          />
        )}
      </div>

      <div className="card-body">
        <h3 className="asset-title" title={asset.originalName}>
          {asset.originalName}
        </h3>

        {asset.uploadDate && (
          <p className="asset-timestamp">
            {new Intl.DateTimeFormat('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            }).format(new Date(asset.uploadDate))}
          </p>
        )}

        <span className={`status-badge status-${asset.status.toLowerCase()}`}>
          Status: {asset.status}
        </span>

        <div className="card-footer">
          {asset.status === 'Safe' && (
            <button
              className="btn btn-danger"
              onClick={() => onReport(asset.id)}
            >
              Report Misuse
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AssetCard;