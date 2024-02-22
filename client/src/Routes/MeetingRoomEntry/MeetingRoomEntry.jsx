import { useState } from "react";
import { v4 as uuidV4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

export default function Room() {

  const navigate = useNavigate();
  const [urlInput, setUrlInput] = useState('');
  // const [meetingId, setMeetingId] = useState('');

  const handleJoinMeeting = (type) => {
  
    const match = urlInput.match(/\/meeting\/([^\/]+)/);
      // const meetingId = match ? match[1] : null;
    const meetingId = match ? match[1] : null

    navigate(`/meeting/${meetingId}`)
  }

  const handleCreateMeeting = () => {
    const meetingId = uuidV4()

    navigate(`/meeting/${meetingId}`, {
      state: meetingId
    })
  }

  return (
    <>
      <div className="room-container">
        <form
          className="flex flex-col items-center gap-5"
        >
          <h2>JOIN MEETING</h2>
          <div className="input-container">
            <input type="text" name="" placeholder="Meeting id" onChange={(e) => setUrlInput((prev) => prev = e.target.value)} />
          </div>
          <div className="btn__container">
            <button className="btn join__btn w-full" onClick={handleJoinMeeting}> Join Meeting </button>
          </div>
          <h4>
            Don't have a meeting Id?{" "}
            <span className="cursor-pointer text-blue-400" onClick={handleCreateMeeting}>create</span>
          </h4>
        </form>
      </div>
    </>
  );
}
