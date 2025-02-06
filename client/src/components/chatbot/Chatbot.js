
import React, { useEffect, useState } from 'react';
import { memo } from 'react';
import logo from 'assets/img/logo.png';

const Chatbot = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // const existingScript = document.getElementById('df-messenger-script');
        // if (!existingScript) {
        //     const script = document.createElement('script');
        //     script.src = 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
        //     script.id = 'df-messenger-script';
        //     script.async = true;
        //     document.body.appendChild(script);
        // }
        const existingScript = document.getElementById('df-messenger-script');
        if (!existingScript) {
            const script = document.createElement('script');
            script.src = 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
            script.id = 'df-messenger-script';
            script.async = true;
            script.onload = () => console.log('Dialogflow script loaded'); // Kiểm tra khi script tải thành công
            script.onerror = (err) => console.error('Error loading Dialogflow script:', err); // Kiểm tra lỗi khi tải script
            document.body.appendChild(script);
        }
        const handleResponse = async (event) => {
            console.log('Event received:', event);
            const data = event.detail.response;
            console.log('Dialogflow response:', data);
            if (data.fulfillmentMessages && data.fulfillmentMessages[0].payload) {
                const richContent = data.fulfillmentMessages[0].payload.richContent;
                console.log('Rich content:', richContent);
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
        };
        window.addEventListener('dfMessengerResponse', handleResponse);
        console.log('Event listener added'); // Kiểm tra nếu listener đã được thêm vào

        return () => {
            const existingScript = document.getElementById('df-messenger-script');
            if (existingScript) {
                document.body.removeChild(existingScript);
            }
            window.removeEventListener('dfMessengerResponse', handleResponse);
            console.log('Event listener removed'); // Kiểm tra nếu listener đã được xóa
        };
    }, []);

    useEffect(() => {
        console.log('Products:', products); // Kiểm tra state products
    }, [products]);

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
                {products.length > 0 ? (
                    products.map((product, index) => (
                        <div key={index}>
                            <h3>{product.title}</h3>
                            {/* <p dangerouslySetInnerHTML={{ __html: product.subtitle }}></p> */}
                            <p>{product.subtitle}</p>
                            {/* <a href={product.link}>View Details</a> */}
                            <button onClick={() => handleLinkClick(product.link)}>View Details</button>{' '}
                        </div>
                    ))
                ) : (
                    // <p>No products found.</p>
                    ''
                )}
            </div>
        </div>
    );
};

export default memo(Chatbot);
