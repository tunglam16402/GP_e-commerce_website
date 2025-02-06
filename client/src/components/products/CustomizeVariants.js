import { apiAddVariant } from 'apis';
import Button from 'components/buttons/Button';
import InputForm from 'components/inputs/InputForm';
import React, { memo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { showModal } from 'store/app/appSlice';
import Swal from 'sweetalert2';
import { getBase64 } from 'utils/helper';
import { useDispatch } from 'react-redux';
import Loading from 'components/common/Loading';

const CustomizeVariants = ({ customizeVariant, setCustomizeVariant, render }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm();
    const [preview, setPreview] = useState({
        thumb: null,
        images: [],
    });
    const [hoverElement, setHoverElement] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        reset({
            title: customizeVariant?.title,
            color: customizeVariant?.color,
            price: customizeVariant?.price,
        });
    }, [customizeVariant]);

    const handlePreviewThumb = async (file) => {
        const base64Thumb = await getBase64(file);
        setPreview((prev) => ({ ...prev, thumb: base64Thumb }));
    };

    const handlePreviewImages = async (files) => {
        const imagesPreview = [];
        for (let file of files) {
            if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
                toast.warning('File not support');
                return;
            }
            const base64 = await getBase64(file);
            imagesPreview.push({ name: file.name, path: base64 });
        }
        setPreview((prev) => ({ ...prev, images: imagesPreview }));
    };

    useEffect(() => {
        if (watch('thumb') instanceof FileList && watch('thumb').length > 0) handlePreviewThumb(watch('thumb')[0]);
    }, [watch('thumb')]);

    useEffect(() => {
        if (watch('images') instanceof FileList && watch('images').length > 0) handlePreviewImages(watch('images'));
    }, [watch('images')]);

    // const handleAddVariant = async (data) => {
    //     if (data.color === customizeVariant.color) {
    //         Swal.fire('Oops', 'Color not changed', 'info');
    //     } else {
    //         const formData = new FormData();
    //         for (let i of Object.entries(data)) {
    //             formData.append(i[0], i[1]);
    //         }
    //         if (data.thumb) {
    //             formData.append('thumb', data.thumb[0]);
    //         }
    //         if (data.images) {
    //             for (let image of data.images) {
    //                 formData.append('images', image);
    //             }
    //         }
    //         console.log([...formData.entries()]); // Kiểm tra nội dung formData
    //         dispatch(showModal({ isShowModal: true, modalChildren: <Loading></Loading> }));
    //         const response = await apiAddVariant(formData, customizeVariant._id);
    //         console.log('Variant ID:', customizeVariant._id);
    //         dispatch(showModal({ isShowModal: false, modalChildren: null }));
    //         console.log(response);
    //     }
    // };
    const handleAddVariant = async (data) => {
        if (data.color === customizeVariant.color) {
            Swal.fire('Oops', 'Color not changed', 'info');
        } else {
            const formData = new FormData();
            for (let i of Object.entries(data)) {
                formData.append(i[0], i[1]);
            }
            if (data.thumb) {
                formData.append('thumb', data.thumb[0]);
            }
            if (data.images) {
                for (let image of data.images) {
                    formData.append('images', image);
                }
            }
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading></Loading> }));
            const response = await apiAddVariant(customizeVariant._id, formData);
            dispatch(showModal({ isShowModal: false, modalChildren: null }));
            if (response.success) {
                toast.success(response.message);
                reset();
                render();
                setPreview({ thumb: '', images: [] });
            } else toast.error(response.message);
        }
    };

    const handleRemoveImage = (name) => {
        const files = [...watch('images')];
        reset({
            images: files?.filter((element) => element.name !== name),
        });
        if (preview.images?.some((element) => element.name === name))
            setPreview((prev) => ({ ...prev, images: prev.images?.filter((element) => element.name !== name) }));
    };

    return (
        <div className=" w-full flex flex-col bg-gray-100 px-4 relative">
            <div className="h-[80px] w-full"></div>
            <div className="flex justify-between right-0 left-[250px] px-4 bg-main z-50 items-center fixed">
                <h1 className="h-[75px] flex justify-between uppercase text-white items-center text-3xl font-bold ">
                    Add new variation
                </h1>
                <span className="text-white hover:underline cursor-pointer " onClick={() => setCustomizeVariant(null)}>
                    Cancel
                </span>
            </div>
            <div className="p-4">
                <form onSubmit={handleSubmit(handleAddVariant)}>
                    <div className="w-full my-6 flex gap-4">
                        <InputForm
                            label="Product title"
                            register={register}
                            errors={errors}
                            id="title"
                            fullWidth
                            // readOnly
                            style="flex-auto"
                            // disable={true}
                            validate={{
                                required: 'Need fill this fields',
                            }}
                            placeholder="Title of new variant"
                        ></InputForm>
                    </div>
                    <div className="w-full my-6 flex gap-4">
                        <InputForm
                            label="Price"
                            register={register}
                            errors={errors}
                            id="price"
                            validate={{
                                required: 'Need fill this fields',
                            }}
                            style="flex-auto"
                            placeholder="Price of new variant"
                            type="number"
                        ></InputForm>
                        <InputForm
                            label="Color"
                            register={register}
                            errors={errors}
                            id="color"
                            validate={{
                                required: 'Need fill this fields',
                            }}
                            style="flex-auto"
                            placeholder="Color of new variant"
                        ></InputForm>
                    </div>
                    <div className="flex flex-col gap-2 mt-8">
                        <label className="font-semibold" htmlFor="thumb">
                            Upload thumb
                        </label>
                        <input
                            type="file"
                            id="thumb"
                            lang="en"
                            {...register('thumb', { required: 'Need fill this' })}
                        ></input>
                        {errors['thumb'] && <small className="text-sm text-red-500">{errors['thumb']?.message}</small>}
                    </div>
                    {preview.thumb && (
                        <div className="my-4">
                            <img src={preview.thumb} alt="thumbnail" className="w-[200px] object-contain"></img>
                        </div>
                    )}
                    <div className="flex flex-col gap-2 mt-8">
                        <label className="font-semibold" htmlFor="products">
                            Upload images of product
                        </label>
                        <input
                            type="file"
                            id="products"
                            lang="en"
                            multiple
                            {...register('images', { required: 'Need fill this' })}
                        ></input>
                        {errors['images'] && (
                            <small className="text-sm text-red-500">{errors['images']?.message}</small>
                        )}
                    </div>
                    {preview.images.length > 0 && (
                        <div className="my-4 flex w-full gap-3 flex-wrap">
                            {preview.images?.map((element, index) => (
                                <div
                                    onMouseEnter={() => setHoverElement(element.name)}
                                    key={index}
                                    className="w-fit relative"
                                    onMouseLeave={() => setHoverElement(null)}
                                >
                                    <img src={element.path} alt="products" className="w-[200px] object-contain"></img>
                                    {hoverElement === element.name && (
                                        <div
                                            className="absolute animate-scale-up inset-0 bg-overlay flex justify-center items-center cursor-pointer"
                                            onClick={() => handleRemoveImage(element.name)}
                                        >
                                            <FaTrashAlt size={24} color="white"></FaTrashAlt>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="mt-8">
                        <Button type="submit">Add variant</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default memo(CustomizeVariants);
