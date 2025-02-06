import { memo, React } from 'react';
import { NavLink } from 'react-router-dom';
import { createSlug } from 'utils/helper';
import { useSelector } from 'react-redux';
import { MdDensityMedium } from 'react-icons/md';

const Sidebar = () => {
    const { categories } = useSelector((state) => state.app);
    return (
        <div className="flex flex-col border">
            <div className='flex items-center w-full bg-main text-white p-2 gap-2'>
                <MdDensityMedium color='white' size={20}/>
                <span className="uppercase font-semibold text-[18px]">All collections</span>
            </div>

            {categories?.map((element) => (
                <NavLink
                    key={createSlug(element.title)}
                    to={createSlug(element.title)}
                    className={({ isActive }) =>
                        `px-5 pt-4 pb-3 transition-all duration-300 ease-in-out ${
                            isActive
                                ? 'bg-main text-white rounded-lg shadow-md'
                                : 'text-gray-700 hover:bg-main hover:text-white'
                        }`
                    }
                >
                    {element.title}
                </NavLink>
            ))}
        </div>
    );
};

export default memo(Sidebar);
