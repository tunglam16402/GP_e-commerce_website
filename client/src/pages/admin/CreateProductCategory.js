import React, { useCallback, useEffect, useState } from 'react';
import { InputForm, Select, Button, MarkdownEditor, Loading } from 'components';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { validate, getBase64 } from 'utils/helper';
import { toast } from 'react-toastify';
import { showModal } from 'store/app/appSlice';
import { apiCreateCategory } from 'apis/app';

const CreateProductCategory = () => {
    const { categories } = useSelector((state) => state.app);
    const dispatch = useDispatch();
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
        watch,
    } = useForm();
    const [payload, setPayload] = useState({
        // description: '',
    });
    const [preview, setPreview] = useState({
        images: [],
    });

    // handle preiview image when upload file
    const handlePreviewImage = async (file) => {
        const base64Image = await getBase64(file);
        setPreview((prev) => ({ ...prev, image: base64Image }));
    };

    useEffect(() => {
        const imageFiles = watch('image');
        if (imageFiles && imageFiles.length > 0) {
            handlePreviewImage(imageFiles[0]);
        }
    }, [watch('image')]);

    const handleCreateCategory = async (data) => {
        console.log('Form Data:', data);
        const invalids = validate(payload);
        if (invalids === 0) {
            if (data.category) data.category = categories?.find((element) => element._id === data.category)?.title;
            const finalPayload = { ...data, ...payload };
            const formData = new FormData();
            for (let i of Object.entries(finalPayload)) {
                formData.append(i[0], i[1]);
            }
            if (finalPayload.image) {
                formData.append('image', finalPayload.image[0]);
            }
            console.log('FormData before API call:', [...formData.entries()]);
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading></Loading> }));
            const response = await apiCreateCategory(formData);
            console.log('ressssssssssspone', response);
            console.log('API Response Data:', response.data);
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

    return (
        <div className="w-full max-w-screen-xl mx-auto p-8 bg-gradient-to-r from-red-50 via-red-100 to-red-200 rounded-lg shadow-xl">
            <div className="mb-8">
                <h1 className="text-4xl font-semibold text-gray-900 tracking-tight border-b-4 border-red-600 pb-2">
                    Create New Product Category
                </h1>
            </div>

            <form onSubmit={handleSubmit(handleCreateCategory)} className="space-y-10">
                <div>
                    <InputForm
                        label="Category Title"
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

                {/* Submit Button */}
                <div className="mt-8 flex justify-center">
                    <Button
                        type="submit"
                        className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transition-all duration-300"
                    >
                        Create New Product Category
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateProductCategory;

// import React, { useEffect, useState } from 'react';
// import { InputForm, Button, Loading } from 'components';
// import { useForm } from 'react-hook-form';
// import { useSelector, useDispatch } from 'react-redux';
// import { validate, getBase64 } from 'utils/helper';
// import { toast } from 'react-toastify';
// import { showModal } from 'store/app/appSlice';
// import { apiCreateCategory } from 'apis/app';

// const CreateProductCategory = () => {
//     const { categories } = useSelector((state) => state.app);
//     const dispatch = useDispatch();
//     const {
//         register,
//         formState: { errors },
//         reset,
//         handleSubmit,
//         watch,
//     } = useForm();
//     const [payload, setPayload] = useState({});
//     const [preview, setPreview] = useState({ image: '' });
//     const [brands, setBrands] = useState([]); // Danh sách brands

//     // Handle preview image
//     const handlePreviewImage = async (file) => {
//         const base64Image = await getBase64(file);
//         setPreview({ image: base64Image });
//     };

//     useEffect(() => {
//         const imageFiles = watch('image');
//         if (imageFiles && imageFiles.length > 0) {
//             handlePreviewImage(imageFiles[0]);
//         }
//     }, [watch('image')]);

//     // Xử lý nhập brand
//     const handleKeyDown = (e) => {
//         if (e.key === 'Enter' || e.key === ',') {
//             e.preventDefault();
//             const newBrand = e.target.value.trim();
//             if (newBrand && !brands.includes(newBrand)) {
//                 setBrands([...brands, newBrand]);
//             }
//             e.target.value = '';
//         }
//     };

//     // Xóa brand khỏi danh sách
//     const removeBrand = (brandToRemove) => {
//         setBrands(brands.filter((brand) => brand !== brandToRemove));
//     };

//     // Xử lý submit
//     // const handleCreateCategory = async (data) => {
//     //     console.log('Form Data:', data);
//     //     const invalids = validate(payload);
//     //     if (invalids === 0) {
//     //         if (data.category) {
//     //             data.category = categories?.find((el) => el._id === data.category)?.title;
//     //         }

//     //         const finalPayload = { ...data, ...payload, brands }; // Thêm brands vào payload
//     //         const formData = new FormData();
//     //         for (let [key, value] of Object.entries(finalPayload)) {
//     //             formData.append(key, Array.isArray(value) ? JSON.stringify(value) : value);
//     //         }
//     //         if (finalPayload.image) {
//     //             formData.append('image', finalPayload.image[0]);
//     //         }

//     //         dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
//     //         const response = await apiCreateCategory(formData);
//     //         dispatch(showModal({ isShowModal: false }));

//     //         if (response.success) {
//     //             toast.success(response.message);
//     //             reset();
//     //             setPayload({});
//     //             setBrands([]); // Reset danh sách brand sau khi gửi thành công
//     //         } else {
//     //             toast.error(response.message);
//     //         }
//     //     }
//     // };
//     const handleCreateCategory = async (data) => {
//         console.log('Form Data Before Send:', data);

//         const finalPayload = { ...data, ...payload };

//         const formData = new FormData();
//         formData.append('title', finalPayload.title);

//         // Nếu brand là mảng, gửi từng item lên
//         if (Array.isArray(finalPayload.brand)) {
//             finalPayload.brand.forEach((b, index) => {
//                 formData.append(`brand[${index}]`, b);
//             });
//         } else {
//             formData.append('brand', finalPayload.brand);
//         }

//         if (finalPayload.image) {
//             formData.append('image', finalPayload.image[0]);
//         }

//         console.log('Final FormData:', [...formData.entries()]);

//         dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
//         const response = await apiCreateCategory(formData);
//         console.log('API Response:', response);
//         dispatch(showModal({ isShowModal: false, modalChildren: null }));

//         if (response.success) {
//             toast.success(response.message);
//             reset();
//             setPayload({ image: '' });
//         } else toast.error(response.message);
//     };

//     return (
//         <div className="w-full max-w-screen-xl mx-auto p-8 bg-gradient-to-r from-red-50 via-red-100 to-red-200 rounded-lg shadow-xl">
//             <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight border-b-4 border-red-600 pb-2">
//                 Create New Product Category
//             </h1>
//             <form onSubmit={handleSubmit(handleCreateCategory)} className="space-y-10">
//                 <InputForm
//                     label="Category Title"
//                     register={register}
//                     errors={errors}
//                     id="title"
//                     validate={{ required: 'This field is required' }}
//                     fullWidth
//                     placeholder="Enter name of new product"
//                     className="border border-gray-300 rounded-lg shadow-md p-4"
//                 />

//                 {/* Brand Input với Tag */}
//                 <div>
//                     <label className="block font-semibold text-gray-800 mb-2">Brand</label>
//                     <div className="flex flex-wrap gap-2 border border-gray-300 p-2 rounded-lg shadow-md">
//                         {brands.map((brand, index) => (
//                             <span
//                                 key={index}
//                                 className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm flex items-center gap-2"
//                             >
//                                 {brand}
//                                 <button
//                                     type="button"
//                                     className="text-red-700 hover:text-red-900"
//                                     onClick={() => removeBrand(brand)}
//                                 >
//                                     ✕
//                                 </button>
//                             </span>
//                         ))}
//                         <input
//                             type="text"
//                             placeholder="Enter brand and press Enter"
//                             onKeyDown={handleKeyDown}
//                             className="flex-1 border-none outline-none p-1"
//                         />
//                     </div>
//                 </div>

//                 {/* Image Upload */}
//                 <div className="flex flex-col gap-4">
//                     <label className="font-semibold text-gray-800">Upload Image</label>
//                     <input
//                         type="file"
//                         id="image"
//                         lang="en"
//                         {...register('image', { required: 'This field is required' })}
//                         className="border border-gray-300 rounded-lg p-4"
//                     />
//                     {errors.image && <small className="text-sm text-red-500">{errors.image.message}</small>}
//                 </div>

//                 {/* Preview Image */}
//                 {preview.image && (
//                     <div className="my-6 flex justify-center">
//                         <img
//                             src={preview.image}
//                             alt="image-category"
//                             className="w-[250px] h-[250px] object-contain border-4 border-red-300 rounded-lg shadow-md"
//                         />
//                     </div>
//                 )}

//                 {/* Submit Button */}
//                 <div className="mt-8 flex justify-center">
//                     <Button
//                         type="submit"
//                         className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transition-all duration-300"
//                     >
//                         Create New Product Category
//                     </Button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default CreateProductCategory;
