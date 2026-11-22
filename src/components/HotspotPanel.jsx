const HotspotPanel = ({ currentHotspot, onClose }) => {
    return (
        <div className="hotspot-panel">
            <h2>{currentHotspot.title}</h2>
            <p>{currentHotspot.text}</p>
            <button aria-label="Close" className="hotspot-panel-close" onClick={() => onClose()}> x</button>
        </div >
    );
};

export default HotspotPanel;