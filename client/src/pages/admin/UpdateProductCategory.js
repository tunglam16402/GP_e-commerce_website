import withBaseComponent from 'hocs/withBaseComponent';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { InputForm, Button, MarkdownEditor, Loading } from 'components';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getBase64, validate } from 'utils/helper';
import { apiUpdateCategory } from 'apis';
import { showModal } from 'store/app/appSlice';
import { useSelector, useDispatch } from 'react-redux';
import { FaTrashAlt } from 'react-icons/fa';

const UpdateProductCategory = ({ editPCategory, render, setEditPCategory }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm();
    const dispatch = useDispatch();

    const [payload, setPayload] = useState({
        // description: '',
    });
    const [preview, setPreview] = useState({
        image: [],
    });

    useEffect(() => {
        if (editPCategory) {
            reset({
                title: editPCategory.title || '',
                brand: editPCategory.brand || [],
            });

            setPreview((prev) => ({
                ...prev,
                image: editPCategory.image || [],
            }));
        }
    }, [editPCategory, reset]);

    const handlePreviewImage = async (files) => {
        const imagePreview = [];
        for (let file of files) {
            if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
                toast.warning('File not support');
                return;
            }
            const base64 = await getBase64(file);
            imagePreview.push(base64);
        }
        setPreview({ image: imagePreview });
    };

    const image = watch('image');

    useEffect(() => {
        if (image && image.length > 0) {
            handlePreviewImage(image);
        } else if (editPCategory) {
            setPreview((prev) => ({
                ...prev,
                image: editPCategory.image || [],
            }));
        }
    }, [image, editPCategory]);

    const handleUpdateProductCategory = async (data) => {
        console.log('Form Data:', data);
        if (typeof data.brand === 'string') {
            data.brand = data.brand.split(',').map((item) => item.trim());
        }

        const invalids = validate(payload);
        if (invalids === 0) {
            const finalPayload = { ...data, ...payload };
            const formData = new FormData();

            for (let i of Object.entries(finalPayload)) {
                formData.append(i[0], i[1]);
            }

            if (finalPayload.image) {
                const image = finalPayload.image.length === 0 ? preview.image : finalPayload.image;
                for (let newImage of image) {
                    formData.append('image', newImage);
                }
            }
            console.log('FormData before API call:', [...formData.entries()]);

            dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
            const response = await apiUpdateCategory(editPCategory._id, formData); 
            console.log('API Response Data:', response.data);
            dispatch(showModal({ isShowModal: false, modalChildren: null }));
            console.log(response);
            if (response.success) {
                toast.success(response.message);
                render();
                setEditPCategory(null);
            } else toast.error(response.message);
        }
    };

    return (
        <div className="w-full flex flex-col bg-gray-100 px-4 min-h-screen">
            <div className="flex justify-between items-center  bg-main text-white p-4 fixed top-0 right-0 left-[289px] z-50">
                <h1 className="text-3xl font-bold">Update Product Category</h1>
                <span className="hover:underline cursor-pointer" onClick={() => setEditPCategory(null)}>
                    Cancel
                </span>
            </div>
            <div className="pt-[100px] p-4">
                <form onSubmit={handleSubmit(handleUpdateProductCategory)} className="space-y-6">
                    <InputForm
                        label="Product Category title"
                        register={register}
                        errors={errors}
                        id="title"
                        validate={{
                            required: 'Please fill out this field',
                        }}
                        fullWidth
                        placeholder="Enter Product Category's Title"
                    />
                    <div>
                        <InputForm
                            label="Brand"
                            register={register}
                            errors={errors}
                            id="brand"
                            validate={{
                                required: 'This field is required',
                            }}
                            fullWidth
                            placeholder="Enter name of brand"
                            className="transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 border border-gray-300 rounded-lg shadow-md p-4"
                        />
                    </div>
                    {/* Image Upload */}
                    <div className="flex flex-col gap-4">
                        <label className="font-semibold text-gray-800">Upload Image</label>
                        <input
                            type="file"
                            id="image"
                            lang="en"
                            {...register('image', { required: 'This field is required' })}
                            className="transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 border border-gray-300 rounded-lg p-4"
                        />
                        {errors['image'] && <small className="text-sm text-red-500">{errors['image']?.message}</small>}
                    </div>

                    {preview?.image && (
                        <div className="my-6 flex justify-center">
                            <img
                                src={preview?.image}
                                alt="image-category"
                                className="w-[250px] h-[250px] object-contain border-4 border-red-300 rounded-lg shadow-md"
                            />
                        </div>
                    )}
                    <div>
                        <Button type="submit">Update Product Category</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default withBaseComponent(memo(UpdateProductCategory));
