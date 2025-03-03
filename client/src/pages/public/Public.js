import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Footer, Header, Navigation, TopHeader } from '../../components';
import path from '../../utils/path';

const Public = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === `/${path.AUTH}`;
    const isCheckoutPage = location.pathname === '/checkout';
    const isInvoicePage = location.pathname === '/purchase-invoice';

    return (
        <div className="w-full max-h-screen overflow-y-auto flex flex-col items-center bg-gray-50 ">
            <div className="w-full sticky top-0 bg-gray-100 h-[40px] z-40">
                <TopHeader />
            </div>
            <Header />
            {!(isLoginPage || isCheckoutPage || isInvoicePage) && (
                <div className="pt-[120px]">
                    <Navigation />
                </div>
            )}
            <div className="w-full flex flex-col items-center">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default Public;
