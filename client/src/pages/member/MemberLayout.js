import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import path from 'utils/path';
import { useSelector } from 'react-redux';
import { MemberSidebar } from 'components';

const MemberLayout = () => {
    const { isLoggedIn, current } = useSelector((state) => state.user);
    if (!isLoggedIn || !current) {
        return <Navigate to={`/${path.AUTH}`} replace={true}></Navigate>;
    }
    return (
        <div className="flex">
            <div className="w-[250px] top-0 bottom-0 fixed flex-none">
                <MemberSidebar></MemberSidebar>
            </div>
            <div className="w-[250px]"></div>
            <div className="flex-auto bg-gray-100 min-h-screen">
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default MemberLayout;
