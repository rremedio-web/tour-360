import { rooms } from "./data/rooms"
import RoomNav from "./components/RoomNav"
import HotspotList from "./components/HotspotList"
import HotspotPanel from "./components/HotspotPanel"
import { useState } from "react"

function App() {
  const [roomId, setRoomId] = useState("lounge")
  const [hotspotId, setHotspotId] = useState(null)

  function changeRoom(id) {
    setRoomId(id)
    setHotspotId(null)
  }
  function openHotspot(id, targetRoomId) {
    if (currentRoom.hotspots.find((hotspot) => hotspot.id === id).type === "info") {
      setHotspotId(id)
    } else {
      changeRoom(targetRoomId)
    }
  }
  function closeHotspot() {
    setHotspotId(null)
  }
  const currentRoom = rooms.find((room) => room.id === roomId)
  const currentHotspot = currentRoom.hotspots.find((hotspot) => hotspot.id === hotspotId)
  return (
    <>
      <h1>{currentRoom.name}</h1>
      <img src={currentRoom.image} alt={currentRoom.name} />
      <RoomNav rooms={rooms} onChangeRoom={changeRoom} />
      <HotspotList hotspots={currentRoom.hotspots} onChangeHotspot={openHotspot} />
      {hotspotId && <HotspotPanel currentHotspot={currentHotspot} onClose={closeHotspot} />}
    </>)
}

export default App
