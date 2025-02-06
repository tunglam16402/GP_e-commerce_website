import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { createSearchParams, data, useParams } from 'react-router-dom';
import { apiGetDetailProducts, apiGetProducts, apiUpdateCart } from '../../apis';
import {
    Breadcrumbs,
    Button,
    SelectQuantity,
    ProductExtraInfoItem,
    ImageMagnifier,
    ProductInformation,
    CustomSlider,
} from '../../components';
import Slider from 'react-slick';
import { formatMoney, formatPrice, renderStarFromNumber } from '../../utils/helper';
import { productExtraInformation } from '../../utils/constant';
import DOMPurify from 'dompurify';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import withBaseComponent from 'hocs/withBaseComponent';
import Swal from 'sweetalert2';
import path from 'utils/path';
import { getCurrent } from 'store/users/asyncAction';

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
};

const DetailProduct = ({ isQuickView, data, dispatch, navigate, location }) => {
    const params = useParams();
    const titleRef = useRef();
    const { current } = useSelector((state) => state.user);
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [updateRate, setUpdateRate] = useState(false);
    const [variant, setVariant] = useState(null);
    const [pid, setPid] = useState(null);
    const [category, setCategory] = useState(null);
    const [currentProduct, setCurrentProduct] = useState({
        title: '',
        thumb: '',
        images: [],
        price: '',
        color: '',
    });

    //handle show quick view
    useEffect(() => {
        if (data) {
            setPid(data.pid);
            setCategory(data.category);
        } else if (params && params.pid) {
            setPid(params.pid);
            setCategory(params.category);
        }
    }, [data, params]);
    console.log(data);

    const fetchProductData = async () => {
        const response = await apiGetDetailProducts(pid);
        if (response.success) {
            setProduct(response.productData);
            setCurrentImage(response.productData?.thumb);
        }
    };

    const fetchProduct = async () => {
        const response = await apiGetProducts({ category });
        if (response.success) {
            setRelatedProducts(response.products);
        }
    };

    useEffect(() => {
        if (variant) {
            setCurrentProduct({
                title: product?.variants?.find((element) => element.sku === variant)?.title,
                color: product?.variants?.find((element) => element.sku === variant)?.color,
                images: product?.variants?.find((element) => element.sku === variant)?.images,
                price: product?.variants?.find((element) => element.sku === variant)?.price,
                thumb: product?.variants?.find((element) => element.sku === variant)?.thumb,
            });
        } else {
            setCurrentProduct({
                title: product?.title,
                color: product?.color,
                images: product?.images || [],
                price: product?.price,
                thumb: product?.thumb,
            });
        }
    }, [variant]);

    useEffect(() => {
        if (pid) {
            fetchProductData();
            fetchProduct();
        }
        titleRef.current?.scrollIntoView({ block: 'start' });
    }, [pid]);
    //handle after submit rate product
    useEffect(() => {
        if (pid) {
            fetchProductData();
        }
    }, [updateRate]);

    const rerenderRateComment = useCallback(() => {
        setUpdateRate(!updateRate);
    }, [updateRate]);

    const handleQuantity = useCallback(
        (number) => {
            if (!Number(number) || Number(number) < 1) {
                return;
            } else {
                setQuantity(number);
            }
        },
        [quantity],
    );

    const handleChangeQuantity = useCallback(
        (flag) => {
            if (flag === 'minus' && quantity === 1) return;
            if (flag === 'minus') setQuantity((prev) => +prev - 1);
            if (flag === 'plus') setQuantity((prev) => +prev + 1);
            if (quantity === product?.quantity) {
                setQuantity(null);
            }
        },
        [quantity],
    );

    const handleClickSmallImage = (e, element) => {
        e.stopPropagation();
        setCurrentImage(element);
    };

    const handleAddToCart = async () => {
        if (!current) {
            Swal.fire({
                title: 'Almost...',
                text: 'Your must login first to buy this',
                cancelButtonText: 'Not now',
                confirmButtonText: 'Go login',
                icon: 'info',
                showCancelButton: true,
            }).then(async (response) => {
                if (response.isConfirmed) {
                    navigate({
                        pathname: `/${path.AUTH}`,
                        search: createSearchParams({ redirect: location.pathname }).toString(),
                    });
                }
            });
        }
        const response = await apiUpdateCart({
            pid,
            color: currentProduct.color || product?.color,
            quantity,
            price: currentProduct.price || product.price,
            thumb: currentProduct.thumb || product.thumb,
            title: currentProduct.title || product.title,
        });
        if (response.success) {
            toast.success(response.message);
            dispatch(getCurrent());
        } else toast.error(response.message);
    };

    return (
        <div className="w-full">
            {!isQuickView && (
                <div className="h-[81px] flex flex-col justify-center items-center bg-gray-100">
                    <div ref={titleRef} className=" w-main">
                        <h3 className="font-semibold text-[22px]">{currentProduct.title || product?.title}</h3>
                        <Breadcrumbs title={currentProduct.title || product?.title} category={category}></Breadcrumbs>
                    </div>
                </div>
            )}
            <div
                onClick={(e) => e.stopPropagation()}
                className={clsx(
                    'w-main m-auto mt-6 flex bg-white',
                    isQuickView ? 'max-w-[900px] gap-36 p-6 max-h-[100vh] overflow-y-auto' : 'w-main ',
                )}
            >
                <div className="w-2/5 flex flex-col gap-4 ">
                    <div className="w-[458px] h-[458px] border object-cover flex items-center z-50 ">
                        {product && (
                            <ImageMagnifier
                                smallImageSrc={currentProduct.thumb || currentImage}
                                largeImageSrc={currentProduct.thumb || currentImage}
                            />
                        )}
                    </div>
                    <div className="w-[458px]">
                        <Slider {...settings} className="image_slider">
                            {currentProduct.images.length === 0 &&
                                product?.images?.map((element) => (
                                    <div key={element} className="flex w-full gap-2">
                                        <img
                                            src={element}
                                            alt="sub_product_img"
                                            className="w-[143px] h-[143px] border object-cover"
                                            onClick={(e) => handleClickSmallImage(e, element)}
                                        ></img>
                                    </div>
                                ))}
                            {currentProduct.images.length > 0 &&
                                currentProduct.images?.map((element) => (
                                    <div key={element} className="flex w-full gap-2">
                                        <img
                                            src={element}
                                            alt="sub_product_img"
                                            className="w-[143px] h-[143px] border object-cover"
                                            onClick={(e) => handleClickSmallImage(e, element)}
                                        ></img>
                                    </div>
                                ))}
                        </Slider>
                    </div>
                </div>
                <div className={clsx('w-2/5 pr-[24px] flex flex-col gap-4', isQuickView && 'w-1/2')}>
                    <div className="flex items-center justify-between">
                        <h2 className="text-[34px] font-semibold text-gray-700">{`${formatMoney(
                            formatPrice(currentProduct.price || product?.price),
                        )} VND`}</h2>
                    </div>
                    <div className="flex items-center">
                        {renderStarFromNumber(product?.totalRatings, 18)?.map((element, index) => (
                            <span key={index}>{element}</span>
                        ))}
                        <span className="text-sm text-main italic ml-4">{`Sold: ${product?.sold} products`}</span>
                    </div>
                    <ul className=" text-[16px] list-square text-gray-500 pl-6">
                        {product?.description?.length > 1 &&
                            product?.description?.map((element) => (
                                <li className="leading-6" key={element}>
                                    {element}
                                </li>
                            ))}
                        {product?.description?.length === 1 && (
                            <div
                                className="line-clamp-[10] mb-8 "
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product?.description[0]) }}
                            ></div>
                        )}
                    </ul>
                    <div className="my-4 flex items-center gap-4">
                        <span className="font-bold">Color:</span>
                        <div className="flex flex-wrap gap-4 items-center w-full cursor-pointer">
                            <div
                                onClick={() => setVariant(null)}
                                className={clsx(
                                    'flex items-center gap-2 p-1 border cursor-pointer',
                                    !variant && 'border-main',
                                )}
                            >
                                <img
                                    src={product?.thumb}
                                    alt="thumb"
                                    className="w-16 h-16 rounded-md object-cover"
                                ></img>
                                <div className="flex flex-col">
                                    <span>{product?.color}</span>
                                    <span>{`${product?.price}VND`}</span>
                                </div>
                            </div>
                            {product?.variants?.map((element) => (
                                <div
                                    key={element.sku}
                                    onClick={() => setVariant(element.sku)}
                                    className={clsx(
                                        'flex items-center gap-2 p-1 border cursor-pointer',
                                        variant === element.sku && 'border-main',
                                    )}
                                >
                                    <img
                                        src={element?.thumb}
                                        alt="thumb"
                                        className="w-16 h-16 rounded-md object-cover"
                                    ></img>
                                    <div className="flex flex-col">
                                        <span>{element?.color}</span>
                                        <span>{`${element?.price}VND`}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-8 mt-4">
                        <div className="flex items-center">
                            <span className="text-[16px] pr-8 font-bold">Quantity:</span>
                            <SelectQuantity
                                quantity={quantity}
                                handleQuantity={handleQuantity}
                                handleChangeQuantity={handleChangeQuantity}
                            ></SelectQuantity>
                            <span className="text-sm text-main ml-8">{`Products available: ${product?.quantity}`}</span>
                        </div>
                        <Button handleOnclick={handleAddToCart} fullWidth>
                            Add to cart
                        </Button>
                    </div>
                </div>
                {!isQuickView && (
                    <div className="w-1/5 ">
                        {productExtraInformation.map((element) => (
                            <ProductExtraInfoItem
                                key={element.id}
                                title={element.title}
                                icon={element.icon}
                                sub={element.sub}
                            ></ProductExtraInfoItem>
                        ))}
                    </div>
                )}
            </div>
            {!isQuickView && (
                <div className="w-main m-auto mt-8">
                    <ProductInformation
                        totalRatings={product?.totalRatings}
                        ratings={product?.ratings}
                        nameProduct={product?.title}
                        pid={product?._id}
                        rerenderRateComment={rerenderRateComment}
                    ></ProductInformation>
                </div>
            )}
            {!isQuickView && (
                <div className="w-main m-auto mt-8">
                    <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main uppercase">
                        Other also like
                    </h3>
                    <CustomSlider normal={true} products={relatedProducts}></CustomSlider>
                </div>
            )}
        </div>
    );
};

export default withBaseComponent(memo(DetailProduct));
