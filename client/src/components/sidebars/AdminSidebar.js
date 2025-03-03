
import React, { memo, Fragment, useState } from 'react';
import logo from 'assets/img/logo.png';
import { adminSidebar } from 'utils/constant';
import { NavLink, Link } from 'react-router-dom';
import clsx from 'clsx';
import { AiOutlineCaretDown, AiOutlineCaretRight } from 'react-icons/ai';

const activedStyle =
    'px-4 py-3 flex items-center gap-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-md';
const notActivedStyle =
    'px-4 py-3 flex items-center gap-3 text-gray-600 hover:text-red-500 hover:bg-gray-200 rounded-lg transition-colors duration-300';

const AdminSidebar = () => {
    const [actived, setActived] = useState([]);
    const handleShowTabs = (tabID) => {
        if (actived.includes(tabID)) {
            setActived((prev) => prev.filter((id) => id !== tabID));
        } else {
            setActived((prev) => [...prev, tabID]);
        }
    };

    return (
        <div className="h-full bg-gradient-to-b from-gray-100 to-gray-50 shadow-xl ">
            {/* Logo */}
            <Link to={'/'} className="flex flex-col items-center gap-3 py-6">
                <img src={logo} alt="logo" className="w-[150px] object-contain" />
                <small className="text-gray-500 text-sm">Admin Workspace</small>
            </Link>

            {/* Scrollable Sidebar */}
            <div className="overflow-y-auto h-[calc(100vh-120px)] px-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                {adminSidebar.map((element) => (
                    <Fragment key={element.id}>
                        {/* Single menu item */}
                        {element.type === 'SINGLE' && (
                            <NavLink
                                to={element.path}
                                className={({ isActive }) =>
                                    clsx(isActive ? activedStyle : notActivedStyle)
                                }
                            >
                                <span className="text-lg">{element.icon}</span>
                                <span className="text-sm font-medium">{element.text}</span>
                            </NavLink>
                        )}

                        {/* Parent menu item with submenu */}
                        {element.type === 'PARENT' && (
                            <div className="flex flex-col space-y-1">
                                {/* Parent menu */}
                                <div
                                    onClick={() => handleShowTabs(element.id)}
                                    className={clsx(
                                        'flex items-center justify-between gap-2 px-4 py-3 cursor-pointer text-gray-600 hover:text-red-500 hover:bg-gray-200 rounded-lg transition-colors duration-300',
                                        actived.includes(element.id) && 'bg-gray-200'
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">{element.icon}</span>
                                        <span className="text-sm font-medium">{element.text}</span>
                                    </div>
                                    {actived.includes(element.id) ? (
                                        <AiOutlineCaretDown />
                                    ) : (
                                        <AiOutlineCaretRight />
                                    )}
                                </div>

                                {/* Submenu */}
                                {actived.includes(element.id) && (
                                    <div className="flex flex-col pl-6 border-l-2 border-red-500">
                                        {element.submenu.map((item) => (
                                            <NavLink
                                                key={item.text}
                                                to={item.path}
                                                className={({ isActive }) =>
                                                    clsx(
                                                        isActive
                                                            ? `${activedStyle} pl-6`
                                                            : `${notActivedStyle} pl-6`
                                                    )
                                                }
                                            >
                                                <span className="text-sm">{item.icon}</span>
                                                <span className="text-sm font-medium">{item.text}</span>
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </Fragment>
                ))}
            </div>
        </div>
    );
};

export default memo(AdminSidebar);
