const express = require('express');
const { WebhookClient, Payload } = require('dialogflow-fulfillment');
const router = express.Router();
const Product = require('../models/productModel'); // Đường dẫn tới model sản phẩm của bạn
const Order = require('../models/orderModel'); // Đường dẫn tới model sản phẩm của bạn
const asyncHandler = require('express-async-handler');

router.post('/', async (req, res) => {
    // console.log('Request received:', req.body);
    const agent = new WebhookClient({ request: req, response: res });

    // Hàm xử lý truy vấn sản phẩm theo màu
    const handleProductQuery = async (agent) => {
        const color = agent.parameters.color && agent.parameters.color[0] ? agent.parameters.color[0] : 'default';
        try {
            // Truy vấn sản phẩm từ database
            const products = await Product.find({ color }).limit(4).lean();

            if (!products.length) {
                agent.add(`Sorry, we couldn't find any ${color} products.`);
                return;
            }

            agent.add(`Here are some best-selling products in ${color}:`);
            // Tạo payload để gửi về Dialogflow

            const payloadJson = {
                richContent: [
                    products.map((product) => ({
                        type: 'info',
                        title: product.title,
                        subtitle: `${product.price} VNĐ` || 'Click to view details',
                        image: {
                            src: {
                                rawUrl: product.thumb || 'https://via.placeholder.com/150',
                            },
                        },
                        actionLink: `http://localhost:3000/${product.category}/${product._id}/${encodeURIComponent(
                            product.title,
                        )}`,
                    })),
                ],
            };

            // console.log('Payload JSON:', JSON.stringify(payloadJson, null, 2));
            // console.debug('Generated payload:', payloadJson);

            // Gửi payload về cho Dialogflow
            // agent.add(new Payload(agent.UNSPECIFIED, payloadJson, { sendAsMessage: true, rawPayload: true }));
            agent.add(new Payload('UNSPECIFIED', payloadJson, { sendAsMessage: true, rawPayload: true }));
        } catch (error) {
            console.error('Error fetching products:', error);
            agent.add('An error occurred while fetching products. Please try again.');
        }
    };

    const handleBestSellingProducts = asyncHandler(async (agent) => {
        // Query the best-selling products (assuming the sales count is stored in the "sold" field)
        const products = await Product.find().sort({ sold: -1 }).limit(4).lean();

        if (!products.length) {
            agent.add(`Currently, there are no recorded best-selling products.`);
            return;
        }

        agent.add(`Here are some of the top-selling products:`);

        // Create a payload to send to Dialogflow
        const payloadJson = {
            richContent: [
                products.map((product) => ({
                    type: 'info',
                    title: product.title,
                    subtitle: `Sold: ${product.sold} units - Price: ${product.price} VNĐ`,
                    image: {
                        src: {
                            rawUrl: product.thumb || 'https://via.placeholder.com/150',
                        },
                    },
                    actionLink: `http://localhost:3000/${product.category}/${product._id}/${encodeURIComponent(
                        product.title,
                    )}`,
                })),
            ],
        };

        // console.log('Best Selling Payload:', JSON.stringify(payloadJson, null, 2));

        // Send the payload to Dialogflow
        agent.add(new Payload('UNSPECIFIED', payloadJson, { sendAsMessage: true, rawPayload: true }));
    });

    const handleNewArrivals = asyncHandler(async (agent) => {
        // Query the newest products, sorted by createdAt in descending order
        const products = await Product.find().sort({ createdAt: -1 }).limit(4).lean();

        if (!products.length) {
            agent.add(`Currently, there are no new products available.`);
            return;
        }

        agent.add(`Here are some of the latest products:`);

        // Create a payload to send to Dialogflow
        const payloadJson = {
            richContent: [
                products.map((product) => ({
                    type: 'info',
                    title: product.title,
                    subtitle: `Price: ${product.price} VNĐ`,
                    image: {
                        src: {
                            rawUrl: product.thumb || 'https://via.placeholder.com/150',
                        },
                    },
                    actionLink: `http://localhost:3000/${product.category}/${product._id}/${encodeURIComponent(
                        product.title,
                    )}`,
                })),
            ],
        };

        // console.log('New Arrivals Payload:', JSON.stringify(payloadJson, null, 2));

        // Send the payload to Dialogflow
        agent.add(new Payload('UNSPECIFIED', payloadJson, { sendAsMessage: true, rawPayload: true }));
    });

    //chat sản phẩm bán chạy nhất theo thể loại

    // const handleNewArrivalsByCategory = asyncHandler(async (agent) => {
    //     let category = agent.parameters.category || 'all';

    //     // Chuyển đổi category thành chữ hoa đầu (ví dụ: "phone" -> "Phone")
    //     const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    //     category = category !== 'all' ? capitalize(category) : 'all';

    //     console.log('Category after normalization:', category);

    //     // Lấy danh sách category từ DB để kiểm tra
    //     const availableCategories = await Product.distinct('category');

    //     if (!availableCategories.includes(category) && category !== 'all') {
    //         agent.add(`Sorry, we couldn't find any products in the "${category}" category.`);
    //         return;
    //     }

    //     // Query sản phẩm mới nhất theo category
    //     const filter = category !== 'all' ? { category } : {};
    //     const products = await Product.find(filter).sort({ createdAt: -1 }).limit(4).lean();

    //     if (!products.length) {
    //         agent.add(`There are no new ${category} products available at the moment.`);
    //         return;
    //     }

    //     agent.add(`Here are the latest ${category} products:`);

    //     // Tạo payload gửi về Dialogflow
    //     const payloadJson = {
    //         richContent: [
    //             products.map((product) => ({
    //                 type: 'info',
    //                 title: product.title,
    //                 subtitle: `Price: ${product.price} VNĐ`,
    //                 image: {
    //                     src: {
    //                         rawUrl: product.thumb || 'https://via.placeholder.com/150',
    //                     },
    //                 },
    //                 actionLink: `http://localhost:3000/${product.category}/${product._id}/${encodeURIComponent(
    //                     product.title,
    //                 )}`,
    //             })),
    //         ],
    //     };

    //     console.log('New Arrivals by Category Payload:', JSON.stringify(payloadJson, null, 2));

    //     // Gửi payload về Dialogflow
    //     agent.add(new Payload('UNSPECIFIED', payloadJson, { sendAsMessage: true, rawPayload: true }));
    // });
    // const handleNewArrivalsByCategory = asyncHandler(async (agent) => {
    //     let category = agent.parameters.category || 'all';

    //     // Đảm bảo category là string
    //     if (Array.isArray(category)) {
    //         category = category[0]; // Lấy giá trị đầu tiên nếu là mảng
    //     }
    //     if (typeof category !== 'string') {
    //         console.error('Invalid category type:', category);
    //         category = 'all'; // Mặc định nếu không hợp lệ
    //     }

    //     // Chuyển đổi category thành chữ hoa đầu
    //     const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    //     category = category !== 'all' ? capitalize(category) : 'all';

    //     console.log('Category after normalization:', category);

    //     // Lấy danh sách category từ DB để kiểm tra
    //     const availableCategories = await Product.distinct('category');

    //     if (!availableCategories.includes(category) && category !== 'all') {
    //         agent.add(`Sorry, we couldn't find any products in the "${category}" category.`);
    //         return;
    //     }

    //     // Query sản phẩm mới nhất theo category
    //     const filter = category !== 'all' ? { category } : {};
    //     const products = await Product.find(filter).sort({ createdAt: -1 }).limit(4).lean();

    //     if (!products.length) {
    //         agent.add(`There are no new ${category} products available at the moment.`);
    //         return;
    //     }

    //     agent.add(`Here are the latest ${category} products:`);

    //     // Tạo payload gửi về Dialogflow
    //     const payloadJson = {
    //         richContent: [
    //             products.map((product) => ({
    //                 type: 'info',
    //                 title: product.title,
    //                 subtitle: `Price: ${product.price} VNĐ`,
    //                 image: {
    //                     src: {
    //                         rawUrl: product.thumb || 'https://via.placeholder.com/150',
    //                     },
    //                 },
    //                 actionLink: `http://localhost:3000/${product.category}/${product._id}/${encodeURIComponent(
    //                     product.title,
    //                 )}`,
    //             })),
    //         ],
    //     };

    //     console.log('New Arrivals by Category Payload:', JSON.stringify(payloadJson, null, 2));

    //     // Gửi payload về Dialogflow
    //     agent.add(new Payload('UNSPECIFIED', payloadJson, { sendAsMessage: true, rawPayload: true }));
    // });
    const handleNewArrivalsByCategory = asyncHandler(async (agent) => {
        let category = agent.parameters.category || 'all';

        // Đảm bảo category là string
        if (Array.isArray(category)) {
            category = category[0]; // Lấy giá trị đầu tiên nếu là mảng
        }
        if (typeof category !== 'string') {
            console.error('Invalid category type:', category);
            category = 'all'; // Mặc định nếu không hợp lệ
        }

        // Chuẩn hóa category về chữ thường để so sánh
        category = category.trim().toLowerCase();

        console.log('Normalized Category:', category);

        // Lấy danh sách category từ DB (chuyển về chữ thường để so sánh)
        const availableCategoriesRaw = await Product.distinct('category');
        const availableCategories = availableCategoriesRaw.map((cat) => cat.toLowerCase());

        // Map category số nhiều -> số ít (nếu có)
        const singularize = (word) => word.replace(/s$/, ''); // "phones" -> "phone"
        const normalizedCategory = singularize(category);

        // Kiểm tra nếu category tồn tại trong DB
        let bestMatch = availableCategories.find((cat) => cat === normalizedCategory);

        if (!bestMatch && category !== 'all') {
            // Tìm gần đúng nếu không khớp 100%
            bestMatch = availableCategories.find((cat) => cat.includes(normalizedCategory));
        }

        if (!bestMatch && category !== 'all') {
            agent.add(`Sorry, we couldn't find any products in the "${category}" category.`);
            return;
        }

        category = bestMatch || 'all'; // Dùng category gần đúng nếu có

        console.log(`Using best match category: ${category}`);

        // Query sản phẩm mới nhất theo category
        const filter = category !== 'all' ? { category: new RegExp(`^${category}$`, 'i') } : {};
        const products = await Product.find(filter).sort({ createdAt: -1 }).limit(4).lean();

        if (!products.length) {
            agent.add(`There are no new ${category} products available at the moment.`);
            return;
        }

        agent.add(`Here are the latest ${category} products:`);

        // Tạo payload gửi về Dialogflow
        const payloadJson = {
            richContent: [
                products.map((product) => ({
                    type: 'info',
                    title: product.title,
                    subtitle: `Price: ${product.price} VNĐ`,
                    image: {
                        src: {
                            rawUrl: product.thumb || 'https://via.placeholder.com/150',
                        },
                    },
                    actionLink: `http://localhost:3000/${product.category}/${product._id}/${encodeURIComponent(
                        product.title,
                    )}`,
                })),
            ],
        };

        console.log('New Arrivals by Category Payload:', JSON.stringify(payloadJson, null, 2));

        // Gửi payload về Dialogflow
        agent.add(new Payload('UNSPECIFIED', payloadJson, { sendAsMessage: true, rawPayload: true }));
    });

    //Brand bán chạy nhất
    const handleBestSellingByBrand = asyncHandler(async (agent) => {
        let brand = agent.parameters.brand;

        if (!brand) {
            agent.add('Please specify a brand to find the best-selling products.');
            return;
        }

        // Định dạng lại brand (viết hoa chữ cái đầu)
        const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        brand = capitalize(brand);

        console.log('Searching best-selling products for brand:', brand);

        // Kiểm tra xem brand có tồn tại không
        const availableBrands = await Product.distinct('brand');

        if (!availableBrands.includes(brand)) {
            agent.add(`Sorry, we couldn't find any best-selling products for the brand "${brand}".`);
            return;
        }

        // Truy vấn sản phẩm bán chạy theo brand
        const products = await Product.find({ brand }).sort({ sold: -1 }).limit(4).lean();

        if (!products.length) {
            agent.add(`There are no best-selling products for ${brand} at the moment.`);
            return;
        }

        agent.add(`Here are the best-selling products from ${brand}:`);

        // Tạo payload gửi về Dialogflow
        const payloadJson = {
            richContent: [
                products.map((product) => ({
                    type: 'info',
                    title: product.title,
                    subtitle: `Sold: ${product.sold} - Price: ${product.price} VNĐ`,
                    image: {
                        src: {
                            rawUrl: product.thumb || 'https://via.placeholder.com/150',
                        },
                    },
                    actionLink: `http://localhost:3000/${product.category}/${product._id}/${encodeURIComponent(
                        product.title,
                    )}`,
                })),
            ],
        };

        console.log('Best Selling by Brand Payload:', JSON.stringify(payloadJson, null, 2));

        // Gửi payload về Dialogflow
        agent.add(new Payload('UNSPECIFIED', payloadJson, { sendAsMessage: true, rawPayload: true }));
    });

    //sản phẩm bán chạy theo cả thương hiệu và category
    const handleProductsByBrandAndCategory = asyncHandler(async (agent) => {
        let category = agent.parameters.category || 'all';
        let brand = agent.parameters.brand || 'all';

        // Đảm bảo category và brand là string
        if (Array.isArray(category)) category = category[0];
        if (Array.isArray(brand)) brand = brand[0];

        if (typeof category !== 'string') category = 'all';
        if (typeof brand !== 'string') brand = 'all';

        category = category.trim().toLowerCase();
        brand = brand.trim().toLowerCase();

        console.log('Category:', category, 'Brand:', brand);

        // Lấy danh sách category & brand từ DB
        const availableCategoriesRaw = await Product.distinct('category');
        const availableBrandsRaw = await Product.distinct('brand');

        // Chuyển về chữ thường để so sánh
        const availableCategories = availableCategoriesRaw.map((cat) => cat.toLowerCase());
        const availableBrands = availableBrandsRaw.map((br) => br.toLowerCase());

        // Tìm category phù hợp
        const singularize = (word) => word.replace(/s$/, '');
        let bestMatchCategory = availableCategories.find((cat) => cat === singularize(category)) || 'all';

        // Tìm brand phù hợp
        let bestMatchBrand = availableBrands.find((br) => br === brand) || 'all';

        // Nếu không tìm thấy category/brand phù hợp thì báo lỗi
        if (category !== 'all' && bestMatchCategory === 'all') {
            agent.add(`Sorry, we couldn't find any products in the "${category}" category.`);
            return;
        }
        if (brand !== 'all' && bestMatchBrand === 'all') {
            agent.add(`Sorry, we couldn't find any products from the "${brand}" brand.`);
            return;
        }

        console.log(`Using best match - Category: ${bestMatchCategory}, Brand: ${bestMatchBrand}`);

        // Tạo bộ lọc query
        let filter = {};
        if (bestMatchCategory !== 'all') filter.category = new RegExp(`^${bestMatchCategory}$`, 'i');
        if (bestMatchBrand !== 'all') filter.brand = new RegExp(`^${bestMatchBrand}$`, 'i');

        // Query sản phẩm theo filter (ưu tiên hàng bán chạy)
        const products = await Product.find(filter).sort({ sold: -1 }).limit(4).lean();

        if (!products.length) {
            agent.add(`No products found for category "${bestMatchCategory}" and brand "${bestMatchBrand}".`);
            return;
        }

        agent.add(`Here are the best-selling products from ${bestMatchBrand} in ${bestMatchCategory}:`);

        // Tạo payload gửi về Dialogflow
        const payloadJson = {
            richContent: [
                products.map((product) => ({
                    type: 'info',
                    title: product.title,
                    subtitle: `Price: ${product.price} VNĐ | Sold: ${product.sold}`,
                    image: {
                        src: {
                            rawUrl: product.thumb || 'https://via.placeholder.com/150',
                        },
                    },
                    actionLink: `http://localhost:3000/${product.category}/${product._id}/${encodeURIComponent(
                        product.title,
                    )}`,
                })),
            ],
        };

        console.log('Filtered Products Payload:', JSON.stringify(payloadJson, null, 2));

        // Gửi payload về Dialogflow
        agent.add(new Payload('UNSPECIFIED', payloadJson, { sendAsMessage: true, rawPayload: true }));
    });

    const handleBestSellingCheapProducts = asyncHandler(async (agent) => {
        let maxPrice = agent.parameters.price || 1000000; // Mặc định nếu không có giá trị nhập vào

        // Nếu là array, lấy giá trị đầu tiên
        if (Array.isArray(maxPrice)) {
            maxPrice = maxPrice[0];
        }

        // Kiểm tra nếu maxPrice không phải số
        if (isNaN(maxPrice)) {
            console.error('Invalid price value:', maxPrice);
            agent.add("I couldn't understand the price range. Please provide a valid number.");
            return;
        }

        console.log('Max Price:', maxPrice);

        // Query sản phẩm giá rẻ & bán chạy
        const products = await Product.find({
            price: { $lte: maxPrice }, // Lọc giá <= maxPrice
        })
            .sort({ sold: -1 }) // Sắp xếp theo số lượng bán giảm dần
            .limit(4) // Giới hạn 4 sản phẩm
            .lean();

        if (!products.length) {
            agent.add(`No best-selling products found under ${maxPrice} VNĐ.`);
            return;
        }

        // Gửi kết quả về Dialogflow
        const payloadJson = {
            richContent: [
                products.map((product) => ({
                    type: 'info',
                    title: product.title,
                    subtitle: `Price: ${product.price} VNĐ\nSold: ${product.sold}`,
                    image: { src: { rawUrl: product.thumb || 'https://via.placeholder.com/150' } },
                    actionLink: `http://localhost:3000/${product.category}/${product._id}/${encodeURIComponent(
                        product.title,
                    )}`,
                })),
            ],
        };

        console.log('Best-Selling Cheap Products Payload:', JSON.stringify(payloadJson, null, 2));

        agent.add(new Payload('UNSPECIFIED', payloadJson, { sendAsMessage: true, rawPayload: true }));
    });

    //sản phẩm giá rẻ theo category
    const handleCheapestProductsByCategory = asyncHandler(async (agent) => {
        let category = agent.parameters.category || 'all';

        // Nếu category là mảng, lấy giá trị đầu tiên
        if (Array.isArray(category)) {
            category = category[0];
        }

        // Kiểm tra nếu category không phải string
        if (typeof category !== 'string') {
            console.error('Invalid category:', category);
            agent.add("I couldn't understand the category. Please provide a valid category name.");
            return;
        }

        // Chuẩn hóa category về chữ thường để so sánh
        category = category.trim().toLowerCase();

        console.log('Normalized Category:', category);

        // Lấy danh sách category từ DB (chuyển về chữ thường)
        const availableCategoriesRaw = await Product.distinct('category');
        const availableCategories = availableCategoriesRaw.map((cat) => cat.toLowerCase());

        // Xử lý category số nhiều -> số ít (nếu có)
        const singularize = (word) => word.replace(/s$/, ''); // "phones" -> "phone"
        let normalizedCategory = singularize(category);

        // Tìm category gần đúng nếu không khớp hoàn toàn
        let bestMatch = availableCategories.find((cat) => cat === normalizedCategory);

        if (!bestMatch && category !== 'all') {
            bestMatch = availableCategories.find((cat) => cat.includes(normalizedCategory));
        }

        if (!bestMatch && category !== 'all') {
            agent.add(`Sorry, we couldn't find any cheap products in the "${category}" category.`);
            return;
        }

        category = bestMatch || 'all'; // Sử dụng category tìm được

        console.log(`Using best match category: ${category}`);

        // Query sản phẩm giá rẻ nhất theo category
        const filter = category !== 'all' ? { category: new RegExp(`^${category}$`, 'i') } : {};
        const products = await Product.find(filter).sort({ price: 1 }).limit(4).lean(); // Sắp xếp theo giá tăng dần

        if (!products.length) {
            agent.add(`No cheap products found in the "${category}" category.`);
            return;
        }

        agent.add(`Here are the cheapest products in the "${category}" category:`);

        // Gửi kết quả về Dialogflow
        const payloadJson = {
            richContent: [
                products.map((product) => ({
                    type: 'info',
                    title: product.title,
                    subtitle: `Price: ${product.price} VNĐ`,
                    image: { src: { rawUrl: product.thumb || 'https://via.placeholder.com/150' } },
                    actionLink: `http://localhost:3000/${product.category}/${product._id}/${encodeURIComponent(
                        product.title,
                    )}`,
                })),
            ],
        };

        console.log('Cheapest Products by Category Payload:', JSON.stringify(payloadJson, null, 2));

        agent.add(new Payload('UNSPECIFIED', payloadJson, { sendAsMessage: true, rawPayload: true }));
    });

    const handlePlaceOrder = asyncHandler(async (agent) => {
        const productName = agent.parameters.product;
        const quantity = agent.parameters.quantity || 1;

        if (!productName) {
            agent.add('Which product would you like to order?');
            return;
        }

        const product = await Product.findOne({ title: new RegExp(productName, 'i') });

        if (!product) {
            agent.add(`Sorry, we couldn't find the product "${productName}".`);
            return;
        }

        // Store product information in context (DO NOT store userId)
        agent.context.set({
            name: 'order-details',
            lifespan: 5,
            parameters: {
                productName,
                quantity,
                productId: product._id,
                price: product.price,
                thumb: product.thumb || '', // Store product image if available
            },
        });

        agent.add(
            `Would you like to order ${quantity} ${product.title} for a total of ${
                product.price * quantity
            } VND? Confirm?`,
        );
    });

    const handleConfirmOrder = asyncHandler(async (agent) => {
        const context = agent.context.get('order-details');

        // if (!context) {
        //     agent.add('Order details not found.');
        //     return;
        // }

        const { productId, quantity, price, productName, thumb } = context.parameters;

        console.log('Product ID:', productId);
        console.log('Quantity:', quantity);

        if (!productId || !quantity || !price) {
            agent.add('Invalid order data.');
            return;
        }

        // Create the order in the database
        const orderData = {
            products: [{ product: productId, quantity }],
            total: price * quantity,
        };

        const response = await Order.create(orderData);

        // Send a response message to the user
        agent.add(
            `Your order for ${productName} has been placed! Order ID: ${response._id}. Total amount: ${orderData.total} VNĐ.`,
        );

        // Save data to context for frontend access
        agent.context.set({
            name: 'order-response',
            lifespan: 2,
            parameters: {
                success: true,
                cartItem: {
                    product: { _id: productId, title: productName, thumb },
                    quantity,
                    price,
                    color: 'default',
                },
            },
        });
    });

    //so sánh sản phẩm
    const handleCompareProducts = asyncHandler(async (agent) => {
        const product1Name = agent.parameters.product1;
        const product2Name = agent.parameters.product2;

        // Search for products by title
        const products = await Product.find({
            title: { $in: [product1Name, product2Name] },
        }).lean();

        if (products.length < 2) {
            agent.add("Sorry, I couldn't find enough product information to compare.");
            return;
        }

        const [product1, product2] = products;

        // Compare metrics
        const soldComparison =
            product1.sold > product2.sold
                ? `${product1.title} is more popular with ${product1.sold} units sold.`
                : `${product2.title} is more popular with ${product2.sold} units sold.`;

        const discountComparison =
            product1.discount > product2.discount
                ? `${product1.title} offers a higher discount (${product1.discount}%).`
                : `${product2.title} offers a higher discount (${product2.discount}%).`;

        const ratingComparison =
            product1.totalRatings > product2.totalRatings
                ? `${product1.title} has a higher rating (${product1.totalRatings} stars).`
                : `${product2.title} has a higher rating (${product2.totalRatings} stars).`;

        agent.add(`Here is the comparison between ${product1.title} and ${product2.title}:`);
        agent.add(soldComparison);
        agent.add(discountComparison);
        agent.add(ratingComparison);

        // Send detailed product information via richContent
        const payloadJson = {
            richContent: [
                [product1, product2].map((product) => ({
                    type: 'info',
                    title: product.title,
                    subtitle: `Price: ${product.price} VNĐ\nDiscount: ${product.discount}%\nSold: ${product.sold}\nRating: ${product.totalRatings} stars`,
                    image: {
                        src: {
                            rawUrl: product.thumb || 'https://via.placeholder.com/150',
                        },
                    },
                    actionLink: `http://localhost:3000/${product.category}/${product._id}/${encodeURIComponent(
                        product.title,
                    )}`,
                })),
            ],
        };

        agent.add(new Payload('UNSPECIFIED', payloadJson, { sendAsMessage: true, rawPayload: true }));
    });

    const intentMap = new Map();
    // console.debug('Received request with intent:', agent.intent);
    intentMap.set('Are there any white products', handleProductQuery);
    intentMap.set('Best Selling Products', handleBestSellingProducts);
    intentMap.set('New Arrivals', handleNewArrivals);
    intentMap.set('New arrivals by Category', handleNewArrivalsByCategory);
    intentMap.set('Best selling in Brand', handleBestSellingByBrand);
    intentMap.set('Best selling product by Brand and Category', handleProductsByBrandAndCategory);
    intentMap.set('Best selling and Cheap product', handleBestSellingCheapProducts);
    intentMap.set('Cheap product by Category', handleCheapestProductsByCategory);
    intentMap.set('Place Order', handlePlaceOrder);
    intentMap.set('Confirm Order', handleConfirmOrder);
    intentMap.set('Compare Products', handleCompareProducts);

    // Thêm Intent mới

    // Xử lý yêu cầu từ Dialogflow
    try {
        agent.handleRequest(intentMap);
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
