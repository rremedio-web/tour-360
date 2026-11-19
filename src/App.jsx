import { rooms } from "./data/rooms"

function App() {
  return (
    <>
      <h1>{rooms[0].name}</h1>
      <img src={rooms[0].image} alt={rooms[0].name} />
    </>)
}

export default App
