import React, { memo } from 'react';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { BlogCard, Product } from 'components';

//setting cho slider
// const settings = {
//     dots: false,
//     infinite: true,
//     speed: 500,
//     slidesToShow,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
// };

const CustomSlider = ({ products, activedTab, normal, slidesToShow = 3, blogs }) => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };
    return (
        <>
            {products && (
                <Slider {...settings} className="custom_slider my-8">
                    {products?.map((element, index) => (
                        <Product
                            key={index}
                            pid={element._id}
                            productData={element}
                            isNew={activedTab === 1 ? false : true}
                            normal={normal}
                        ></Product>
                    ))}
                </Slider>
            )}
            {blogs && (
                <Slider {...settings} className="custom_slider ">
                    {blogs?.map((element) => (
                        <BlogCard
                            key={element.id}
                            bid={element.id}
                            title={element.title}
                            description={element.description}
                            author={element.author}
                            images={element.images}
                            likes={element.likes}
                            dislikes={element.dislikes}
                            createdAt={element.createdAt}
                            numberViews={element.numberViews}
                        />
                    ))}
                </Slider>
            )}
        </>
    );
};

export default memo(CustomSlider);
