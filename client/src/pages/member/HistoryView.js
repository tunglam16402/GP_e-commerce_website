import { Product } from 'components';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const HistoryView = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const viewedProducts = JSON.parse(localStorage.getItem('viewedProducts')) || [];
        setHistory(viewedProducts);
    }, []);

    return (
        <div className="absolute px-4 bg-gray-100 w-full">
            <header className="text-3xl font-semibold py-6 text-main border-b-4 border-main shadow-md">
                Recently Viewed Products
            </header>
            <div className="p-6 w-full flex flex-wrap gap-8 justify-start mt-8">
                {history.length > 0 ? (
                    history.map((product) => (
                        <div key={product._id} className="w-[284px]">
                            <Product
                                pid={product._id}
                                productData={product}
                                className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-main transform hover:scale-105 flex flex-col p-4 gap-4 border border-gray-200"
                            />
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-lg">No recently viewed products</p>
                )}
            </div>
        </div>
    );
};

export default HistoryView;
