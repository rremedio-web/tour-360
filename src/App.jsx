import { rooms } from "./data/rooms"
import RoomNav from "./components/RoomNav"

function App() {
  return (
    <>
      <h1>{rooms[0].name}</h1>
      <img src={rooms[0].image} alt={rooms[0].name} />
      <RoomNav rooms={rooms} />
    </>)
}

export default App
