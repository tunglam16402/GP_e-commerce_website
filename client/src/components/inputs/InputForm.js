import React from 'react';
import clsx from 'clsx';

const InputForm = ({
    label,
    disable,
    register,
    errors,
    id,
    validate,
    defaultValue,
    type = 'text',
    placeholder,
    fullWidth,
    style,
    readOnly,
    onKeyDown,
    onClick,
}) => {
    return (
        <div className={clsx('flex flex-col h-[80px] gap-2', style)}>
            {label && (
                <label className="font-medium" htmlFor={id}>
                    {label + ':'}
                </label>
            )}
            <input
                type={type}
                id={id}
                {...register(id, validate)}
                disabled={disable}
                placeholder={placeholder}
                defaultValue={defaultValue}
                readOnly={readOnly}
                onKeyDown={onKeyDown}
                onClick={onClick}
                className={clsx('form-input my-auto', fullWidth && 'w-full', style)}
            ></input>
            {errors[id] && <small className="text-sm text-red-500">{errors[id]?.message}</small>}
        </div>
    );
};

export default InputForm;
