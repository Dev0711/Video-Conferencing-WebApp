import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useId } from 'react';
import { v4 as uuid4 } from 'uuid';
import axios from "../../../Api/axios";

export default function ProjectInvitaion() {
  const [numOfTeamMembers, setNumOfTeamMembers] = useState(1);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [teamLeader, setTeamLeader] = useState('');
  const navigate = useNavigate();

  const [selectedTeamMember, setSelectedTeamMember] = useState('');
  // const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [teamRole, setTeamRole] = useState('');

  // Function to handle adding a team member to the stack
  const handleAddTeamMember = () => {
    if (selectedTeamMember) {
      setSelectedTeamMembers((prevMembers) => [...prevMembers, selectedTeamMember]);
      setSelectedTeamMember('');
    }
  };

  // Function to handle removing a team member from the stack
  const handleRemoveTeamMember = (index) => {
    const newTeamMembers = [...selectedTeamMembers];
    newTeamMembers.splice(index, 1);
    setSelectedTeamMembers(newTeamMembers);
  };

  const handleNumOfTeamMembersChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setNumOfTeamMembers(count);
    // Ensure selectedTeamMembers and teamLeader are within the new count
    setSelectedTeamMembers((prevMembers) => prevMembers.slice(0, count));
    setTeamLeader((prevLeader) => (count < prevLeader ? '' : prevLeader));
  };

  const handleTeamMemberChange = (e, index) => {
    const newSelectedMembers = [...selectedTeamMembers];
    newSelectedMembers[index] = e.target.value;
    setSelectedTeamMembers(newSelectedMembers);
  };

  const handleTeamLeaderChange = (e) => {
    setTeamLeader(e.target.value);
  };

  const spacerStyle = {
    height: "2rem",
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const projectId = uuid4();

      axios.post('/project', () => {
        
      })

    } catch (error) {
      
    }

    toast.success("Form submitted Successfully");
    navigate('/');
  }

  return (
    <>
      {/* <HomeHeader /> */}
      <div style={spacerStyle} />


      <div className="invitation-form flex flex-col border gap-6 items-center mx-auto mb-10 w-fit px-10 pt-1 pb-5 rounded-xl bg-black/20">
        <h2 className="mt-2 font-sans">Create Project</h2>
        <form className="flex flex-col gap-8">
          {/* Section 1 */}
          <div className="form-section">
            <label>Project Name</label>
            <input type="text" placeholder="Enter project Name" className="w-full p-1 resize-none bg-blue-50 rounded-md text-[#010405]" required />
          </div>
          <div className="form-section">
            <label>Project Summary</label>
            <textarea placeholder="Enter project summary" className="w-full p-1 resize-none bg-blue-50 rounded-md text-[#010405]" required />
          </div>
          {/*   
            <div className="form-section">
              <label>Reason for Collaboration</label>
              <textarea placeholder="Enter your reason" required />
            </div> */}




          {/* <div className="form-section">
              <label>Domain of Project</label>
              <select style={{ width: "97%", marginLeft: "25px" }}>
                <option value="" disabled selected>--Select Project Domain--</option>
                <option value="blockchain">Blockchain</option>
                <option value="full-stack">Full Stack</option>
                <option value="machine-learning">Machine Learning</option>
                // Add more options as needed 
              </select>
            </div> */}



          <div className="flex gap-5">
            <div className="form-section">
              <label>Proposed Date for Initiation</label>
              <input type="date" required />
            </div>
            <div className="form-section">
              <label>Anticipated Date for Completion</label>
              <input type="date" required />
            </div>
          </div>
          {/* <div className="form-section">
              <label>Resources Requested</label>
              <select style={{ width: "97%", marginLeft: "25px" }}>
                <option value="" disabled selected>--Select Resources--</option>
                <option value="Supercomputers">Supercomputers</option>
                <option value="Simulation Labs">Simulation Labs</option>
                <option value="Turbine">Miniature Wind Turbine</option>
              </select>
            </div> */}
          {/* <div className="form-section">
              <label>Other Departments Involvement (if any)</label>
              <select style={{ width: "97%", marginLeft: "25px" }}>
                <option value="" disabled selected>--Select Department--</option>
                <option value="CE/IT">CE/IT</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
              </select>
            </div> */}
          {/* <div className="form-section">
              <label>CV</label>
              <input type="file" accept=".pdf, .doc, .docx" required />
            </div> */}

          {/* Section 2 */}
          {/* <div className="form-section">
              <label>Mentor Name</label>
              <select style={{ width: "97%", marginLeft: "25px" }} required>
                <option value="" disabled selected>--Select Name--</option>
                <option value="Name1">Name 1</option>
                <option value="Name2">Name 2</option>
                <option value="Name3">Name 3</option>
              </select>
            </div> */}
          {/* <div className="form-section">
              <label>Mentor Designation</label>
              <select style={{ width: "97%", marginLeft: "25px" }} required >
                <option value="" disabled selected>--Select Designation--</option>
                <option value="Designation1">Designation 1</option>
                <option value="Designation2">Designation 2</option>
                <option value="Designation13">Designation 3</option>
              </select>
            </div> */}
          {/* <div className="form-section">
              <label>Mentor Department</label>
              <select style={{ width: "97%", marginLeft: "25px" }} required >
                <option value="" disabled selected>--Select Department--</option>
                <option value="CE/IT">CE/IT</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
              </select>
            </div> */}


          {/* Section 3 */}
          <div className="form-section">
            <label>No. of Team Members</label>
            <input
              type="number"
              min="1"
              value={numOfTeamMembers}
              onChange={handleNumOfTeamMembersChange}
              required
            />
          </div>

          <div className="form-section">
            <label>Add Team Members</label>
            <select
              // style={{ width: '97%', marginLeft: '25px', display: 'flex', backgroundColor: 'white' }}
              className="w-full p-2 rounded-md ml-6 flex bg-white "
              value={selectedTeamMember}
              onChange={(e) => setSelectedTeamMember(e.target.value)}
            >
              <option value="" disabled>--Select Name--</option>
              <option value="Harsh Sonaiya">Harsh Sonaiya</option>
              <option value="Jaydeep Khandla">Jaydeep Khandla</option>
              <option value="Dev Oza">Dev Oza</option>
              <option value="Arun Kumar">Arun Kumar</option>
              <option value="Shaurabh Gandhi">Shaurabh Gandhi</option>
              <option value="Gaurav Tiwari">Gaurav Tiwari</option>
              {/* Add more options as needed */}
            </select>
            <button
              type="button"
              onClick={handleAddTeamMember}
              disabled={!selectedTeamMember}
              className=" px-5 py-2 rounded-md bg-blue-400"
            >
              Add
            </button>
          </div>

          <div className="form-section bg-blue-50 w-64 rounded-md  h-44 overflow-auto flex flex-col mx-auto" style={{ backgroundColor: "#fff", boxShadow: "0 4px 8px 0 rgba(169, 152, 130, 0.2), 0 6px 20px 0 rgba(122, 115, 89, 0", padding: "10px", paddingLeft: "0px !important", paddingBottom: "0px", display: "flex", gap: "20px" }} >
            <label className="text-black font-normal pb-2" >Selected Team Members</label>
            <div className="flex flex-wrap flex-col ">
              {selectedTeamMembers.map((member, index) => (
                <div key={index} className="selected-member flex gap-1 mx-3 pb-2">
                  <span className="text-blue-500">{`Member ${index + 1}: ${member}`}</span>
                  <button type="button" onClick={() => handleRemoveTeamMember(index)} className=" h-4 bg-tranparent text-blue-400">
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label>Team Leader</label>
            <select
              // style={{ width: '97%', marginLeft: '25px' }}
              className="w-full ml-6 p-2"
              value={teamLeader}
              onChange={handleTeamLeaderChange}
              required
            >
              {selectedTeamMembers.map((member, index) => (
                <option key={index} value={member}>
                  {member}
                </option>
              ))}
            </select>
          </div>
          {/* <div className="form-section">
              <label>PI/CoPI</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <label>
                  <input
                    type="radio"
                    value="PI"
                    checked={teamRole === 'PI'}
                    onChange={() => setTeamRole('PI')}
                    required
                  />
                  Req for PI
                </label>
                <label style={{ marginLeft: '20px' }}>
                  <input
                    type="radio"
                    value="CoPI"
                    checked={teamRole === 'CoPI'}
                    onChange={() => setTeamRole('CoPI')}
                    required
                  />
                  Req for CoPI
                </label>
              </div>
            </div> */}

          {/* Submit Button */}
          <div className="form-section">
            <button type="submit" className=" px-5 py-2 rounded-md bg-blue-400" onSubmit={() => handleSubmit()}>Submit</button>
          </div>
        </form>
      </div>
    </>
  );
}
