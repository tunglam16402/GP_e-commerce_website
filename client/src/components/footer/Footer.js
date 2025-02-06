import React, { memo } from 'react';
import icons from '../../utils/icons';
import { useLocation, Link } from 'react-router-dom';
import path from '../../utils/path';

const { GrMail } = icons;

function Footer() {
    const location = useLocation();
    const isLoginPage = location.pathname === `/${path.AUTH}`;
    return (
        <div className="w-full ">
            {!isLoginPage && (
                <div className="h-[103px] w-full bg-main flex items-center justify-center">
                    <div className="w-main flex items-center justify-between">
                        <div className="flex flex-col flex-1">
                            <span className="text-[20px] text-gray-100 uppercase">Sign up to Newsletter</span>
                            <small className="text-[13px] text-gray-300">
                                Subscribe now and receive weekly newsletter
                            </small>
                        </div>
                        <div className="flex-1 flex items-center">
                            <input
                                className="p-4 pr-0 rounded-l-full w-full bg-[#dd5b5b] text-gray-100 outline-none
                        placeholder:text-gray-200 placeholder:italic placeholder:opacity-70"
                                type="text"
                                name="email"
                                placeholder="Email address"
                                id=""
                            ></input>
                            <div className="h-[56px] w-[56px] bg-[#dd5b5b] rounded-r-full flex items-center justify-center text-white">
                                <GrMail size={18}></GrMail>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="h-[407px] w-full bg-gray-800 text-white text-[13px] flex items-center justify-center">
                <div className="w-main flex ">
                    <div className="flex flex-2 flex-col gap-2">
                        <h3 className="mb-[20px] text-[15px] pl-[15px] font-medium border-l-[3px] border-main uppercase">
                            About us
                        </h3>
                        <span>
                            <span>Address: </span>
                            <span className="opacity-70">No. 10, Lane 88, Bac Tu Liem District, Hanoi City</span>
                        </span>
                        <span>
                            <span>Phone: </span>
                            <span className="opacity-70">(+84) 012345678</span>
                        </span>
                        <span>
                            <span>Mail: </span>
                            <span className="opacity-70">EcommerceGP@gmail.com</span>
                        </span>
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <h3 className="mb-[20px] text-[15px] pl-[15px] font-medium border-l-[3px] border-main uppercase">
                            infomation
                        </h3>

                        <span>Typography</span>
                        <span>Gallery</span>
                        <span>Store Location</span>
                        <span>Today's Deals</span>
                        <span>Contact</span>
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <h3 className="mb-[20px] text-[15px] pl-[15px] font-medium border-l-[3px] border-main uppercase">
                            who we are?
                        </h3>
                        <span>Help</span>
                        <span>Free Shipping</span>
                        <span>FAQs</span>
                        <span>Return & Exchange</span>
                        <span>Testimonials</span>
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <h3 className="mb-[20px] text-[15px] pl-[15px] font-medium border-l-[3px] border-main uppercase">
                            #DigitalWorldStore
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(Footer);
