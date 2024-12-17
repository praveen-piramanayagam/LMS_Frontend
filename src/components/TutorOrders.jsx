import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TutorOrders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // To indicate the loading state

    // Helper to decode JWT
    const decodeJWT = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (err) {
            console.error('Error decoding JWT:', err);
            return null;
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = sessionStorage.getItem('jwtToken'); // Fetch JWT from sessionStorage
                if (!token) {
                    setError('JWT token not found. Please log in again.');
                    setLoading(false);
                    return;
                }

                const decodedToken = decodeJWT(token);
                if (!decodedToken || !decodedToken.tutor_id) {
                    setError('Invalid JWT token or tutor ID not found.');
                    setLoading(false);
                    return;
                }

                const tutorId = decodedToken.tutor_id; // Extract tutor ID from the token
                console.log('Tutor ID:', tutorId); // Debugging log

                const response = await axios.post(
                    'https://lms-backend-ufn7.onrender.com/api/v1/order/tutororderdetails', // API endpoint
                    { tutor_id: tutorId }, // Request body
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Send token in headers for validation
                        },
                    }
                );

                console.log('API Response:', response.data); // Debugging log
                setOrders(response.data.orders || []); // Set orders in state
                setError(null); // Clear error if any
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError(err.response?.data?.error || 'Failed to fetch orders. Please try again later.');
            } finally {
                setLoading(false); // End loading state
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Show a loading message
    }

    if (error) {
        return <div className="error">{error}</div>; // Show error message
    }

    return (
        <div className="tutor-orders mt-10">
            <h1 className="text-2xl font-bold mb-5">Tutor Orders</h1>
            {orders.length === 0 ? (
                <p>No orders found for this tutor.</p>
            ) : (
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Order ID</th>
                            <th className="border border-gray-300 px-4 py-2">Title</th>
                            <th className="border border-gray-300 px-4 py-2">Amount</th>
                            <th className="border border-gray-300 px-4 py-2">Student Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.order_id}>
                                <td className="border border-gray-300 px-4 py-2">{order.order_id}</td>
                                <td className="border border-gray-300 px-4 py-2">{order.title}</td>
                                <td className="border border-gray-300 px-4 py-2">₹{order.amount}</td>
                                <td className="border border-gray-300 px-4 py-2">{order.student_email || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TutorOrders;
