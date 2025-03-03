import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import path from 'utils/path';
import { useSelector } from 'react-redux';
import { AdminHeader, AdminSidebar } from 'components';

const AdminLayout = () => {
    const { isLoggedIn, current } = useSelector((state) => state.user);
    if (!isLoggedIn || !current || +current.role !== 2002) {
        return <Navigate to={`/${path.AUTH}`} replace={true}></Navigate>;
    }
    return (
        <div className="flex w-full min-h-screen">
            <div className="w-[280px] h-screen fixed top-0 left-0 bg-gray-800 text-white">
                <AdminSidebar />
            </div>

            <div className="flex flex-col flex-grow ml-[280px]">
                <div className="h-[60px] bg-white shadow-md sticky top-0 z-50">
                    <AdminHeader />
                </div>
                <div className="flex-1 bg-gray-100 p-4 overflow-y-auto h-[calc(100vh-60px)]">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
