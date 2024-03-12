import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Home from "./Routes/Home/Home";
import Auth from "./Routes/Auth/Auth";
import RoomEntry from "./Routes/MeetingRoomEntry/MeetingRoomEntry";
import MeetingRoom from "./Routes/MeetingRoom/MeetingRoom";
import Layout from "./Components/Layout/Layout";
import RequireAuth from "./Components/RequireAuth/RequireAuth";
import PersistLogin from "./Components/PersistLogin/PersistLogin";
import { MediaProvider } from "./Context/MediaProvider";
import CvsRoute from "./Routes/CvsRoute/CvsRoute";
import ProjectInvitation from "./Routes/CvsRoute/ProjectInvitation/ProjectInvitaion";

function App() {
  return (
    <>
          <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/auth/*" element={<Auth />} />

          <Route element={<PersistLogin />}>
            <Route path="/" element={<Home />} />
            <Route element={<RequireAuth />}>
              <Route path="/joinroom" element={<RoomEntry />} />
              <Route
                path="/meeting/:meetingId"
                element={
                  <MediaProvider>
                    <MeetingRoom />
                  </MediaProvider>
                }
              />
              <Route path="/office/*" element={<CvsRoute />} />
              <Route path="/projectInvitaion" element={<ProjectInvitation />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
