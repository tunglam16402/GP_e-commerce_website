import React, { memo } from 'react';
import { navigation } from 'utils/constant';
import { NavLink } from 'react-router-dom';

const notActivedStyle = '';
const activedStyle = '';

const Navigation = () => {
    return (
        <div className="w-main h-12 py-2 border-y mb-6 flex items-center bg-white">
            {navigation.map((element) => (
                <NavLink
                    to={element.path}
                    key={element.id}
                    className={({ isActive }) =>
                        `px-4 py-2 transition-colors duration-200 font-semibold flex items-center gap-2 text-[18px] ${
                            isActive ? 'text-main border-b-2 border-main' : 'text-gray-600 hover:text-main'
                        }`
                    }
                >
                    <span>{element.icon}</span>
                    <span> {element.value}</span>
                </NavLink>
            ))}
        </div>
    );
};

export default Navigation;
