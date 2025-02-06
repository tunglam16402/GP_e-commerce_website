// ImageMagnifier.js
import React, { memo } from 'react';
import ReactImageMagnify from 'react-image-magnify';

const ImageMagnifier = ({ smallImageSrc, largeImageSrc }) => (
    <ReactImageMagnify
        {...{
            smallImage: {
                alt: 'Product Image',
                isFluidWidth: true,
                src: smallImageSrc,
            },
            largeImage: {
                src: largeImageSrc,
                width: 1200,
                height: 1800,
            },
        }}
    />
);

export default ImageMagnifier;
