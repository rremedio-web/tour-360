const RoomNav = ({ rooms, onChangeRoom }) => {
    return (
        <div className="room-nav">
            {rooms.map((room) => (
                <button key={room.id} onClick={() => onChangeRoom(room.id)}>{room.name}</button>
            ))}
        </div>
    );
};

export default RoomNav;