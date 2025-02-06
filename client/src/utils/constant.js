import icons from './icons';
import path from './path';

const {
    BsShieldShaded,
    FaTruck,
    HiGift,
    FaReply,
    FaTty,
    MdSpaceDashboard,
    RiBillLine,
    MdGroups2,
    FaProductHunt,
    IoCreate,
    FaStore,
    IoPersonCircle,
    MdFavorite,
    FaHistory,
    FaShoppingCart,
    IoMdHome,
    SiBrandfolder,
    MdCategory,
    PiFlagBannerFill,
    FaNewspaper,
    IoHomeSharp,
    RiCustomerService2Fill,
    FaServicestack,
    FaQuestion,
} = icons;

export const navigation = [
    {
        id: 1,
        value: 'HOME',
        path: `/${path.HOME}`,
        icon: <IoHomeSharp size={18} />,
    },
    {
        id: 2,
        value: 'PRODUCTS',
        path: `/${path.PRODUCTS}`,
        icon: <FaProductHunt size={18} />,
    },
    {
        id: 3,
        value: 'BLOGS',
        path: `/${path.BLOGS}`,
        icon: <FaNewspaper size={18} />,
    },
    {
        id: 4,
        value: 'OUR SERVICES',
        path: `/${path.OUR_SERVICES}`,
        icon: <FaServicestack size={18} />,
    },
    {
        id: 5,
        value: 'FAQs',
        path: `/${path.FAQS}`,
        icon: <FaQuestion size={18} />,
    },
    {
        id: 6,
        value: 'CONTACT',
        path: `/${path.CONTACT}`,
        icon: <RiCustomerService2Fill size={18} />,
    },
];

export const productExtraInformation = [
    { id: 1, title: 'Guarantee', sub: 'Quality checked', icon: <BsShieldShaded></BsShieldShaded> },
    { id: 2, title: 'Free Shipping', sub: 'Free on all products', icon: <FaTruck></FaTruck> },
    { id: 3, title: 'Special gift cards', sub: 'Special gift cards', icon: <HiGift></HiGift> },
    { id: 4, title: 'Free return', sub: 'Within 7 days', icon: <FaReply></FaReply> },
    { id: 5, title: 'Consultancy', sub: 'Lifetime 24/7/356', icon: <FaTty></FaTty> },
];

export const productInFoTabs = [
    {
        id: 1,
        name: 'DESCRIPTION',
        content: `Technology: No cellular connectivity
Dimensions: 46 x 46 x 11.4 mm
Weight: IPS LCD g
Display: AMOLED 1.56 inches
Resolution: 360 x 330
OS: Android Wear OS
Chipset: Snapdragon 400
CPU: Quad-core 1.2 GHz Cortex-A7
Internal: 4 GB, 512 MB RAM
Camera: No
A year after the first generation took the smartwatch world by storm with its timeless looks, it is time for the new Moto 360 to step up to the plate. The new iteration of Motorola's acclaimed Android Wear device arrives on the market with revamped design, highly customizable body in two sizes, a version designed for ladies, and a brand new Sport model.

Of course, in addition to new looks and levels of customizability, the new Moto 360 also features improved hardware over the first generation. The newcomer packs a more powerful Qualcomm Snapdragon 400 solution, sharper display, and bigger battery. Take a look at its key features below.`,
    },
    {
        id: 2,
        name: 'Warranty',
        content: `
        Warranty Information
        LIMITED WARRANTIES
Limited Warranties are non-transferable. The following Limited Warranties are given to the original retail purchaser of the following Ashley Furniture Industries, Inc.Products:

Frames Used In Upholstered and Leather Products
Limited Lifetime Warranty
A Limited Lifetime Warranty applies to all frames used in sofas, couches, love seats, upholstered chairs, ottomans, sectionals, and sleepers. Ashley Furniture Industries,Inc. warrants these components to you, the original retail purchaser, to be free from material manufacturing defects.`,
    },
    {
        id: 3,
        name: 'Delivery',
        content: `Purchasing & Delivery
Before you make your purchase, it’s helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.
Picking up at the store
Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser’s responsibility to make sure the correct items are picked up and in good condition.
Delivery
Customers are able to pick the next available delivery day that best fits their schedule. However, to route stops as efficiently as possible, Shopify Shop will provide the time frame. Customers will not be able to choose a time. You will be notified in advance of your scheduled time frame. Please make sure that a responsible adult (18 years or older) will be home at that time.
In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc. to prevent damages. Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team. Shopify Shop will deliver, assemble, and set-up your new furniture purchase and remove all packing materials from your home. Our delivery crews are not permitted to move your existing furniture or other household items. Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home. Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs. An elevator must be available for deliveries to the 4th floor and above.`,
    },
    {
        id: 4,
        name: 'payment',
        content: `Purchasing & Delivery
Before you make your purchase, it’s helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.
Picking up at the store
Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser’s responsibility to make sure the correct items are picked up and in good condition.
Delivery
Customers are able to pick the next available delivery day that best fits their schedule. However, to route stops as efficiently as possible, Shopify Shop will provide the time frame. Customers will not be able to choose a time. You will be notified in advance of your scheduled time frame. Please make sure that a responsible adult (18 years or older) will be home at that time.
In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc. to prevent damages. Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team. Shopify Shop will deliver, assemble, and set-up your new furniture purchase and remove all packing materials from your home. Our delivery crews are not permitted to move your existing furniture or other household items. Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home. Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs. An elevator must be available for deliveries to the 4th floor and above.`,
    },
];

export const colors = ['black', 'brown', 'gray', 'white', 'pink', 'yellow', 'orange', 'purple', 'green', 'blue'];

