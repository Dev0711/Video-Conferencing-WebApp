import users from "../../assets/images/users.svg";
import chalkboard from "../../assets/images/chalkboard.svg";
import message_dots from "../../assets/images/message-dots.svg";
import useToggle from '../../Hooks/useToggle';

function Button(props) {

    const { option, imgsrc, handleSidebarOptionClick } = props


    return (
        <button onClick={() => handleSidebarOptionClick(option)} type="button" className="my-1 w-full p-1 flex gap-3 items-center rounded hover:bg-slate-300" role="menuitem">
            <img src={imgsrc} alt="" />
            <h4 className='text-black text-sm hidden md:block lg:block'>{option}</h4>
        </button>
    );
}

export default function MoreDropDown() {
    
    const { setToggleSidebarOption, handleToggleClick } = useToggle()

    const handleSidebarOptionClick = (option) => {
        if (option === 'people') {
            setToggleSidebarOption(true)
        }
        if (option === 'chat') {
            setToggleSidebarOption(false)
        }

        handleToggleClick('sidebar')
        handleToggleClick('dropdown')
    }

    return (
        <>
            <ul className="bg-[#ffffff] py-1 w-fit h-fit rounded px-1 lg:px-2 md:px-2" aria-hidden="true">
                <li className="more-menu-item">
                    <Button imgsrc={users} handleSidebarOptionClick={handleSidebarOptionClick} option='people' />
                </li>
                <hr className="border-1 border-gray-300" />
                <li className="more-menu-item">
                    <Button imgsrc={message_dots} handleSidebarOptionClick={handleSidebarOptionClick} option='chat' />
                </li>
                <hr className="border-1 border-gray-300" />
                <li className="more-menu-item">
                    {/* <Button imgsrc={chalkboard} option='whiteboard' setIsSideBar={setIsSideBar} /> */}
                    <button type="button" onClick={() => console.log('helo')} className="my-1 w-full p-1 flex gap-3 items-center rounded hover:bg-slate-300" role="menuitem">
                        <img src={chalkboard} alt="" />
                        <h4 className='text-black text-sm hidden md:block lg:block'>whiteboard</h4>
                    </button>
                </li>
            </ul>
        </>
    );
}
