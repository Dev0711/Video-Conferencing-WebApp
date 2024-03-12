import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../../Api/axios";
import emailValidator from 'email-validator';
import React, { useState, useEffect, useRef } from 'react';

export default function ProjectInvitaion() {
  const [projectName, setProjectName] = useState('');
  const [projcetSummary, setProjectSummary] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  // const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const selectedTeamMembersRef = useRef([])
  const [teamLeader, setTeamLeader] = useState('');
  //const [invitationLink, setInvitationLink] = useState('');
  const [selectedTeamMember, setSelectedTeamMember] = useState('');
  const navigate = useNavigate();

  // Function to handle adding a team member to the stack
  const isEmailValid = (email) => {
    return emailValidator.validate(email);
  };

  const handleAddTeamMember = () => {
    if (isEmailValid(selectedTeamMember)) {
      console.log(selectedTeamMember);
      // setSelectedTeamMembers((prevMembers) => [...prevMembers, selectedTeamMember]);
      // setSelectedTeamMembers((prevMembers) => {
      //   const updatedMembers = [...prevMembers, selectedTeamMember];
      //   return updatedMembers;
      // });
      selectedTeamMembersRef.current = [...selectedTeamMembersRef.current, selectedTeamMember]
      console.log(selectedTeamMembersRef.current);
      setSelectedTeamMember('');
    } else {
      // Display an error or provide feedback about invalid email
      console.error('Invalid email address');
    }
  };

  useEffect(() => {
    console.log('selectedTeam: ', selectedTeamMembersRef.current);
  }, [selectedTeamMembersRef.current]);


  // Function to handle removing a team member from the stack
  const handleRemoveTeamMember = (index) => {
    const newTeamMembers = [...selectedTeamMembersRef.current];
    newTeamMembers.splice(index, 1);
    selectedTeamMembersRef.current = newTeamMembers
    // setSelectedTeamMembers(newTeamMembers);
  };

  // const handleTeamMemberChange = (e, index) => {
  //   const newSelectedMembers = [...selectedTeamMembers];
  //   newSelectedMembers[index] = e.target.value;
  //   setSelectedTeamMembers(newSelectedMembers);
  // };

  const handleTeamLeaderChange = (e) => {
    setTeamLeader(e.target.value);
  };

  const spacerStyle = {
    height: "2rem",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        projectname: projectName,
        projectsummary: projcetSummary,
        startDate: startDate,
        endDate: endDate,
        teammembers: selectedTeamMembersRef.current,
        teamleader: teamLeader, // Assuming the first team member is the leader
      }
      const response = await axios.post("/create-project", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response)
    } catch (error) {

    }

    toast.success("Mail Sent Successfully");
    navigate('/');
  }

  return (
    <>
      {/* <HomeHeader /> */}
      <div style={spacerStyle} />


      <div className="invitation-form flex flex-col border gap-6 items-center mx-auto mb-10 w-fit px-10 pt-1 pb-5 rounded-xl bg-black/20">
        <h2 className="mt-2 font-sans">Create Project</h2>
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          {/* Section 1 */}
          <div className="form-section">
            <label>Project Name</label>
            <input value={projectName} type="text" placeholder="Enter project Name" className="w-full p-1 resize-none bg-blue-50 rounded-md text-[#010405]" onChange={(e) => setProjectName(e.target.value)} required />
          </div>
          <div className="form-section">
            <label>Project Summary</label>
            <textarea value={projcetSummary} placeholder="Enter project summary" className="w-full p-1 resize-none bg-blue-50 rounded-md text-[#010405]" onChange={(e) => setProjectSummary(e.target.value)} required />
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
              <input type="date" onChange={(e) => setStartDate(e.target.value)} required />
            </div>
            <div className="form-section">
              <label>Anticipated Date for Completion</label>
              <input type="date" onChange={(e) => setEndDate(e.target.value)} required />
            </div>
          </div>

          <div className="form-section">
            <label>Add Team Members (Email)</label>
            <div className="flex bg-white rounded-md ml-6">
              <input
                type="email"
                className="w-full p-2"
                value={selectedTeamMember}
                onChange={(e) => setSelectedTeamMember(e.target.value)}
                placeholder="Enter Team Member Email"

              />
              <button
                type="button"
                onClick={handleAddTeamMember}
                disabled={!isEmailValid(selectedTeamMember)}
                className="px-5 py-2 rounded-md bg-blue-400"
              >
                Add
              </button>
            </div>
          </div>

          <div className="form-section bg-blue-50 w-64 rounded-md  h-44 overflow-auto flex flex-col mx-auto" style={{ backgroundColor: "#fff", boxShadow: "0 4px 8px 0 rgba(169, 152, 130, 0.2), 0 6px 20px 0 rgba(122, 115, 89, 0", padding: "10px", paddingLeft: "0px !important", paddingBottom: "0px", display: "flex", gap: "20px" }} >
            <label className="text-black font-normal pb-2" >Selected Team Members</label>
            <div className="flex flex-wrap flex-col ">
              { selectedTeamMembersRef.current && selectedTeamMembersRef.current.map((member, index) => (
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
            <input
              // style={{ width: '97%', marginLeft: '25px' }}
              className="w-full ml-6 p-2"
              value={teamLeader}
              onChange={handleTeamLeaderChange}
              required
            >
            </input>
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
            <button type="submit" className=" px-5 py-2 rounded-md bg-blue-400" >Submit</button>
          </div>
        </form>
      </div>
    </>
  );
}
