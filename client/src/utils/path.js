const path = {
    //Public path
    PUBLIC: '/',
    HOME: '',
    ALL: '*',
    AUTH: 'authentication',
    REGISTER: 'register',
    PRODUCTS__CATEGORY: ':category',
    BLOGS: 'blogs',
    OUR_SERVICES: 'services',
    FAQS: 'faqs',
    CONTACT: 'contact',
    DETAIL_PRODUCT__CATEGORY__PID__TITLE: ':category/:pid/:title',
    FINAL_REGISTER: 'finalRegister/:status',
    RESET_PASSWORD: 'resetpassword/:token',
    DETAIL_CART: 'my-cart',
    PRODUCTS: 'products',
    DETAIL_BLOGS: 'blog/:bid/:title',

    //Admin path
    ADMIN: 'admin',
    DASHBOARD: 'dashboard',
    MANAGE_USER: 'manage-users',
    MANAGE_PRODUCTS: 'manage-products',
    MANAGE_ORDER: 'manage-orders',
    CREATE_PRODUCTS: 'create-products',
    MANAGE_BRAND: 'manage-brand',
    CREATE_BRAND: 'create-brand',
    MANAGE_PRODUCT_CATEGORY: 'manage-product-category',
    CREATE_PRODUCT_CATEGORY: 'create-product-category',
    CREATE_BLOG: 'create-blog',
    MANAGE_BLOG: 'manage-blog',
    MANAGE_STOCK: 'manage-stock',

    //Member path
    MEMBER: 'member',
    PERSONAL: 'personal',
    HISTORY_VIEW: 'history-view',
    WISHLIST: 'wishlist',
    HISTORY_BUY: 'history-buy',
    CHANGE_PASSWORD: 'change-password',
    CHECKOUT: 'checkout',
    PURCHASEINVOICE: 'purchase-invoice',
};

export default path;
