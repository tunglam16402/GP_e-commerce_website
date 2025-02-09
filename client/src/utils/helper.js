import icons from './icons';

const { AiFillStar, AiOutlineStar } = icons;
export const createSlug = (string) => {
    //chuyển chuỗi viết hoa + tiếng việt về chuỗi thường ko dấu sao đó chuyển dấu cách thành dấu gạch nối
    return string
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .split(' ')
        .join('-');
};
// export const formatMoney = (number) => Number(number.toFixed(1)).toLocaleString();
export const formatMoney = (number) => {
    if (number === undefined || number === null || isNaN(number)) {
        return '0.0';
    }
    return Number(number.toFixed(1)).toLocaleString();
};

export const renderStarFromNumber = (number, size) => {
    //1=fill star 2=outline star
    //4 => [1,1,1,1,0]
    //2 => [1,1,0,0,0]
    if (!Number(number)) return;
    const stars = [];
    number = Math.round(number);
    for (let i = 0; i < +number; i++) {
        stars.push(<AiFillStar color="orange" size={size || 16}></AiFillStar>);
    }
    for (let i = 5; i > +number; i--) {
        stars.push(<AiOutlineStar color="orange" size={size || 16}></AiOutlineStar>);
    }
    return stars;
};

export const secondsToHms = (d) => {
    d = Number(d) / 1000;
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = Math.floor((d % 3600) % 60);
    return { h, m, s };
};

// export const validate = (payload, setInvalidFields) => {
//     let invalids = 0;
//     const formatPayload = Object.entries(payload);
//     for (let array of formatPayload) {
//         if (array[1].trim() === '') {
//             invalids++;
//             setInvalidFields((prev) => [...prev, { name: array[0], message: 'Require this field.' }]);
//         }
//     }
//     for (let array of formatPayload) {
//         switch (array[0]) {
//             case 'email':
//                 const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//                 if (!array[1].includes('@')) {
//                     invalids++;
//                     setInvalidFields((prev) => [
//                         ...prev,
//                         { name: array[0], message: 'Email must contain the "@" character' },
//                     ]);
//                 } else if (!array[1].match(emailPattern)) {
//                     invalids++;
//                     setInvalidFields((prev) => [...prev, { name: array[0], message: 'Invalid email format' }]);
//                 }
//                 break;
//             case 'password':
//                 if (array[1].length < 6) {
//                     invalids++;
//                     setInvalidFields((prev) => [...prev, { name: array[0], message: 'Password minimum 6 characters' }]);
//                 }
//                 break;
//             default:
//                 break;
//         }
//     }
//     return invalids;
// };

export const validate = (payload, setInvalidFields) => {
    let invalids = 0;
    const formatPayload = Object.entries(payload);

    // Kiểm tra và gọi trim nếu dữ liệu là chuỗi
    for (let array of formatPayload) {
        if (typeof array[1] === 'string' && array[1].trim() === '') {
            invalids++;
            setInvalidFields((prev) => [...prev, { name: array[0], message: 'Require this field.' }]);
        }
    }

    // Kiểm tra các trường đặc biệt như email, password
    for (let array of formatPayload) {
        switch (array[0]) {
            case 'email':
                const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!array[1].includes('@')) {
                    invalids++;
                    setInvalidFields((prev) => [
                        ...prev,
                        { name: array[0], message: 'Email must contain the "@" character' },
                    ]);
                } else if (!array[1].match(emailPattern)) {
                    invalids++;
                    setInvalidFields((prev) => [...prev, { name: array[0], message: 'Invalid email format' }]);
                }
                break;
            case 'password':
                if (array[1].length < 6) {
                    invalids++;
                    setInvalidFields((prev) => [...prev, { name: array[0], message: 'Password minimum 6 characters' }]);
                }
                break;
            default:
                break;
        }
    }
    return invalids;
};

export const formatPrice = (number) => Math.round(number / 1000) * 1000;

export const formatDollarToVND = (amount) => {
    const exchangeRate = 25000; // 1 USD = 24,000 VND (cập nhật nếu cần)
    const vndAmount = amount * exchangeRate;
    return vndAmount.toLocaleString('vi-VN') + ' VND';
};

//
export const generateRange = (start, end) => {
    const length = end + 1 - start;
    return Array.from({ length }, (_, index) => start + index);
};

//reiview img when upload file
export const getBase64 = (file) => {
    if (!file) return '';
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
            // if ((encoded.length % 4) > 0) {
            //   encoded += '='.repeat(4 - (encoded.length % 4));
            // }
            // resolve(encoded);
            resolve(reader.result);
        };
        reader.onerror = (error) => reject(error);
    });
};
