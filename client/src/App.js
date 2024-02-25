import { Routes, Route } from "react-router-dom";
import Home from "./Routes/Home/Home";
import Auth from "./Routes/Auth/Auth";
import RoomEntry from "./Routes/MeetingRoomEntry/MeetingRoomEntry";
import MeetingRoom from "./Routes/MeetingRoom/MeetingRoom";
import "./App.css";
import Layout from "./Components/Layout/Layout";
import RequireAuth from "./Components/RequireAuth/RequireAuth";
import PersistLogin from "./Components/PersistLogin/PersistLogin";
import { MediaProvider } from "./Context/MediaProvider";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/auth/*" element={<Auth />} />

          <Route element={<PersistLogin />}>
            <Route path="/" element={<Home />} />
            <Route element={<RequireAuth />}>
              <Route path="/joinroom" element={<RoomEntry />} />
            </Route>
              <Route
                path="/meeting/:meetingId"
                element={
                  <MediaProvider>
                    <MeetingRoom />
                  </MediaProvider>
                }
              />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
