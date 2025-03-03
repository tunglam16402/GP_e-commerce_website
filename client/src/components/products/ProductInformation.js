import React, { memo, useState } from 'react';
import { productInFoTabs } from 'utils/constant';
import { renderStarFromNumber } from 'utils/helper';
import { apiRatings } from 'apis/product';
import { RateOption, RateBar, Button, Comments } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { showModal } from 'store/app/appSlice';
import Swal from 'sweetalert2';
import path from 'utils/path';
import { useNavigate } from 'react-router-dom';
import { apiGetUserOrders } from 'apis';

const ProductInformation = ({ totalRatings, ratings, nameProduct, pid, rerenderRateComment }) => {
    const [activedTab, setActivedTab] = useState(1);
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector((state) => state.user);

    const navigate = useNavigate();

    const handleSubmitRateAction = async ({ comment, star }) => {
        if (!comment || !pid || !star) {
            alert('Please rates product before click submit!');
            return;
        }
        await apiRatings({ star: star, comment: comment, pid, updatedAt: Date.now() });
        dispatch(showModal({ isShowModal: false, modalChildren: null }));
        rerenderRateComment();
    };

    //hanlde when clicked in Rate now button
    const handleRateNow = async () => {
        if (!isLoggedIn) {
            Swal.fire({
                text: 'Your must login first to Rate',
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Go login',
                title: 'Oops!',
                showCancelButton: true,
            }).then((response) => {
                if (response.isConfirmed) {
                    navigate(`/${path.AUTH}?redirect=${encodeURIComponent(window.location.pathname)}`);
                }
            });
        } else {
            try {
                const response = await apiGetUserOrders();
                console.log(response);
                // Kiểm tra xem sản phẩm có tồn tại trong lịch sử mua hàng hay không
                const hasPurchased = response?.orders?.some((order) =>
                    order.products?.some((product) => product.product === pid),
                );

                if (hasPurchased) {
                    dispatch(
                        showModal({
                            isShowModal: true,
                            modalChildren: (
                                <RateOption
                                    nameProduct={nameProduct}
                                    handleSubmitRateAction={handleSubmitRateAction}
                                ></RateOption>
                            ),
                        }),
                    );
                } else {
                    Swal.fire({
                        text: 'You need to purchase this product before rating!',
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                }
            } catch (error) {
                console.error('Error checking purchase history:', error);
                Swal.fire({
                    text: 'An error occurred. Please try again later!',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        }
    };

    return (
        <div>
            <div className="w-main m-auto mt-8 bg-white border px-4">
                <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main uppercase">
                    Customer reviews
                </h3>
                {
                    <div>
                        <div className="flex bg-white mt-8">
                            <div className="flex-4 flex flex-col justify-center items-center border">
                                <span className="font-semibold text-3xl mb-2">{`${totalRatings}/5`}</span>
                                <span className="flex items-center gap-1 mb-2">
                                    {renderStarFromNumber(totalRatings, 20)?.map((element, index) => (
                                        <span key={index}>{element}</span>
                                    ))}
                                </span>
                                <span className="">{`${ratings?.length} reviewers and commentors`}</span>
                            </div>
                            <div className="flex-6 border flex flex-col p-4 gap-2">
                                {Array.from(Array(5).keys())
                                    .reverse()
                                    .map((element) => (
                                        <RateBar
                                            key={element}
                                            number={element + 1}
                                            ratingsTotal={ratings?.length}
                                            ratingsCount={ratings?.filter((item) => item.star === element + 1)?.length}
                                        ></RateBar>
                                    ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-center p-4 text-sm flex-col gap-4">
                            <span>How do you rate this product?</span>
                            <Button handleOnclick={handleRateNow}>Rate now!</Button>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[20px] font-semibold py-2">Product Review:</span>
                            {ratings?.length > 0 ? (
                                ratings.map((element) => (
                                    <Comments
                                        key={element._id}
                                        image={element.postedBy?.avatar}
                                        name={`${element.postedBy?.lastname} ${element.postedBy?.firstname}`}
                                        star={element.star}
                                        updatedAt={element.updatedAt}
                                        comment={element.comment}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-500 text-lg mb-4 italic">This product has no reviews yet.</p>
                            )}
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default memo(ProductInformation);
