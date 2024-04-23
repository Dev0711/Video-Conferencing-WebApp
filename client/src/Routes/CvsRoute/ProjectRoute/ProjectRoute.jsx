import { Route, Routes, useLocation } from 'react-router-dom';
import CvsDashBoard from '../CvsDashboard/CvsDashBoard';
import CvsKanban from '../CvsKanban/CvsKanban';
import CvsGantt from '../CvsGantt/CvsGantt';
import CvsCalendar from '../CvsCalendar/CvsCalendar';
import CvsChat from '../CvsChat/CvsChat';
import SideBar from '../SideBar/SideBar';

export default function ProjectRoute() {

  const location = useLocation();
  const project = location.state?.project;
  // console.log(project)

  // console.log(`project -> ${project}`);

  return (
    <section className='flex gap-5 w-fit'>
      <div className=' w-64 bg-black/20 px-5 py-5 flex flex-col justify-center'>
        <SideBar />
      </div>
      <Routes>
        <Route path='/' element={<CvsDashBoard project={project} />} />
        <Route path='kanban' element={<CvsKanban />} />
        <Route path='gantt' element={<CvsGantt />} />
        <Route path='calendar' element={<CvsCalendar />} />
        <Route path='chat' element={<CvsChat />} />
      </Routes>
    </section>
  );
}