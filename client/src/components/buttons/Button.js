import React, { memo } from 'react';

const Button = ({ children, handleOnclick, style, fullWidth, type = 'button' }) => {
    return (
        <div>
            <button
                type={type}
                className={
                    style
                        ? style
                        : `group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-main hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-main ${
                              fullWidth ? 'w-full' : 'w-fit'
                          }`
                }
                onClick={() => {
                    handleOnclick && handleOnclick();
                }}
            >
                {children}
            </button>
        </div>
    );
};

export default memo(Button);
