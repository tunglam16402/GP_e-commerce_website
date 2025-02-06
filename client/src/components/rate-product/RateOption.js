import React, { memo, useRef, useEffect, useState } from 'react';
import logo from 'assets/img/logo.png';
import { rateOptions } from 'utils/constant';
import { AiFillStar } from 'react-icons/ai';
import { Button } from 'components';

const RateOption = ({ nameProduct, handleSubmitRateAction }) => {
    const modalRef = useRef();
    const [chosenStar, setChosenStar] = useState(null);
    const [comment, setComment] = useState('');
    const [star, setStar] = useState(null);

    //handle content appeare in the middle of the screen
    useEffect(() => {
        modalRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
    return (
        <div
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
            className="bg-white w-[700px] p-4  gap-4 flex flex-col items-center justify-center"
        >
            <img src={logo} alt="Logo" className="w-[300] my-8 object-contain"></img>
            <h2 className="text-center text-medium text-lg">{`Rating product ${nameProduct}`}</h2>
            <textarea
                placeholder="Type something"
                className="form-textarea h-[160px] w-full placeholder:italic placeholder:text-gray-500"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <div className="w-full flex flex-col gap-4">
                <p>How do you feel about this product?</p>
                <div className="flex items-center justify-center gap-4">
                    {rateOptions.map((element) => (
                        <div
                            key={element.id}
                            className="w-[100px] h-[100px] bg-gray-200 hover:bg-gray-300 cursor-pointer rounded-md flex items-center justify-center flex-col gap-2"
                            onClick={() => {
                                setChosenStar(element.id);
                                setStar(element.id);
                            }}
                        >
                            {Number(chosenStar) && chosenStar >= element.id ? (
                                <AiFillStar color="orange" size={32}></AiFillStar>
                            ) : (
                                <AiFillStar color="gray" size={32}></AiFillStar>
                            )}
                            <span>{element.text}</span>
                        </div>
                    ))}
                </div>
            </div>
            <Button handleOnclick={() => handleSubmitRateAction({ comment, star })} fullWidth>
                Submit
            </Button>
        </div>
    );
};

export default memo(RateOption);
