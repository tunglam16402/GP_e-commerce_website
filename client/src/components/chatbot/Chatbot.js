// import React, { useEffect, useState } from 'react';
// import { memo } from 'react';
// import logo from 'assets/img/logo.png';

// const Chatbot = () => {
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const existingScript = document.getElementById('df-messenger-script');
//         if (!existingScript) {
//             const script = document.createElement('script');
//             script.src = 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
//             script.id = 'df-messenger-script';
//             script.async = true;
//             script.onload = () => console.log('Dialogflow script loaded'); // Kiểm tra khi script tải thành công
//             script.onerror = (err) => console.error('Error loading Dialogflow script:', err); // Kiểm tra lỗi khi tải script
//             document.body.appendChild(script);
//         }
//         const handleResponse = async (event) => {
//             console.log('Event received:', event);
//             const data = event.detail.response;
//             console.log('Dialogflow response:', data);
//             if (data.fulfillmentMessages && data.fulfillmentMessages[0].payload) {
//                 const richContent = data.fulfillmentMessages[0].payload.richContent;
//                 console.log('Rich content:', richContent);
//                 if (richContent && richContent[0] && richContent[0].items) {
//                     const productsList = richContent[0].items.map((item) => ({
//                         title: item.title,
//                         subtitle: item.subtitle,
//                         link: item.event.link,
//                     }));
//                     console.log('Products list:', productsList);
//                     setProducts(productsList);
//                 }
//             }
//         };
//         window.addEventListener('dfMessengerResponse', handleResponse);
//         console.log('Event listener added'); // Kiểm tra nếu listener đã được thêm vào

//         return () => {
//             const existingScript = document.getElementById('df-messenger-script');
//             if (existingScript) {
//                 document.body.removeChild(existingScript);
//             }
//             window.removeEventListener('dfMessengerResponse', handleResponse);
//             console.log('Event listener removed'); // Kiểm tra nếu listener đã được xóa
//         };
//     }, []);

//     useEffect(() => {
//         console.log('Products:', products); // Kiểm tra state products
//     }, [products]);

//     const handleLinkClick = (url) => {
//         window.open(url, '_blank');
//     };

//     return (
//         <div>
//             <df-messenger
//                 intent="WELCOME"
//                 chat-title="E-commerce-chatbot"
//                 agent-id="ef402d03-902b-4193-bbd8-3dde1b5c9f34"
//                 language-code="en"
//             ></df-messenger>
//             <div id="product-container">
//                 {products.length > 0
//                     ? products.map((product, index) => (
//                           <div key={index}>
//                               <h3>{product.title}</h3>
//                               {/* <p dangerouslySetInnerHTML={{ __html: product.subtitle }}></p> */}
//                               <p>{product.subtitle}</p>
//                               {/* <a href={product.link}>View Details</a> */}
//                               <button onClick={() => handleLinkClick(product.link)}>View Details</button>{' '}
//                           </div>
//                       ))
//                     : // <p>No products found.</p>
//                       ''}
//             </div>
//         </div>
//     );
// };

// export default memo(Chatbot);
// // import { useState } from 'react';
// // import axios from 'axios';

// // const Chatbot = () => {
// //     const [messages, setMessages] = useState([]);
// //     const [input, setInput] = useState('');

// //     const sendMessage = async () => {
// //         if (!input.trim()) return;

// //         const userMessage = { text: input, sender: 'user' };
// //         setMessages([...messages, userMessage]);

// //         try {
// //             const response = await axios.post('http://localhost:5000/api/dialogflow', { query: input });
// //             const botMessage = { text: response.data.reply, sender: 'bot' };
// //             setMessages([...messages, userMessage, botMessage]);
// //         } catch (error) {
// //             console.error('Chatbot error:', error);
// //         }

// //         setInput('');
// //     };

// //     return (
// //         <div className="p-4 border rounded-lg w-96 bg-white shadow-md">
// //             <div className="h-60 overflow-y-auto">
// //                 {messages.map((msg, index) => (
// //                     <div
// //                         key={index}
// //                         className={`p-2 rounded-md ${
// //                             msg.sender === 'user' ? 'bg-blue-200 text-right' : 'bg-gray-200 text-left'
// //                         }`}
// //                     >
// //                         {msg.text}
// //                     </div>
// //                 ))}
// //             </div>
// //             <input
// //                 type="text"
// //                 value={input}
// //                 onChange={(e) => setInput(e.target.value)}
// //                 className="border p-2 w-full"
// //                 placeholder="Nhập tin nhắn..."
// //             />
// //             <button onClick={sendMessage} className="bg-blue-500 text-white p-2 w-full mt-2">
// //                 Gửi
// //             </button>
// //         </div>
// //     );
// // };

// // export default Chatbot;

import React, { useEffect, useState } from 'react';
import { memo } from 'react';
import { useDispatch } from 'react-redux';
import { updateCart } from '../../store/users/userSlice';

const Chatbot = () => {
    const [products, setProducts] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const existingScript = document.getElementById('df-messenger-script');
        if (!existingScript) {
            const script = document.createElement('script');
            script.src = 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
            script.id = 'df-messenger-script';
            script.async = true;
            script.onload = () => console.log('Dialogflow script loaded');
            script.onerror = (err) => console.error('Error loading Dialogflow script:', err);
            document.body.appendChild(script);
        }

        const handleResponse = async (event) => {
            console.log('Event received:', event);
            const data = event.detail.response;
            console.log('Dialogflow response:', data);

            // ✅ Lấy sản phẩm từ richContent nếu có
            if (data.fulfillmentMessages && data.fulfillmentMessages[0].payload) {
                const richContent = data.fulfillmentMessages[0].payload.richContent;
                if (richContent && richContent[0] && richContent[0].items) {
                    const productsList = richContent[0].items.map((item) => ({
                        title: item.title,
                        subtitle: item.subtitle,
                        link: item.event.link,
                    }));
                    console.log('Products list:', productsList);
                    setProducts(productsList);
                }
            }

            // ✅ Lấy dữ liệu từ context `order-response`
            const orderContext = data.outputContexts?.find((ctx) => ctx.name.includes('order-response'));
            if (orderContext && orderContext.parameters.success) {
                const cartItem = orderContext.parameters.cartItem;
                console.log('Updating cart with:', cartItem);

                dispatch(
                    updateCart({
                        pid: cartItem.product._id,
                        title: cartItem.product.title,
                        quantity: cartItem.quantity,
                        price: cartItem.price,
                        color: cartItem.color || 'default',
                    }),
                );
            }
        };

        window.addEventListener('dfMessengerResponse', handleResponse);
        console.log('Event listener added');

        return () => {
            window.removeEventListener('dfMessengerResponse', handleResponse);
            console.log('Event listener removed');
        };
    }, [dispatch]);

    const handleLinkClick = (url) => {
        window.open(url, '_blank');
    };

    return (
        <div>
            <df-messenger
                intent="WELCOME"
                chat-title="E-commerce-chatbot"
                agent-id="ef402d03-902b-4193-bbd8-3dde1b5c9f34"
                language-code="en"
            ></df-messenger>
            <div id="product-container">
                {products.length > 0
                    ? products.map((product, index) => (
                          <div key={index}>
                              <h3>{product.title}</h3>
                              <p>{product.subtitle}</p>
                              <button onClick={() => handleLinkClick(product.link)}>View Details</button>
                          </div>
                      ))
                    : ''}
            </div>
        </div>
    );
};

export default memo(Chatbot);
