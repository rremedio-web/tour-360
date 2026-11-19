const HotspotList = ({ hotspots, onChangeRoom }) => {
    return (
        <ul className="hotspot-nav">
            {hotspots.map((hotspot) => (
                <li key={hotspot.id}><button onClick={() => onChangeRoom(hotspot.id)}>{hotspot.title}</button></li>
            ))}
        </ul>
    );
};

export default HotspotList;