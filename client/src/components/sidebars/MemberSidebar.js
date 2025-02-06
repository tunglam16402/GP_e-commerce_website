import React, { memo, Fragment, useState } from 'react';
import { memberSidebar } from 'utils/constant';
import { NavLink, Link } from 'react-router-dom';
import clsx from 'clsx';
import { AiOutlineCaretDown, AiOutlineCaretRight } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import avatarDefault from 'assets/img/avt_default.png';

const activedStyle = 'px-4 py-2 flex items-center gap-2 bg-main text-white transition-colors duration-200 ease-in-out';
const notActivedStyle =
    'px-4 py-2 flex items-center gap-2 hover:bg-gray-300 transition-colors duration-200 ease-in-out';

const MemberSidebar = () => {
    const [actived, setActived] = useState([]);
    const { current } = useSelector((state) => state.user);
    const handleShowTabs = (tabID) => {
        if (actived.some((element) => element === tabID)) {
            setActived((prev) => prev.filter((element) => element !== tabID));
        } else setActived((prev) => [...prev, tabID]);
    };

    return (
        // <div className="py-4  h-full bg-white shadow-lg">
        //     <div className="w-full flex flex-col items-center py-4 gap-4">
        //         <img src={current?.avatar || avatarDefault} alt="logo" className="w-16 h-16 object-cover  "></img>
        //         <small>{`${current?.lastname} ${current?.firstname}`}</small>
        //     </div>
        //     <div>
        //         {memberSidebar.map((element) => (
        //             <Fragment key={element.id}>
        //                 {element.type === 'SINGLE' && (
        //                     <NavLink
        //                         to={element.path}
        //                         className={({ isActive }) =>
        //                             clsx(isActive && activedStyle, !isActive && notActivedStyle)
        //                         }
        //                     >
        //                         <span>{element.icon}</span>
        //                         <span>{element.text}</span>
        //                     </NavLink>
        //                 )}
        //                 {element.type === 'PARENT' && (
        //                     <div onClick={() => handleShowTabs(+element.id)} className=" flex flex-col">
        //                         <div className="flex items-center justify-between cursor-pointer gap-2 px-4 py-2 rounded-md  hover:bg-gray-300 transition-colors duration-200 ease-in-out">
        //                             <div className="flex items-center gap-2">
        //                                 <span>{element.icon}</span>
        //                                 <span>{element.text}</span>
        //                             </div>
        //                             {actived.some((id) => id === element.id) ? (
        //                                 <AiOutlineCaretRight></AiOutlineCaretRight>
        //                             ) : (
        //                                 <AiOutlineCaretDown></AiOutlineCaretDown>
        //                             )}
        //                         </div>
        //                         {actived.some((id) => +id === +element.id) && (
        //                             <div className="flex flex-col ">
        //                                 {element.submenu.map((item) => (
        //                                     <NavLink
        //                                         key={element.text}
        //                                         to={item.path}
        //                                         onClick={(e) => e.stopPropagation()}
        //                                         className={({ isActive }) =>
        //                                             clsx(
        //                                                 isActive && activedStyle,
        //                                                 !isActive && notActivedStyle,
        //                                                 'pl-10',
        //                                             )
        //                                         }
        //                                     >
        //                                         <span>{item.icon}</span>
        //                                         <span>{item.text}</span>
        //                                     </NavLink>
        //                                 ))}
        //                             </div>
        //                         )}
        //                     </div>
        //                 )}
        //             </Fragment>
        //         ))}
        //     </div>
        // </div>
        <div className="py-6 h-full bg-gradient-to-b from-gray-50 to-gray-200 shadow-xl flex flex-col">
            {/* Avatar và tên người dùng */}
            <div className="w-full flex flex-col items-center py-6 gap-3">
                <img
                    src={current?.avatar || avatarDefault}
                    alt="User Avatar"
                    className="w-20 h-20 rounded-full border-4 border-gray-300 shadow-md"
                />
                <small className="font-semibold text-gray-800 text-lg">{`${current?.lastname} ${current?.firstname}`}</small>
            </div>

            {/* Sidebar menu */}
            <div className="flex-1 overflow-y-auto px-4">
                {memberSidebar.map((element) => (
                    <Fragment key={element.id}>
                        {/* Menu dạng SINGLE */}
                        {element.type === 'SINGLE' && (
                            <NavLink
                                to={element.path}
                                className={({ isActive }) =>
                                    clsx(
                                        'flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700',
                                        isActive
                                            ? 'bg-red-500 text-white shadow-lg'
                                            : 'hover:bg-gray-300 hover:text-gray-900 transition-colors duration-300',
                                    )
                                }
                            >
                                <span className="text-xl">{element.icon}</span>
                                <span>{element.text}</span>
                            </NavLink>
                        )}

                        {/* Menu dạng PARENT */}
                        {element.type === 'PARENT' && (
                            <div className="flex flex-col">
                                <div
                                    onClick={() => handleShowTabs(+element.id)}
                                    className="flex items-center justify-between cursor-pointer gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-300 hover:text-gray-900 transition-colors duration-300"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{element.icon}</span>
                                        <span>{element.text}</span>
                                    </div>
                                    {actived.some((id) => id === element.id) ? (
                                        <AiOutlineCaretDown className="text-gray-500" />
                                    ) : (
                                        <AiOutlineCaretRight className="text-gray-500" />
                                    )}
                                </div>
                                {/* Submenu */}
                                {actived.some((id) => +id === +element.id) && (
                                    <div className="ml-6 flex flex-col gap-2">
                                        {element.submenu.map((item) => (
                                            <NavLink
                                                key={item.text}
                                                to={item.path}
                                                onClick={(e) => e.stopPropagation()}
                                                className={({ isActive }) =>
                                                    clsx(
                                                        'flex items-center gap-3 px-3 py-2 rounded-md text-gray-600',
                                                        isActive
                                                            ? 'bg-red-400 text-white shadow-md'
                                                            : 'hover:bg-gray-200 hover:text-gray-800 transition-all duration-300',
                                                    )
                                                }
                                            >
                                                <span>{item.icon}</span>
                                                <span>{item.text}</span>
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </Fragment>
                ))}
            </div>

            {/* Footer */}
            <footer className="mt-auto py-4 text-center text-sm text-gray-600">
                © {new Date().getFullYear()} Your Company
            </footer>
        </div>
    );
};

export default memo(MemberSidebar);
