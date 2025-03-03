const { Translate } = require('@google-cloud/translate').v2;
const translate = new Translate({ key: 'YOUR_GOOGLE_API_KEY' });

const translateMiddleware = async (req, res, next) => {
    const lang = req.query.lang || 'en'; // Ngôn ngữ mặc định là tiếng Anh
    const originalSend = res.json;

    res.json = async (data) => {
        if (!data || typeof data !== 'object') {
            return originalSend.call(res, data);
        }

        // Hàm đệ quy để dịch tất cả nội dung
        const translateObject = async (obj) => {
            if (typeof obj === 'string') {
                return await translateText(obj, lang);
            } else if (Array.isArray(obj)) {
                return await Promise.all(obj.map((item) => translateObject(item)));
            } else if (typeof obj === 'object') {
                const translatedObj = {};
                for (const key in obj) {
                    translatedObj[key] = await translateObject(obj[key]);
                }
                return translatedObj;
            }
            return obj;
        };

        const translatedData = await translateObject(data);
        return originalSend.call(res, translatedData);
    };

    next();
};

const translateText = async (text, targetLang) => {
    const [translation] = await translate.translate(text, targetLang);
    return translation;
};

module.exports = translateMiddleware;