export const sorts = [
    {
        id: 1,
        value: '-sold',
        text: 'Best selling',
    },
    {
        id: 2,
        value: 'title',
        text: 'Alphabetically, A to Z',
    },
    {
        id: 3,
        value: '-title',
        text: 'Alphabetically, Z to A',
    },
    {
        id: 4,
        value: '-price',
        text: 'Price high to low',
    },
    {
        id: 5,
        value: 'price',
        text: 'Price low to high',
    },
    {
        id: 6,
        value: '-createAt',
        text: 'Date, new to old',
    },
    {
        id: 7,
        value: 'createAt',
        text: 'Date, old to new',
    },
];

export const rateOptions = [
    { id: 1, text: 'Terrible' },
    { id: 2, text: 'Bad' },
    { id: 3, text: 'Neutral' },
    { id: 4, text: 'Good' },
    { id: 5, text: 'Perfect' },
];

export const adminSidebar = [
    {
        id: 1,
        type: 'SINGLE',
        text: 'Dashboard',
        path: `/${path.ADMIN}/${path.DASHBOARD}`,
        icon: <MdSpaceDashboard size={20} />,
    },
    {
        id: 2,
        type: 'SINGLE',
        text: 'Manage Users',
        path: `/${path.ADMIN}/${path.MANAGE_USER}`,
        icon: <MdGroups2 size={20} />,
    },
    {
        id: 3,
        type: 'PARENT',
        text: 'Manage Products',
        icon: <FaStore size={20} />,
        submenu: [
            {
                text: 'Create Product',
                path: `/${path.ADMIN}/${path.CREATE_PRODUCTS}`,
                icon: <IoCreate size={20} />,
            },
            {
                text: 'Product List',
                path: `/${path.ADMIN}/${path.MANAGE_PRODUCTS}`,
                icon: <FaProductHunt size={20} />,
            },
        ],
    },
    {
        id: 4,
        type: 'SINGLE',
        text: 'Manage Orders',
        path: `/${path.ADMIN}/${path.MANAGE_ORDER}`,
        icon: <RiBillLine size={20} />,
    },
    {
        id: 5,
        type: 'PARENT',
        text: 'Manage product Category',
        icon: <MdCategory size={20} />,
        submenu: [
            {
                text: 'Create new Category',
                path: `/${path.ADMIN}/${path.CREATE_PRODUCT_CATEGORY}`,
                icon: <IoCreate size={20} />,
            },
            {
                text: 'Product Category List',
                path: `/${path.ADMIN}/${path.MANAGE_PRODUCT_CATEGORY}`,
                icon: <MdCategory size={20} />,
            },
        ],
    },
    {
        id: 6,
        type: 'PARENT',
        text: 'Manage Brand',
        icon: <SiBrandfolder size={20} />,
        submenu: [
            {
                text: 'Create new Brand',
                path: `/${path.ADMIN}/${path.CREATE_BRAND}`,
                icon: <IoCreate size={20} />,
            },
            {
                text: 'Brand List',
                path: `/${path.ADMIN}/${path.MANAGE_BRAND}`,
                icon: <SiBrandfolder size={20} />,
            },
        ],
    },
    {
        id: 7,
        type: 'PARENT',
        text: 'Manage Blog',
        icon: <FaNewspaper size={20} />,
        submenu: [
            {
                text: 'Create new Blog',
                path: `/${path.ADMIN}/${path.CREATE_BLOG}`,
                icon: <IoCreate size={20} />,
            },
            {
                text: 'Blog List',
                path: `/${path.ADMIN}/${path.MANAGE_BLOG}`,
                icon: <FaNewspaper size={20} />,
            },
        ],
    },
    {
        id: 8,
        type: 'PARENT',
        text: 'Manage Banner',
        icon: <PiFlagBannerFill size={20} />,
        submenu: [
            {
                text: 'Create new Banner',
                path: `/${path.ADMIN}/${path.CREATE_PRODUCTS}`,
                icon: <IoCreate size={20} />,
            },
            {
                text: 'Banner List',
                path: `/${path.ADMIN}/${path.MANAGE_PRODUCTS}`,
                icon: <PiFlagBannerFill size={20} />,
            },
        ],
    },
];

export const role = [
    {
        code: 2002,
        value: 'Admin',
    },
    {
        code: 2006,
        value: 'User',
    },
];

export const blockStatus = [
    {
        code: true,
        value: 'Blocked',
    },
    {
        code: false,
        value: 'Active',
    },
];

export const memberSidebar = [
    {
        id: 1,
        type: 'SINGLE',
        text: 'Personal',
        path: `/${path.MEMBER}/${path.PERSONAL}`,
        icon: <IoPersonCircle size={20} />,
    },
    {
        id: 2,
        type: 'SINGLE',
        text: 'My Cart',
        path: `/${path.MEMBER}/${path.MY_CART}`,
        icon: <FaShoppingCart size={20} />,
    },
    {
        id: 3,
        type: 'SINGLE',
        text: 'Wish List',
        path: `/${path.MEMBER}/${path.WISHLIST}`,
        icon: <MdFavorite size={20} />,
    },

    {
        id: 4,
        type: 'SINGLE',
        text: 'History Purchases',
        path: `/${path.MEMBER}/${path.HISTORY_BUY}`,
        icon: <FaHistory size={20} />,
    },
    {
        id: 5,
        type: 'SINGLE',
        text: 'Go to Homepage',
        path: `/`,
        icon: <IoMdHome size={20} />,
    },
];

export const statusOrders = [
    {
        label: 'Canceled',
        value: 'Canceled',
    },
    {
        label: 'Processing',
        value: 'Processing',
    },
    {
        label: 'Succeed',
        value: 'Succeed',
    },
];
