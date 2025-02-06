/* eslint-disable jsx-a11y/heading-has-content */
import { Breadcrumbs, Button, OrderItem } from 'components';
import withBaseComponent from 'hocs/withBaseComponent';
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { createSearchParams } from 'react-router-dom';
import { useSearchParam } from 'react-use';
import Swal from 'sweetalert2';
import { formatMoney } from 'utils/helper';
import path from 'utils/path';

const DetailCart = ({ location, navigate }) => {
    const { currentCart, current } = useSelector((state) => state.user);
    const handleSubmit = () => {
        if (!current?.address) {
            return Swal.fire({
                title: 'Almost...',
                text: 'Please update your address before checkout!',
                cancelButtonText: 'Not now',
                confirmButtonText: 'Go update',
                icon: 'info',
                showCancelButton: true,
            }).then((rs) => {
                if (rs.isConfirmed) {
                    navigate({
                        pathname: `/${path.MEMBER}/${path.PERSONAL}`,
                        search: createSearchParams({ redirect: location.pathname }).toString(),
                    });
                }
            });
        } else {
            window.open(`/${path.CHECKOUT}`, '_blank');
        }
    };
    console.log(location.pathname);

    return (
        <div className="w-full">
            <div className="h-[81px] flex flex-col justify-center items-center bg-gray-100">
                <div className=" w-main">
                    <h3 className="font-semibold text-[22px] uppercase">Cart</h3>
                    <Breadcrumbs category={location?.path}></Breadcrumbs>
                </div>
            </div>
            <div className="w-main mx-auto font-bold my-8 border py-3 grid grid-cols-10">
                <span className="col-span-6 w-full text-center uppercase text-lg font-semibold">Product</span>
                <span className="col-span-1 w-full text-center uppercase text-lg font-semibold">Quantity</span>
                <span className="col-span-3 w-full text-center uppercase text-lg font-semibold">Price</span>
            </div>
            <div className="border flex flex-col w-main mx-auto my-8">
                {currentCart?.map((el) => (
                    <OrderItem
                        key={el._id}
                        // el={el?.product}
                        defaultQuantity={el.quantity}
                        color={el.color}
                        title={el.title}
                        thumb={el.thumb}
                        price={el.price}
                        pid={el.product?._id}
                    />
                ))}
            </div>
            <div className="w-main mx-auto flex flex-col mb-12 justify-center items-end gap-3">
                <span className="flex items-center gap-8">
                    <span className="text-[20px]">Subtotal:</span>
                    <span className="text-main text-2xl font-semibold">{`${formatMoney(
                        currentCart?.reduce((sum, el) => +el?.price * el?.quantity + sum, 0),
                    )} VND`}</span>
                </span>
                <span className="text-gray-700 italic">Shipping, taxes, and discounts calculated at checkout</span>
                <Button handleOnclick={handleSubmit}>Check Out</Button>
            </div>
        </div>
    );
};

export default withBaseComponent(memo(DetailCart));
