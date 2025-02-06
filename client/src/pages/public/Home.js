import { React } from 'react';
import {
    Sidebar,
    Banner,
    BestSeller,
    DealDaily,
    FeatureProducts,
    CustomSlider,
    Chatbot,
    ProductHomePage,
    BlogList,
} from 'components';
import { useSelector } from 'react-redux';
import icons from '../../utils/icons';
import withBaseComponent from 'hocs/withBaseComponent';
import { createSearchParams } from 'react-router-dom';

const { IoIosArrowForward } = icons;

const Home = ({ navigate }) => {
    const { newProducts } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.app);

    return (
        <div className='bg-white'>
            <div className="w-main flex ">
                <div className="flex flex-col gap-5 w-[25%] flex-auto ">
                    <Sidebar></Sidebar>
                    <DealDaily></DealDaily>
                </div>
                <div className="flex flex-col gap-5 pl-5 w-[75%] flex-auto ">
                    <Banner></Banner>
                    {/* <BestSeller></BestSeller> */}
                </div>
            </div>
            <div className="mt-8">
                <ProductHomePage />
            </div>
            <div className="mt-8">
                <FeatureProducts></FeatureProducts>
            </div>
            <div className="mt-8 w-main">
                <h3 className="text-4xl font-semibold text-gray-900 py-6 border-b-4 border-main uppercase tracking-widest">
                    new arrivals
                </h3>
                <div className=" mt-4 mx-[-10px] ">
                    <CustomSlider products={newProducts} slidesToShow={4}></CustomSlider>
                </div>
            </div>
            <div className="w-main">
                <h3 className="text-4xl font-semibold text-gray-900 py-6 border-b-4 border-main uppercase tracking-widest">
                     hot collections
                </h3>
                <div className="flex flex-wrap gap-6 mt-6">
                    {categories
                        ?.filter((element) => element.brand.length > 0)
                        ?.map((element) => (
                            <div
                                key={element._id}
                                className="w-[390px] bg-white shadow-xl rounded-lg overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#6C757D]"
                            >
                                <div className="flex p-6 gap-6 items-center hover:bg-gray-100 transition-all duration-300 rounded-lg">
                                    <img
                                        src={element?.image}
                                        alt={element?.title}
                                        className="w-[144px] h-[129px] object-cover rounded-lg border-2 border-transparent hover:border-main transition-all"
                                    />
                                    <div className="flex-1 text-gray-700">
                                        <h4 className="font-semibold text-lg mb-3 text-gray-800 hover:text-main transition-all duration-200">
                                            {element?.title}
                                        </h4>
                                        <ul className="space-y-2">
                                            {element?.brand?.map((item, index) => (
                                                <li
                                                    key={index}
                                                    onClick={() =>
                                                        navigate({
                                                            pathname: `/${element.title}`,
                                                            search: createSearchParams({ brand: item }).toString(),
                                                        })
                                                    }
                                                    className="flex gap-2 cursor-pointer hover:text-main hover:underline items-center text-gray-600 mb-2 transition-colors duration-200"
                                                >
                                                    <IoIosArrowForward />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <div className="my-8 w-main">
                <h3 className="text-4xl font-semibold text-gray-900 py-6 border-b-4 border-main uppercase tracking-widest">
                    blog posts
                </h3>
                <BlogList />
            </div>
        </div>
    );
};

export default withBaseComponent(Home);
