import withBaseComponent from 'hocs/withBaseComponent';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { InputForm, Button, MarkdownEditor, Loading } from 'components';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getBase64, validate } from 'utils/helper';
import { apiUpdateBlog } from 'apis/blog';
import { showModal } from 'store/app/appSlice';
import { useSelector, useDispatch } from 'react-redux';
import { FaTrashAlt } from 'react-icons/fa';

const UpdateBlog = ({ editBlog, render, setEditBlog }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm();
    const dispatch = useDispatch();

    const [payload, setPayload] = useState({
        description: '',
    });
    const [preview, setPreview] = useState({
        images: [],
    });
    const [hoverElement, setHoverElement] = useState(null);

    useEffect(() => {
        if (editBlog) {
            reset({
                title: editBlog.title || '',
            });

            setPayload({
                description: Array.isArray(editBlog.description)
                    ? editBlog.description.join(',')
                    : editBlog.description,
            });
            setPreview((prev) => ({
                ...prev,
                images: editBlog.images || [],
            }));
        }
    }, [editBlog, reset]);

    const [invalidFields, setInvalidFields] = useState([]);

    const changeValue = useCallback(
        (e) => {
            setPayload(e);
        },
        [payload],
    );

    const handlePreviewImages = async (files) => {
        const imagesPreview = [];
        for (let file of files) {
            if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
                toast.warning('File not support');
                return;
            }
            const base64 = await getBase64(file);
            imagesPreview.push(base64);
        }
        // Reset preview với ảnh mới
        setPreview({ images: imagesPreview });
    };

    const images = watch('images');

    useEffect(() => {
        if (images && images.length > 0) {
            handlePreviewImages(images);
        } else if (editBlog) {
            setPreview((prev) => ({
                ...prev,
                images: editBlog.images || [],
            }));
        }
    }, [images, editBlog]);

    const handleUpdateBlog = async (data) => {
        const invalids = validate(payload, setInvalidFields);
        if (invalids === 0) {
            const finalPayload = { ...data, ...payload };
            console.log(finalPayload);
            const formData = new FormData();
            for (let i of Object.entries(finalPayload)) {
                formData.append(i[0], i[1]);
            }
            if (finalPayload.images) {
                const images = finalPayload.images.length === 0 ? preview.images : finalPayload.images;
                for (let image of images) {
                    formData.append('images', image);
                }
            }
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading></Loading> }));
            const response = await apiUpdateBlog(formData, editBlog._id);
            dispatch(showModal({ isShowModal: false, modalChildren: null }));
            console.log(response);
            if (response.success) {
                toast.success(response.message);
                render();
                setEditBlog(null);
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
        <div className="w-full flex flex-col bg-gray-100 px-4 min-h-screen">
            <div className="flex justify-between items-center bg-main text-white p-4 fixed top-0 right-0 left-[289px] z-50">
                <h1 className="text-3xl font-bold">Update Blog</h1>
                <span className="hover:underline cursor-pointer" onClick={() => setEditBlog(null)}>
                    Cancel
                </span>
            </div>
            <div className="pt-[100px] p-4">
                <form onSubmit={handleSubmit(handleUpdateBlog)} className="space-y-6">
                    <InputForm
                        label="Blog title"
                        register={register}
                        errors={errors}
                        id="title"
                        validate={{
                            required: 'Please fill out this field',
                        }}
                        fullWidth
                        placeholder="Enter Blog's Title"
                    />
                    <MarkdownEditor
                        name="description"
                        changeValue={changeValue}
                        label="Content"
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        value={payload.description}
                    />
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold" htmlFor="blogs">
                            Upload Images of Blog
                        </label>
                        <input type="file" id="blogs" lang="en" multiple {...register('images')} />
                        {errors['images'] && (
                            <small className="text-sm text-red-500">{errors['images']?.message}</small>
                        )}
                    </div>
                    {preview.images.length > 0 && (
                        <div className="my-4 flex flex-wrap gap-3">
                            {preview.images.map((element, index) => (
                                <div
                                    key={index}
                                    className="w-[400px] relative"
                                    onMouseEnter={() => setHoverElement(element.name)}
                                    onMouseLeave={() => setHoverElement(null)}
                                >
                                    <img
                                        src={element}
                                        alt="Blog Preview"
                                        className="w-full h-auto object-contain rounded-lg shadow-md"
                                    />
                                    {hoverElement === element.name && (
                                        <div
                                            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer"
                                            onClick={() => handleRemoveImage(element.name)}
                                        >
                                            <FaTrashAlt size={24} color="white" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    <div>
                        <Button type="submit">Update Blog</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default withBaseComponent(memo(UpdateBlog));
