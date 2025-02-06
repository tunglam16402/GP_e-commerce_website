import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { memo } from 'react';

const Banner = () => {
    const images = [
        'https://cdn.pixabay.com/photo/2021/03/19/13/40/online-6107598_1280.png',
        'https://c8.alamy.com/comp/2G780NF/online-shopping-horizontal-banner-with-editable-text-more-button-and-female-character-in-front-of-bags-vector-illustration-2G780NF.jpg',
        'https://static.vecteezy.com/system/resources/previews/001/750/369/large_2x/online-shopping-and-e-commerce-banner-vector.jpg',
        'https://ad2cart.com/wp-content/uploads/2021/02/ecommerce-website-banners.jpg',
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        fade: true,
        cssEase: 'linear',
    };

    return (
        <div className="w-full">
            <Slider {...settings}>
                {images.map((image, index) => (
                    <div key={index}>
                        <img src={image} alt={`Banner ${index}`} className="h-[404px] w-full object-cover" />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default memo(Banner);
