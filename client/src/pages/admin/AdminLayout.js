import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import path from 'utils/path';
import { useSelector } from 'react-redux';
import { AdminSidebar } from 'components';

const AdminLayout = () => {
    const { isLoggedIn, current } = useSelector((state) => state.user);
    if (!isLoggedIn || !current || +current.role !== 2002) {
        return <Navigate to={`/${path.AUTH}`} replace={true}></Navigate>;
    }
    return (
        <div className="flex w-full min-h-screen relative">
            <div className="w-[280px] top-0 bottom-0 fixed flex-none">
                <AdminSidebar></AdminSidebar>
            </div>
            <div className="w-[280px]"></div>
            <div className="flex-auto bg-gray-100">
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default AdminLayout;
