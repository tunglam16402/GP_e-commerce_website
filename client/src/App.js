import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import {
    Authentication,
    Home,
    Public,
    Products,
    Services,
    DetailProduct,
    Blogs,
    FAQs,
    FinalRegister,
    ResetPassword,
    DetailCart,
    DetailBlog,
    Contact,
} from 'pages/public';
import {
    AdminLayout,
    ManageOrders,
    ManageProducts,
    ManageUsers,
    Dashboard,
    CreateProducts,
    ManageBrand,
    CreateBrand,
    ManageBlog,
    CreateBlog,
    ManageProductCategory,
    CreateProductCategory,
    StockManagement,
} from 'pages/admin';
import {
    MemberLayout,
    Personal,
    HistoryBuy,
    WishList,
    CheckOut,
    HistoryView,
    ChangePassword,
    PurchaseInvoice,
} from 'pages/member';
import path from 'utils/path';
import { getCategories } from 'store/app/asyncAction';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ScrollToTop, Modal, Cart, Chatbot } from 'components';
import { showCart } from 'store/app/appSlice';
import './i18n'; // Import cấu hình i18n

function App() {
    const dispatch = useDispatch();
    const [isShowModal, modalChildren, isShowCart] = useSelector((state) => [
        state.app.isShowModal,
        state.app.modalChildren,
        state.app.isShowCart,
    ]);
    useEffect(() => {
        dispatch(getCategories());
    }, []);
    return (
        <div className=" font-main relative h-screen">
            <ScrollToTop />
            {isShowCart && (
                <div onClick={() => dispatch(showCart())} className="absolute inset-0 bg-overlay z-50 flex justify-end">
                    <Cart />
                </div>
            )}
            {isShowModal && <Modal>{modalChildren}</Modal>}
            <Routes>
                <Route path={path.PUBLIC} element={<Public />}>
                    <Route path={path.HOME} element={<Home />}></Route>
                    <Route path={path.PRODUCTS__CATEGORY} element={<Products />}></Route>
                    <Route path={path.BLOGS} element={<Blogs />}></Route>
                    <Route path={path.DETAIL_PRODUCT__CATEGORY__PID__TITLE} element={<DetailProduct />}></Route>
                    <Route path={path.OUR_SERVICES} element={<Services />}></Route>
                    <Route path={path.FAQS} element={<FAQs />}></Route>
                    <Route path={path.CONTACT} element={<Contact />}></Route>
                    <Route path={path.RESET_PASSWORD} element={<ResetPassword />}></Route>
                    <Route path={path.FINAL_REGISTER} element={<FinalRegister />}></Route>
                    <Route path={path.DETAIL_CART} element={<DetailCart />}></Route>
                    <Route path={path.CHECKOUT} element={<CheckOut />}></Route>
                    <Route path={path.PURCHASEINVOICE} element={<PurchaseInvoice />}></Route>
                    <Route path={path.DETAIL_BLOGS} element={<DetailBlog />}></Route>
                    <Route path={path.AUTH} element={<Authentication />}></Route>
                    <Route path={path.ALL} element={<Home />}></Route>
                </Route>
                <Route path={path.ADMIN} element={<AdminLayout />}>
                    <Route path={path.DASHBOARD} element={<Dashboard />}></Route>
                    <Route path={path.MANAGE_USER} element={<ManageUsers />}></Route>
                    <Route path={path.MANAGE_PRODUCTS} element={<ManageProducts />}></Route>
                    <Route path={path.MANAGE_BRAND} element={<ManageBrand />}></Route>
                    <Route path={path.MANAGE_PRODUCT_CATEGORY} element={<ManageProductCategory />}></Route>
                    <Route path={path.MANAGE_BLOG} element={<ManageBlog />}></Route>
                    <Route path={path.MANAGE_ORDER} element={<ManageOrders />}></Route>
                    <Route path={path.MANAGE_STOCK} element={<StockManagement />}></Route>
                    <Route path={path.CREATE_PRODUCTS} element={<CreateProducts />}></Route>
                    <Route path={path.CREATE_BRAND} element={<CreateBrand />}></Route>
                    <Route path={path.CREATE_PRODUCT_CATEGORY} element={<CreateProductCategory />}></Route>
                    <Route path={path.CREATE_BLOG} element={<CreateBlog />}></Route>
                </Route>
                <Route path={path.MEMBER} element={<MemberLayout />}>
                    <Route path={path.PERSONAL} element={<Personal />}></Route>
                    <Route path={path.HISTORY_VIEW} element={<HistoryView />}></Route>
                    <Route path={path.WISHLIST} element={<WishList />}></Route>
                    <Route path={path.HISTORY_BUY} element={<HistoryBuy />}></Route>
                    <Route path={path.CHANGE_PASSWORD} element={<ChangePassword />}></Route>
                </Route>
            </Routes>
            <Chatbot />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                // transition={Bounce}
            />
        </div>
    );
}

export default App;
