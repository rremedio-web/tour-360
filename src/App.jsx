import { rooms } from "./data/rooms"
import RoomNav from "./components/RoomNav"
import HotspotList from "./components/HotspotList"
import HotspotPanel from "./components/HotspotPanel"
import PanoramaViewer from "./components/PanoramaViewer"
import { useState, useRef, useCallback } from "react"


function App() {
  const [roomId, setRoomId] = useState("lounge")
  const [hotspotId, setHotspotId] = useState(null)
  const focusRef = useRef(null)

  const currentRoom = rooms.find((room) => room.id === roomId)
  const currentHotspot = currentRoom.hotspots.find((hotspot) => hotspot.id === hotspotId)

  const changeRoom = useCallback((id) => {
    setRoomId(id)
    setHotspotId(null)
  }, [])

  const openHotspot = useCallback((id, targetRoomId, event) => {
    if (currentRoom.hotspots.find((hotspot) => hotspot.id === id).type === "info") {
      setHotspotId(id)
      focusRef.current = event.currentTarget

    } else {
      changeRoom(targetRoomId)
    }
  }, [changeRoom, currentRoom])

  function closeHotspot() {
    setHotspotId(null)
    focusRef.current?.focus()
  }

  return (
    <>
      <h1>{currentRoom.name}</h1>
      <RoomNav rooms={rooms} onChangeRoom={changeRoom} />
      <HotspotList hotspots={currentRoom.hotspots} onChangeHotspot={openHotspot} />
      {hotspotId && <HotspotPanel currentHotspot={currentHotspot} onClose={closeHotspot} />}
      <PanoramaViewer image={currentRoom.image} hotspots={currentRoom.hotspots} onHotspotClick={openHotspot} />
    </>)
}

export default App
