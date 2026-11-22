const HotspotList = ({ hotspots, onChangeHotspot }) => {
    return (
        <ul className="hotspot-nav">
            {hotspots.map((hotspot) => (
                <li key={hotspot.id}><button onClick={() => onChangeHotspot(hotspot.id)}>{hotspot.title}</button></li>
            ))}
        </ul>
    );
};

export default HotspotList;