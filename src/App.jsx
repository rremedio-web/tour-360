import { rooms } from "./data/rooms"
import RoomNav from "./components/RoomNav"
import HotspotList from "./components/HotspotList"
import { useState } from "react"

function App() {
  const [roomId, setRoomId] = useState("lounge")

  function changeRoom(id) {
    setRoomId(id)
  }
  const currentRoom = rooms.find((room) => room.id === roomId)
  return (
    <>
      <h1>{currentRoom.name}</h1>
      <img src={currentRoom.image} alt={currentRoom.name} />
      <RoomNav rooms={rooms} onChangeRoom={changeRoom} />
      <HotspotList hotspots={currentRoom.hotspots} onChangeRoom={changeRoom} />
    </>)
}

export default App
