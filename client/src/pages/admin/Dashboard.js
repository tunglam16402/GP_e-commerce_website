import { useState, useEffect } from 'react';
import { ShoppingCart, Users, Package, Star, DollarSign } from 'lucide-react';
import { apiGetOrders, apiGetUsers, apiGetProducts } from 'apis';
import { formatDollarToVND } from 'utils/helper';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Bar,
    BarChart,
    Pie,
    Legend,
    Cell,
} from 'recharts';
import dayjs from 'dayjs';
import moment from 'moment';

const Dashboard = () => {
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);

    const [dailyRevenue, setDailyRevenue] = useState(0);
    const [weeklyRevenue, setWeeklyRevenue] = useState(0);
    const [monthlyRevenue, setMonthlyRevenue] = useState(0);
    const [yearlyRevenue, setYearlyRevenue] = useState(0);

    const [dailyRevenues, setDailyRevenues] = useState([]);
    const [monthlyRevenues, setMonthlyRevenues] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
    const [selectedYear, setSelectedYear] = useState(dayjs().year());

    const [orderStatusData, setOrderStatusData] = useState([]);
    const [bestSellingProducts, setBestSellingProducts] = useState([]);
    const [newestOrder, setNewestOrder] = useState([]);

    const statusColors = ['#4caf50', '#ff9800', '#f44336'];

    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const orders = await apiGetOrders();
                const users = await apiGetUsers();
                const products = await apiGetProducts();
                const bestSell = await apiGetProducts({ sort: '-sold', limit: 10 });
                const newOrder = await apiGetOrders({ sort: '-createdAt', limit: 10, status: 'Processing' });

                if (orders.success) {
                    setTotalOrders(orders.counts || 0);
                    setDailyRevenue(orders.dailyRevenue || 0);
                    setWeeklyRevenue(orders.weeklyRevenue || 0);
                    setMonthlyRevenue(orders.monthlyRevenue || 0);
                    setYearlyRevenue(orders.yearlyRevenue || 0);

                    const now = dayjs().month(selectedMonth - 1);
                    const daysInMonth = now.daysInMonth();
                    const allDays = Array.from({ length: daysInMonth }, (_, i) => ({
                        _id: now.date(i + 1).format('YYYY-MM-DD'),
                        revenue: 0,
                    }));

                    const revenueMap = new Map(
                        orders.dailyRevenues
                            .filter((item) => dayjs(item._id).month() + 1 === selectedMonth)
                            .map((item) => [item._id, item.revenue]),
                    );

                    const mergedData = allDays.map((day) => ({
                        _id: day._id,
                        revenue: revenueMap.get(day._id) || 0,
                    }));

                    setDailyRevenues(mergedData);

                    const allMonths = Array.from({ length: 12 }, (_, i) => ({
                        _id: monthNames[i], // Lấy tên tháng từ mảng
                        revenue: 0,
                    }));

                    const monthlyMap = new Map(
                        orders.monthlyRevenues
                            .filter((item) => dayjs(item._id, 'YYYY-MM').year() === selectedYear)
                            .map((item) => [dayjs(item._id, 'YYYY-MM').month() + 1, item.revenue]),
                    );

                    const mergedMonthlyData = allMonths.map((month, i) => ({
                        _id: month._id,
                        revenue: monthlyMap.get(i + 1) || 0,
                    }));

                    setMonthlyRevenues(mergedMonthlyData);

                    const statusCounts = orders.orderStatusCounts || {};
                    const statusData = Object.entries(statusCounts).map(([key, value]) => ({
                        name: key,
                        value,
                    }));

                    setOrderStatusData(statusData);
                }

                if (users.success) setTotalUsers(users.counts || 0);
                if (products.success) {
                    setTotalProducts(products.counts || 0);
                    setTotalReviews(products.totalRatings || 0);
                }
                if (bestSell.success) {
                    setBestSellingProducts(bestSell.products);
                }
                if (newOrder.success) {
                    setNewestOrder(newOrder.orders);
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            }
        };

        fetchData();
    }, [selectedMonth, selectedYear]);

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <header className="text-4xl font-semibold text-gray-900 tracking-tight border-b-4 border-red-600 pb-2">
                Statistics
            </header>
            {/* Statistic Cards */}
            <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-5 bg-white shadow-lg rounded-lg flex items-center gap-4">
                    <ShoppingCart className="text-blue-500" size={32} />
                    <div>
                        <h3 className="text-xl font-semibold">{totalOrders.toLocaleString()}</h3>
                        <p className="text-gray-500">Total Orders</p>
                    </div>
                </div>

                <div className="p-5 bg-white shadow-lg rounded-lg flex items-center gap-4">
                    <Users className="text-purple-500" size={32} />
                    <div>
                        <h3 className="text-xl font-semibold">{totalUsers.toLocaleString()}</h3>
                        <p className="text-gray-500">Total Users</p>
                    </div>
                </div>

                <div className="p-5 bg-white shadow-lg rounded-lg flex items-center gap-4">
                    <Package className="text-green-500" size={32} />
                    <div>
                        <h3 className="text-xl font-semibold">{totalProducts.toLocaleString()}</h3>
                        <p className="text-gray-500">Total Products</p>
                    </div>
                </div>

                <div className="p-5 bg-white shadow-lg rounded-lg flex items-center gap-4">
                    <Star className="text-yellow-500" size={32} />
                    <div>
                        <h3 className="text-xl font-semibold">{totalReviews.toLocaleString()}</h3>
                        <p className="text-gray-500">Total Reviews</p>
                    </div>
                </div>
            </div>

            {/* Revenue Cards */}
            <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-5 bg-white shadow-lg rounded-lg flex items-center gap-4">
                    <DollarSign className="text-red-500" size={32} />
                    <div>
                        <h3 className="text-xl font-semibold">{formatDollarToVND(dailyRevenue)}</h3>
                        <p className="text-gray-500">Daily Revenue</p>
                    </div>
                </div>

                <div className="p-5 bg-white shadow-lg rounded-lg flex items-center gap-4">
                    <DollarSign className="text-red-400" size={32} />
                    <div>
                        <h3 className="text-xl font-semibold">{formatDollarToVND(weeklyRevenue)}</h3>
                        <p className="text-gray-500">Weekly Revenue</p>
                    </div>
                </div>

                <div className="p-5 bg-white shadow-lg rounded-lg flex items-center gap-4">
                    <DollarSign className="text-red-300" size={32} />
                    <div>
                        <h3 className="text-xl font-semibold">{formatDollarToVND(monthlyRevenue)}</h3>
                        <p className="text-gray-500">Monthly Revenue</p>
                    </div>
                </div>

                <div className="p-5 bg-white shadow-lg rounded-lg flex items-center gap-4">
                    <DollarSign className="text-red-200" size={32} />
                    <div>
                        <h3 className="text-xl font-semibold">{formatDollarToVND(yearlyRevenue)}</h3>
                        <p className="text-gray-500">Yearly Revenue</p>
                    </div>
                </div>
            </div>

            {/* Monthly Revenue Chart */}
            {/* Monthly Revenue Chart & Order Status Pie Chart */}
            <div className="md:col-span-4 p-6 bg-white shadow-lg rounded-lg flex gap-4">
                <div className="w-[70%] bg-white p-6 shadow-lg rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">Monthly Revenue Chart</h2>
                    <div className="mb-4 text-center">
                        <label className="mr-2 text-gray-600">Select Year:</label>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="p-2 border border-gray-300 rounded"
                        >
                            {Array.from({ length: 5 }, (_, i) => (
                                <option key={i} value={dayjs().year() - i}>
                                    {dayjs().year() - i}
                                </option>
                            ))}
                        </select>
                    </div>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={monthlyRevenues} margin={{ left: 20, right: 10 }}>
                            <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                            <YAxis tickFormatter={(value) => formatDollarToVND(value)} width={90} />
                            <Tooltip formatter={(value) => formatDollarToVND(value)} />
                            <Bar dataKey="revenue" fill="#82ca9d" barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="w-[30%] bg-white p-6 shadow-lg rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">Order Status Distribution</h2>
                    {orderStatusData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={orderStatusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {orderStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-gray-500">No data available</p>
                    )}
                </div>
            </div>

            <div className="md:col-span-4 p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">Daily Revenue Chart</h2>
                <div className="mb-4 text-center">
                    <label className="mr-2 text-gray-600">Select Month:</label>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="p-2 border border-gray-300 rounded"
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                Month {i + 1}
                            </option>
                        ))}
                    </select>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={dailyRevenues} margin={{ left: 20, right: 10 }}>
                        <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(value) => formatDollarToVND(value)} width={90} />
                        <Tooltip formatter={(value) => formatDollarToVND(value)} />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="md:col-span-4 p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">Best Selling Products</h2>
                <div className="max-h-80 overflow-y-auto border border-gray-200">
                    <table className="min-w-full bg-white border-collapse">
                        <thead className="bg-gray-100 uppercase sticky top-0 z-10">
                            <tr>
                                <th className="p-3 text-left">Image</th>
                                <th className="p-3 text-left">Product Name</th>
                                <th className="p-3 text-left">Price</th>
                                <th className="p-3 text-left">Sold</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bestSellingProducts.map((product) => (
                                <tr key={product._id} className="border-t">
                                    <td className="p-3">
                                        <img
                                            src={product.thumb}
                                            alt={product.name}
                                            className="w-16 h-16 object-cover rounded-md"
                                        />
                                    </td>
                                    <td className="p-3">{product.title}</td>
                                    <td className="p-3">{formatDollarToVND(product.price)}</td>
                                    <td className="p-3">{product.sold}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="md:col-span-4 p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold mb-8 text-center text-gray-700">New Order Needs Confirmation</h2>
                <table className="min-w-full uppercase bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 text-left">Order ID</th>
                            <th className="p-3 text-left">Order status</th>
                            <th className="p-3 text-left">Order date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newestOrder.map((newOrder) => (
                            <tr key={newOrder._id} className="border-t">
                                <td className="p-3">{newOrder._id}</td>
                                <td className="p-3">
                                    <span className="bg-yellow-500 text-white px-2 py-1 rounded">
                                        {newOrder.status}
                                    </span>
                                </td>
                                <td className="p-3">{moment(newOrder.createdAt)?.format('HH:mm:ss DD/MM/YYYY')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
