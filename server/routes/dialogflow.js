// const express = require('express');
// const { WebhookClient, Payload } = require('dialogflow-fulfillment');
// const router = express.Router();
// const Product = require('../models/productModel'); // Đường dẫn tới model sản phẩm của bạn

// router.post('/', (req, res) => {
//     const agent = new WebhookClient({ request: req, response: res });
//     const handleProductQuery = async (agent) => {
//         const color = agent.parameters.color || 'white';

//         const products = await Product.find({ color }).limit(4).lean();

//         if (!products.length) {
//             agent.add("Sorry, we couldn't find any products matching your request.");
//             return;
//         }

//         const payloadJson = {
//             richContent: products.map((product) => ({
//                 type: 'list',
//                 title: product.title,
//                 subtitle: product.description[0] || 'Click to view details',
//                 event: {
//                     link: `http://localhost:3000/${product.category}/${product._id}/${encodeURIComponent(
//                         product.title,
//                     )}`,
//                     languageCode: 'en',
//                 },
//             })),
//         };

//         agent.add(new Payload(agent.UNSPECIFIED, payloadJson, { sendAsMessage: true, rawPayload: true }));
//     };

//     const intentMap = new Map();
//     intentMap.set('Are there any white products', handleProductQuery);
//     agent.handleRequest(intentMap);
// });

// module.exports = router;

const express = require('express');
const { WebhookClient, Payload } = require('dialogflow-fulfillment');
const router = express.Router();
const Product = require('../models/productModel'); // Đường dẫn tới model sản phẩm của bạn

router.post('/', async (req, res) => {
    console.log('Request received:', req.body);
    const agent = new WebhookClient({ request: req, response: res });

    // Hàm xử lý truy vấn sản phẩm theo màu
    const handleProductQuery = async (agent) => {
        // const color = agent.parameters.color || 'white'; // Mặc định là màu trắng nếu không có
        const color = agent.parameters.color && agent.parameters.color[0] ? agent.parameters.color[0] : 'white';
        try {
            // Truy vấn sản phẩm từ database
            const products = await Product.find({ color }).limit(4).lean();

            if (!products.length) {
                agent.add("Sorry, we couldn't find any products matching your request.");
                return;
            }

            // Tạo payload để gửi về Dialogflow
            const payloadJson = {
                richContent: [
                    [
                        {
                            type: 'list',
                            title: `Products in ${color} color:`,
                            items: products.map((product) => ({
                                title: product.title,
                                subtitle: product.description[0] || 'Click to view details',
                                event: {
                                    link: `http://localhost:3000/${product.category}/${
                                        product._id
                                    }/${encodeURIComponent(product.title)}`,
                                    languageCode: 'en',
                                },
                            })),
                            // type: 'image',
                            // rawUrl: 'https://tse3.mm.bing.net/th?id=OIP.U_VJuupQohwnzXcKMztqWgHaEo&pid=Api&P=0&h=220',
                        },
                    ],
                ],
            };
            console.log('Payload JSON:', JSON.stringify(payloadJson, null, 2));
            console.debug('Generated payload:', payloadJson);

            // Gửi payload về cho Dialogflow
            // agent.add(new Payload(agent.UNSPECIFIED, payloadJson, { sendAsMessage: true, rawPayload: true }));
            agent.add(new Payload('UNSPECIFIED', payloadJson, { sendAsMessage: true, rawPayload: true }));
        } catch (error) {
            console.error('Error fetching products:', error);
            agent.add('An error occurred while fetching products. Please try again.');
        }
    };

    const intentMap = new Map();
    console.debug('Received request with intent:', agent.intent);
    intentMap.set('Are there any white products', handleProductQuery);

    // Xử lý yêu cầu từ Dialogflow
    try {
        agent.handleRequest(intentMap);
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
