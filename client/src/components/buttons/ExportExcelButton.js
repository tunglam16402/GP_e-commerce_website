// import React from 'react';
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';
// import moment from 'moment';
// import { Button } from 'components';
// import { toast } from 'react-toastify';

// const ExportExcelButton = ({ data = [], fileName = 'ExportedData', columns = [] }) => {
//     const handleExport = () => {

//         if (!Array.isArray(data) || data.length === 0) {
//             toast.warning('No data to export!');
//             return;
//         }

//         if (!Array.isArray(columns) || columns.length === 0) {
//             toast.error('Missing column definitions!');
//             return;
//         }

//         // Chuyển đổi dữ liệu theo cột
//         const formattedData = data.map((item, index) => {
//             let row = { STT: index + 1 }; // Thêm số thứ tự
//             columns.forEach(({ label, key }) => {
//                 let value = item[key];

//                 // Kiểm tra giá trị null hoặc undefined
//                 if (value === null || value === undefined) value = '';

//                 // Định dạng ngày nếu cần
//                 if (value instanceof Date) value = moment(value).format('YYYY-MM-DD HH:mm:ss');

//                 row[label] = value;
//             });
//             return row;
//         });

//         const worksheet = XLSX.utils.json_to_sheet(formattedData);
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

//         // Lưu file
//         XLSX.writeFile(workbook, `${fileName}_${moment().format('YYYYMMDD_HHmmss')}.xlsx`);
//     };

//     return (
//         <button
//             className="bg-green-500 text-white hover:bg-green-600 transition-colors duration-300"
//             onClick={handleExport}
//         >
//             Excel export
//         </button>
//     );
// };

// export default ExportExcelButton;

import React from 'react';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import moment from 'moment';

const ExportExcelButton = ({ data = [], fileName = 'ExportedData', columns = [], fetchAllData }) => {
    const handleExport = async () => {
        let exportData = data;

        // Nếu có hàm fetchAllData, gọi API để lấy tất cả dữ liệu
        if (fetchAllData) {
            toast.info('Đang lấy toàn bộ dữ liệu, vui lòng chờ...');
            try {
                exportData = await fetchAllData();
            } catch (error) {
                toast.error('Lỗi khi lấy dữ liệu!');
                return;
            }
        }

        if (!Array.isArray(exportData) || exportData.length === 0) {
            toast.warning('Không có dữ liệu để xuất!');
            return;
        }

        if (!Array.isArray(columns) || columns.length === 0) {
            toast.error('Thiếu thông tin cột!');
            return;
        }

        // Chuyển đổi dữ liệu theo cột
        const formattedData = exportData.map((item, index) => {
            let row = { STT: index + 1 };
            columns.forEach(({ label, key }) => {
                let value = item[key] ?? ''; // Tránh null/undefined
                if (value instanceof Date) value = moment(value).format('YYYY-MM-DD HH:mm:ss');
                row[label] = value;
            });
            return row;
        });

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        XLSX.writeFile(workbook, `${fileName}_${moment().format('YYYYMMDD_HHmmss')}.xlsx`);
        toast.success('Xuất Excel thành công!');
    };

    return (
        <button
            className="bg-main p-2 text-white hover:bg-green-600 transition-colors duration-300"
            onClick={handleExport}
        >
            Export Excel
        </button>
    );
};

export default ExportExcelButton;
