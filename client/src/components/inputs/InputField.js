import React, { memo } from 'react';
import clsx from 'clsx';

const InputField = ({
    value,
    setValue,
    nameKey,
    type,
    inValidFields,
    placeholder,
    setInvalidFields,
    autocomplete,
    style,
    isHideLabel,
}) => {
    // const handleChange = (e) => {
    //     const { value } = e.target; // Kiểm tra giá trị nhập vào để chỉ cho phép ký tự số nếu type là 'mobile'
    //     if (type === 'mobile' && !/^[0-9]*$/.test(value)) {
    //         return;
    //     }
    //     setValue((prev) => ({ ...prev, [nameKey]: value }));
    // };
    return (
        <div className="">
            {!isHideLabel && (
                <label htmlFor={nameKey} className="block text-sm font-medium text-gray-700">
                    {nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
                </label>
            )}
            <input
                type={type || 'text'}
                required
                className={clsx(
                    'appearance-none rounded-md relative block w-full px-3 py-2 mt-1 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-main focus:border-main focus:z-10 sm:text-sm placeholder:italic',
                    style,
                )}
                placeholder={placeholder || 'Enter your ' + nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
                value={value}
                onChange={(e) => setValue((prev) => ({ ...prev, [nameKey]: e.target.value }))}
                autoComplete={autocomplete}
                // onChange={handleChange}
                onFocus={() => inValidFields && setInvalidFields([])}
            />
            {inValidFields?.some((element) => element.name === nameKey) && (
                <small className="text-main italic">
                    {inValidFields.find((element) => element.name === nameKey)?.message}
                </small>
            )}
        </div>
    );
};

export default memo(InputField);
