import React, { useCallback, useEffect, useState } from 'react';
import { InputForm, Select, Button, MarkdownEditor, Loading } from 'components';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { validate, getBase64 } from 'utils/helper';
import { toast } from 'react-toastify';
import { FaTrashAlt } from 'react-icons/fa';
import { apiCreateProduct } from 'apis/product';
import { showModal } from 'store/app/appSlice';
import { apiCreateBlog } from 'apis/blog';

const CreateBlog = () => {
    // const { categories } = useSelector((state) => state.app);
    const dispatch = useDispatch();
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
        watch,
    } = useForm();
    const [payload, setPayload] = useState({
        description: '',
    });
    const [preview, setPreview] = useState({
        // thumb: null,
        images: [],
    });
    const [hoverElement, setHoverElement] = useState(null);

    const [invalidFields, setInvalidFields] = useState([]);

    const changeValue = useCallback(
        (e) => {
            setPayload(e);
        },
        [payload],
    );

    //handle preiview image when upload file
    // const handlePreviewThumb = async (file) => {
    //     const base64Thumb = await getBase64(file);
    //     setPreview((prev) => ({ ...prev, thumb: base64Thumb }));
    // };

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

    // useEffect(() => {
    //     handlePreviewThumb(watch('thumb')[0]);
    // }, [watch('thumb')]);

    useEffect(() => {
        handlePreviewImages(watch('images'));
    }, [watch('images')]);

    const handleCreateBlog = async (data) => {
        const invalids = validate(payload, setInvalidFields);
        if (invalids === 0) {
            // if (data.category) data.category = categories?.find((element) => element._id === data.category)?.title;
            const finalPayload = { ...data, ...payload };
            const formData = new FormData();
            for (let i of Object.entries(finalPayload)) {
                formData.append(i[0], i[1]);
            }
            // if (finalPayload.thumb) {
            //     formData.append('thumb', finalPayload.thumb[0]);
            // }
            if (finalPayload.images) {
                for (let image of finalPayload.images) {
                    formData.append('images', image);
                }
            }
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading></Loading> }));
            const response = await apiCreateBlog(formData);
            dispatch(showModal({ isShowModal: false, modalChildren: null }));

            if (response.success) {
                toast.success(response.message);
                reset();
                setPayload({
                    // thumb: '',
                    image: '',
                });
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
        <div className="w-full max-w-screen-xl mx-auto p-8 bg-gradient-to-r from-red-50 via-red-100 to-red-200 rounded-lg shadow-xl">
            <div className="mb-8">
                <h1 className="text-4xl font-semibold text-gray-900 tracking-tight border-b-4 border-red-600 pb-2">
                    Create New Blog
                </h1>
            </div>

            <form onSubmit={handleSubmit(handleCreateBlog)} className="space-y-10">
                <div>
                    <InputForm
                        label="Blog Title"
                        register={register}
                        errors={errors}
                        id="title"
                        validate={{
                            required: 'This field is required',
                        }}
                        fullWidth
                        placeholder="Enter name of new product"
                        className="transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 border border-gray-300 rounded-lg shadow-md p-4"
                    />
                </div>
                <div>
                    <MarkdownEditor
                        name="description"
                        changeValue={changeValue}
                        label="Description"
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        className="border border-gray-300 rounded-lg shadow-md p-4"
                    />
                </div>
                {/* Thumbnail Upload */}
                {/* <div className="flex flex-col gap-4">
                    <label className="font-semibold text-gray-800">Upload Thumbnail</label>
                    <input
                        type="file"
                        id="thumb"
                        lang="en"
                        {...register('thumb', { required: 'This field is required' })}
                        className="transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 border border-gray-300 rounded-lg p-4"
                    />
                    {errors['thumb'] && <small className="text-sm text-red-500">{errors['thumb']?.message}</small>}
                </div>

                {preview.thumb && (
                    <div className="my-6 flex justify-center">
                        <img
                            src={preview.thumb}
                            alt="thumbnail"
                            className="w-[250px] h-[250px] object-contain border-4 border-red-300 rounded-lg shadow-md"
                        />
                    </div>
                )} */}
                {/* Product Images Upload */}
                <div className="flex flex-col gap-4">
                    <label className="font-semibold text-gray-800">Upload Blog Images</label>
                    <input
                        type="file"
                        id="products"
                        lang="en"
                        multiple
                        {...register('images', { required: 'This field is required' })}
                        className="transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 border border-gray-300 rounded-lg p-4"
                    />
                    {errors['images'] && <small className="text-sm text-red-500">{errors['images']?.message}</small>}
                </div>
                {/* Product Images Preview */}
                {preview.images.length > 0 && (
                    <div className="my-6 flex justify-center gap-6 flex-wrap">
                        {preview.images.map((element, index) => (
                            <div
                                onMouseEnter={() => setHoverElement(element.name)}
                                key={index}
                                className="relative w-[250px] h-[250px] overflow-hidden rounded-lg shadow-lg bg-white"
                                onMouseLeave={() => setHoverElement(null)}
                            >
                                <img
                                    src={element.path}
                                    alt="product"
                                    className="object-cover w-full h-full rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-110"
                                />

                                {/* Delete Button on Hover */}
                                {hoverElement === element.name && (
                                    <div
                                        className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center cursor-pointer"
                                        onClick={() => handleRemoveImage(element.name)}
                                    >
                                        <FaTrashAlt size={24} color="white" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                {/* Submit Button */}
                <div className="mt-8 flex justify-center">
                    <Button
                        type="submit"
                        className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transition-all duration-300"
                    >
                        Create New Blog
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateBlog;
