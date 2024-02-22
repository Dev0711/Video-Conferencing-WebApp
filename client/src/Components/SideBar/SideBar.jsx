import x from '../../assets/images/x.svg';
import send from '../../assets/images/send.svg';
import  file_upload from '../../assets/images/file-upload.svg';
import copy from '../../assets/images/copy.svg'
import useToggle from '../../Hooks/useToggle';

function People() {
    const link = window.location.href;

    const copyLink = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(link);
    }


    return (
        <>
            <section className="copy-link">
                <h5 className='text-black my-1'>Invite people with this link</h5>
                <div className='flex gap-2 my-1 mx-px p-1 bg-slate-200 rounded'>
                    <input type="text" value={link} className='outline-none border-none focus:outline-none text-black p-1' readonly />
                    <img src={copy} className='cursor-pointer border-l-2 border-white px-2' onClick={copyLink} alt="" />
                </div>
            </section>
            <hr className="border-1 border-gray-300" />
            <section className="people-container overflow-auto  h-full my-1 w-full">
                
            </section>
        </>
    )
}

function Chat() {

    return (
        <>
            <section className="chat-container flex flex-col  h-full my-1 w-full">
                <div className='h-full overflow-auto'>

                </div>
                <hr className="border-1 border-gray-300" />
                <div className='flex gap-2 my-1 mx-px p-1 bg-slate-200 rounded'>
                    <input type="text" className='outline-none border-none focus:outline-none text-black p-1' />
                    <img src={file_upload} className='cursor-pointer -mx-1' alt="" />
                    <img src={send} className='cursor-pointer border-l-2 border-white px-1' alt="" />
                </div>
            </section>
        </>
    )
}

export default function SideBar() {

    const { handleToggleClick, toggleSidebarOption, setToggleSidebarOption } = useToggle();

    return (
        <>
            <div className="sidebar-container bg-white text-center h-[88%] w-fit px-5 pb-1 m-4 flex flex-col items-center rounded float-end z-50">
                <div className="heading w-full flex flex-row gap-2 justify-end my-2">
                    <h4 className={`text-black text-center basis-1/2 ${toggleSidebarOption ? 'bg-slate-200' : ''} rounded cursor-pointer`} onClick={() => setToggleSidebarOption(true)} >People</h4>
                    <h4 className={`text-black text-center basis-1/2 ${!toggleSidebarOption ? 'bg-slate-200' : ''} rounded cursor-pointer`} onClick={() => setToggleSidebarOption(false)}>Chat</h4>
                    <img src={x} onClick={() => handleToggleClick('sidebar')} className='cursor-pointer' alt="" />
                </div>
                {toggleSidebarOption && <People />}
                {!toggleSidebarOption && <Chat />}
            </div>
        </>
    );
}
