// import React, { memo, Fragment, useState } from 'react';
// import logo from 'assets/img/logo.png';
// import { adminSidebar } from 'utils/constant';
// import { NavLink, Link } from 'react-router-dom';
// import clsx from 'clsx';
// import { AiOutlineCaretDown, AiOutlineCaretRight } from 'react-icons/ai';

// const activedStyle = 'px-4 py-2 flex items-center gap-2 bg-main text-white transition-colors duration-200 ease-in-out';
// const notActivedStyle =
//     'px-4 py-2 flex items-center gap-2 hover:bg-gray-300 transition-colors duration-200 ease-in-out';

// const AdminSidebar = () => {
//     const [actived, setActived] = useState([]);
//     const handleShowTabs = (tabID) => {
//         if (actived.some((element) => element === tabID)) {
//             setActived((prev) => prev.filter((element) => element !== tabID));
//         } else setActived((prev) => [...prev, tabID]);
//     };

//     return (
//         <div className="py-4  h-full bg-gray-50 shadow-lg">
//             <Link to={'/'} className="flex flex-col p-4 gap-2 items-center justify-center">
//                 <img src={logo} alt="logo" className="w-[200px] object-contain"></img>
//                 <small>Admin Workspace</small>
//             </Link>
//             <div>
//                 {adminSidebar.map((element) => (
//                     <Fragment key={element.id}>
//                         {element.type === 'SINGLE' && (
//                             <NavLink
//                                 to={element.path}
//                                 className={({ isActive }) =>
//                                     clsx(isActive && activedStyle, !isActive && notActivedStyle)
//                                 }
//                             >
//                                 <span>{element.icon}</span>
//                                 <span>{element.text}</span>
//                             </NavLink>
//                         )}
//                         {element.type === 'PARENT' && (
//                             <div onClick={() => handleShowTabs(+element.id)} className=" flex flex-col">
//                                 <div className="flex items-center justify-between cursor-pointer gap-2 px-4 py-2 hover:bg-gray-300">
//                                     <div className="flex items-center gap-2">
//                                         <span>{element.icon}</span>
//                                         <span>{element.text}</span>
//                                     </div>
//                                     {actived.some((id) => id === element.id) ? (
//                                         <AiOutlineCaretRight></AiOutlineCaretRight>
//                                     ) : (
//                                         <AiOutlineCaretDown></AiOutlineCaretDown>
//                                     )}
//                                 </div>
//                                 {actived.some((id) => +id === +element.id) && (
//                                     <div className="flex flex-col ">
//                                         {element.submenu.map((item) => (
//                                             <NavLink
//                                                 key={element.text}
//                                                 to={item.path}
//                                                 onClick={(e) => e.stopPropagation()}
//                                                 className={({ isActive }) =>
//                                                     clsx(
//                                                         isActive && activedStyle,
//                                                         !isActive && notActivedStyle,
//                                                         'pl-10',
//                                                     )
//                                                 }
//                                             >
//                                                 <span>{item.icon}</span>
//                                                 <span>{item.text}</span>
//                                             </NavLink>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </Fragment>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default memo(AdminSidebar);
// import React, { memo, Fragment, useState } from 'react';
// import logo from 'assets/img/logo.png';
// import { adminSidebar } from 'utils/constant';
// import { NavLink, Link } from 'react-router-dom';
// import clsx from 'clsx';
// import { AiOutlineCaretDown, AiOutlineCaretRight } from 'react-icons/ai';

// const activedStyle =
//     'flex items-center gap-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-lg px-4 py-3 transition-all duration-300 transform hover:scale-105';
// const notActivedStyle =
//     'flex items-center gap-3 text-gray-700 hover:text-red-500 hover:bg-gray-100 rounded-lg px-4 py-3 transition-all duration-300';

// const AdminSidebar = () => {
//     const [actived, setActived] = useState([]);
//     const handleShowTabs = (tabID) => {
//         if (actived.includes(tabID)) {
//             setActived((prev) => prev.filter((id) => id !== tabID));
//         } else {
//             setActived((prev) => [...prev, tabID]);
//         }
//     };

//     return (
//         <div className="h-full bg-gradient-to-b from-gray-50 to-gray-100 shadow-xl rounded-lg overflow-hidden">
//             {/* Logo */}
//             <Link to={'/'} className="flex flex-col items-center gap-3 py-6">
//                 <img src={logo} alt="logo" className="w-[120px] object-contain shadow-md rounded-full" />
//                 <small className="text-gray-500 text-sm font-semibold">Admin Workspace</small>
//             </Link>

//             {/* Scrollable Sidebar */}
//             <div className="overflow-y-auto h-[calc(100vh-120px)] px-4 space-y-2 scrollbar-thin scrollbar-thumb-red-400 scrollbar-track-gray-200">
//                 {adminSidebar.map((element) => (
//                     <Fragment key={element.id}>
//                         {/* Single menu item */}
//                         {element.type === 'SINGLE' && (
//                             <NavLink
//                                 to={element.path}
//                                 className={({ isActive }) => clsx(isActive ? activedStyle : notActivedStyle)}
//                             >
//                                 <span className="text-lg">{element.icon}</span>
//                                 <span className="text-sm font-medium">{element.text}</span>
//                             </NavLink>
//                         )}

//                         {/* Parent menu item with submenu */}
//                         {element.type === 'PARENT' && (
//                             <div className="flex flex-col">
//                                 {/* Parent menu */}
//                                 <div
//                                     onClick={() => handleShowTabs(element.id)}
//                                     className={clsx(
//                                         'flex items-center justify-between gap-2 px-4 py-3 cursor-pointer text-gray-700 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-all duration-300',
//                                         actived.includes(element.id) && 'bg-gray-100 shadow-md',
//                                     )}
//                                 >
//                                     <div className="flex items-center gap-3">
//                                         <span className="text-lg">{element.icon}</span>
//                                         <span className="text-sm font-medium">{element.text}</span>
//                                     </div>
//                                     {actived.includes(element.id) ? (
//                                         <AiOutlineCaretDown className="transition-transform transform rotate-180" />
//                                     ) : (
//                                         <AiOutlineCaretRight />
//                                     )}
//                                 </div>

//                                 {/* Submenu */}
//                                 <div
//                                     className={clsx(
//                                         'overflow-hidden transition-all duration-300 pl-6',
//                                         actived.includes(element.id) ? 'max-h-[1000px]' : 'max-h-0',
//                                     )}
//                                 >
//                                     {element.submenu.map((item) => (
//                                         <NavLink
//                                             key={item.text}
//                                             to={item.path}
//                                             className={({ isActive }) =>
//                                                 clsx(
//                                                     isActive
//                                                         ? `flex items-center gap-3 bg-red-100 text-red-600 pl-8 py-2 rounded-md border-l-4 border-red-500`
//                                                         : `flex items-center gap-3 text-gray-700 hover:text-red-500 pl-8 py-2 transition-all duration-300`,
//                                                 )
//                                             }
//                                         >
//                                             <span className="text-sm">{item.icon}</span>
//                                             <span className="text-sm font-medium">{item.text}</span>
//                                         </NavLink>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}
//                     </Fragment>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default memo(AdminSidebar);

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
        <div className="h-full bg-gradient-to-b from-gray-100 to-gray-50 shadow-xl rounded-lg">
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
