import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { NavLink } from "react-router-dom";
import React from 'react';

export default function SideBar() {

    const activeLink =
        "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2";
    const normalLink =
        "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 hover:bg-light-gray m-2";

    // Define static links with separate link name and link-to values
    const links = [
        {
            title: "Dashboard",
            links: [
                {
                    label: "Basic Info",
                    to: "",
                },
            ],
        },
        {
            title: "Utilities",
            links: [
                {
                    label: "kanban",
                    to: `kanban`,
                },
                {
                    label: "calendar",
                    to: `calendar`,
                },
                {
                    label: "gantt chart",
                    to: `gantt`,
                },
                {
                    label: "Chat",
                    to: `chat`,
                },

            ],
        },
    ];

    return (
        <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
            <div className="flex justify-between items-center">
                <span className="font-bold text-white">ZEPT</span>
                <TooltipComponent content="Menu" position="BottomCenter">
                    <button
                        type="button"
                        // onClick={() => setActiveMenu(!activeMenu)}
                        style={{ color: 'white' }}
                        className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
                    >
                    </button>
                </TooltipComponent>
            </div>
            <div className="mt-10">
                {links.map((item) => (
                    <div key={item.title}>
                        <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                            {item.title}
                        </p>
                        {item.links.map((link) => (
                            <NavLink
                                to={link.to}
                                key={link.label}
                                // onClick={handleCloseSideBar}
                                style={({ isActive }) => ({
                                    backgroundColor: isActive ? '#94a3b8' : "",
                                })}
                                className={({ isActive }) =>
                                    isActive ? activeLink : normalLink
                                }
                            >
                                <span className="capitalize">{link.label}</span>
                            </NavLink>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
