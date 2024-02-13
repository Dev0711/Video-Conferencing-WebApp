import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './Routes/Home/Home';
import Auth from './Routes/Auth/Auth';
import RoomEntry from "./Routes/MeetingRoomEntry/MeetingRoomEntry";
import Room from "./Routes/MeetingRoom/MeetingRoom";
import './App.css';

function App() {
  const id = 1;
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path="/" element = {<Home />} />
            <Route path="/auth/*" element = {<Auth />} />
            <Route path="/joinroom" element = {<RoomEntry />} />
            <Route path={`/room/${id}`} element = {<Room />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
