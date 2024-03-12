import React, { useState } from 'react';
import NavBar from '../../Components/NavBar/NavBar';
import { Route, Routes, useNavigate } from 'react-router-dom';
import CvsDashBoard from './CvsDashboard/CvsDashBoard';
import CvsKanban from './CvsKanban/CvsKanban';
import CvsGantt from './CvsGantt/CvsGantt';
import CvsCalendar from './CvsCalendar/CvsCalendar';
import CvsChat from './CvsChat/CvsChat';
import SideBar from './SideBar/SideBar';

export function Project({ projects }) {
  const navigate = useNavigate();
  return (
    <>
      <section className=' flex flex-col gap-2 justify-center h-auto m-4 px-3 py-2 rounded-md bg-white w-fit mx-auto'>
        {
          projects.map((project, index) => (
            <div
              key={index}
              style={{ backgroundColor: project.bgColor }}
              className=' cursor-pointer relative text-white h-52 w-[39rem] rounded-md p-2'
              onClick={() => navigate(`/office/${project.id}/`, {
                state: project.id,
              })}
            >
              {project.name}
              <span className=' absolute bottom-0 right-2'>{project.author}</span>
            </div>
          ))
        }
      </section>
      <button title='Create Invitaion for New project' className=' absolute bottom-10 right-10 py-3 px-4 bg-white text-black font-bold text-xl rounded-[50%]' onClick={() => navigate("/projectInvitaion")} > + </button>
    </>
  );
}

export function ProjectRoute() {
  return (
    <section className='flex gap-5 w-fit'>
      <div className=' w-64 bg-black/20 px-5 py-5 flex flex-col justify-center'>
        <SideBar />
      </div>
      <Routes>
        <Route path='/' element={<CvsDashBoard />} />
        <Route path='kanban' element={<CvsKanban />} />
        <Route path='gantt' element={<CvsGantt />} />
        <Route path='calendar' element={<CvsCalendar />} />
        <Route path='chat' element={<CvsChat />} />
      </Routes>
    </section>
  );
}


export default function CvsRoute() {

  const [projects, setProject] = useState([
    {
      id: 1,
      name: 'VideoCall Application',
      bgColor: '#fcba03',
      author: 'Jaydeep Khandla',
    },
    {
      id: 2,
      name: 'Project-V',
      bgColor: '#018c8a',
      author: 'Dev Oza',
    },
    {
      id: 3,
      name: 'Doordarshan',
      bgColor: '#82d102',
      author: 'Harsh Sonaiya',
    },
  ]);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={<Project projects={projects} />} />
        <Route path='/:id/*' element={<ProjectRoute />} />
      </Routes>
    </>
  );
}
