import { InputForm, Select, Button, MarkdownEditor, Loading } from 'components';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getBase64, validate } from 'utils/helper';
import { apiUpdateProduct } from 'apis/product';
import { showModal } from 'store/app/appSlice';
import { useSelector, useDispatch } from 'react-redux';
import { FaTrashAlt } from 'react-icons/fa';

const UpdateProduct = ({ editProduct, render, setEditProduct }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm();
    const { categories } = useSelector((state) => state.app);
    const dispatch = useDispatch();

    const [payload, setPayload] = useState({
        description: '',
    });
    const [preview, setPreview] = useState({
        thumb: null,
        images: [],
    });
    const [hoverElement, setHoverElement] = useState(null);

    //khi click vào nút edit thì reset nó lấy giá trị cảu product đc edit
    useEffect(() => {
        if (editProduct) {
            reset({
                title: editProduct.title || '',
                price: editProduct.price || '',
                discount: editProduct.discount || '',
                quantity: editProduct.quantity || '',
                color: editProduct.color || '',
                category: editProduct.category || '',
                brand: editProduct.brand?.toLowerCase() || '',
            });

            setPayload({
                description: Array.isArray(editProduct.description)
                    ? editProduct.description.join(',')
                    : editProduct.description,
            });
            setPreview((prev) => ({
                ...prev,
                thumb: editProduct.thumb || '',
                images: editProduct.images || [],
            }));
        }
    }, [editProduct, reset]);

    const [invalidFields, setInvalidFields] = useState([]);

    const changeValue = useCallback(
        (e) => {
            setPayload(e);
        },
        [payload],
    );

    //handle preiview image when upload file
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
            imagesPreview.push(base64);
        }
        // Reset preview với ảnh mới
        setPreview({ images: imagesPreview });
    };

    const thumb = watch('thumb');
    const images = watch('images');

    useEffect(() => {
        if (thumb && thumb[0]) {
            handlePreviewThumb(thumb[0]);
        } else if (editProduct) {
            setPreview((prev) => ({
                ...prev,
                thumb: editProduct.thumb || '',
            }));
        }
    }, [thumb, editProduct]);

    useEffect(() => {
        if (images && images.length > 0) {
            handlePreviewImages(images);
        } else if (editProduct) {
            setPreview((prev) => ({
                ...prev,
                images: editProduct.images || [],
            }));
        }
    }, [images, editProduct]);

    const handleUpdateProduct = async (data) => {
        const invalids = validate(payload, setInvalidFields);
        if (invalids === 0) {
            if (data.category) data.category = categories?.find((element) => element.title === data.category)?.title;
            const finalPayload = { ...data, ...payload };
            console.log(finalPayload);
            const formData = new FormData();
            for (let i of Object.entries(finalPayload)) {
                formData.append(i[0], i[1]);
            }
            // if (finalPayload.thumb) {
            //     formData.append('thumb', finalPayload?.thumb?.length === 0 ? preview.thumb : finalPayload.thumb[0]);
            // }
            if (finalPayload.thumb) {
                const thumb =
                    finalPayload.thumb.length === 0
                        ? preview.thumb // Nếu không có file mới, gửi URL từ preview
                        : finalPayload.thumb[0]; // Nếu có file, lấy file đầu tiên
                formData.append('thumb', thumb);
            }
            if (finalPayload.images) {
                const images = finalPayload.images.length === 0 ? preview.images : finalPayload.images;
                for (let image of images) {
                    formData.append('images', image);
                }
            }
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading></Loading> }));
            const response = await apiUpdateProduct(formData, editProduct._id);
            dispatch(showModal({ isShowModal: false, modalChildren: null }));
            console.log(response);
            if (response.success) {
                toast.success(response.message);
                render();
                setEditProduct(null);
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
        <div className="w-full flex flex-col bg-gray-100 px-4 relative">
            <div className="h-[80px] w-full"></div>
            <div className="flex justify-between right-0 left-[250px] px-4 bg-main z-50 items-center fixed">
                <h1 className="h-[75px] flex justify-between text-white items-center text-3xl font-bold ">
                    Update Product
                </h1>
                <span className="text-white hover:underline cursor-pointer" onClick={() => setEditProduct(null)}>
                    Cancel
                </span>
            </div>

            <div className="p-4">
                <form onSubmit={handleSubmit(handleUpdateProduct)}>
                    <InputForm
                        label="Product name"
                        register={register}
                        errors={errors}
                        id="title"
                        validate={{
                            required: 'Need fill this fields',
                        }}
                        fullWidth
                        placeholder="Name of new product"
                    ></InputForm>
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
                            placeholder="Price of new product"
                            type="number"
                        ></InputForm>
                        <InputForm
                            label="Discount (%)"
                            register={register}
                            errors={errors}
                            id="discount"
                            placeholder="Enter discount percentage"
                            type="number"
                            style="flex-auto"
                            min={0} // Đảm bảo giá trị không dưới 0
                            max={100} // Đảm bảo giá trị không vượt quá 100
                            validate={{
                                required: 'This field is required',
                                min: {
                                    value: 0,
                                    message: 'Discount cannot be less than 0',
                                },
                                max: {
                                    value: 100,
                                    message: 'Discount cannot be more than 100',
                                },
                            }}
                            className="transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 border border-gray-300 rounded-lg shadow-md p-4"
                        />
                        <InputForm
                            label="Quantity"
                            register={register}
                            errors={errors}
                            id="quantity"
                            validate={{
                                required: 'Need fill this fields',
                            }}
                            style="flex-auto"
                            placeholder="Quantity of new product"
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
                            placeholder="Color of new product"
                        ></InputForm>
                    </div>
                    <div className="w-full my-6 flex gap-4">
                        <Select
                            label="Category"
                            options={categories?.map((element) => ({ code: element.title, value: element.title }))}
                            register={register}
                            id="category"
                            validate={{
                                required: 'Need fill this fields',
                            }}
                            style="flex-auto"
                            errors={errors}
                            fullWidth
                        ></Select>
                        <Select
                            label="Brand (Optionals)"
                            options={categories
                                ?.find((element) => element.title === watch('category'))
                                ?.brand?.map((element) => ({ code: element.toLowerCase(), value: element }))}
                            register={register}
                            id="brand"
                            style="flex-auto"
                            errors={errors}
                            fullWidth
                        ></Select>
                    </div>
                    <MarkdownEditor
                        name="description"
                        changeValue={changeValue}
                        label="Description"
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        value={payload.description}
                    ></MarkdownEditor>

                    <div className="flex flex-col gap-2 mt-8">
                        <label className="font-semibold" htmlFor="thumb">
                            Upload thumb
                        </label>
                        <input type="file" id="thumb" lang="en" {...register('thumb')}></input>
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
                        <input type="file" id="products" lang="en" multiple {...register('images')}></input>
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
                                    <img src={element} alt="products" className="w-[200px] object-contain"></img>
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
                        <Button type="submit">Update new product</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default memo(UpdateProduct);
