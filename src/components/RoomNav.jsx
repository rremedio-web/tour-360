const RoomNav = ({ rooms }) => {
    return (
        <div className="room-nav">
            {rooms.map((room) => (
                <button key={room.id}>{room.name}</button>
            ))}
        </div>
    );
};

export default RoomNav;