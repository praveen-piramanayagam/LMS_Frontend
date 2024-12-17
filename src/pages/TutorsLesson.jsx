import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TutorLessons = () => {
    const { tutorId } = useParams();
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [tutorDetails, setTutorDetails] = useState(null);

    // Get Bearer token from sessionStorage
    const bearerToken = sessionStorage.getItem('token'); // Dynamically retrieve the token

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const { data } = await axios.get(`http://localhost:3001/api/v1/lessons/tutor/getall/${tutorId}`);
                setLessons(data);
                if (data.length > 0) {
                    setTutorDetails(data[0].tutorId); // Assumes tutorId is in the lessons data
                }
            } catch (err) {
                setError('Failed to fetch lessons');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        
        const loadRazorpayScript = () => {
            const script = document.createElement('script');
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            script.onload = () => {
                console.log("Razorpay script loaded");
            };
            document.body.appendChild(script);
        };

        loadRazorpayScript();
        fetchLessons();
    }, [tutorId]);

    const handlePayNow = async (lessonId) => {
        try {
            // Step 1: Create the order initially with 'pending' status
            const response = await fetch("http://localhost:3001/api/v1/order/createorder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${bearerToken}`, // Hardcoded token here
                },
                body: JSON.stringify({ lesson_id: lessonId }), // Pass the actual lesson_id dynamically
            });
    
            const data = await response.json();
            console.log("Create Order Response:", data);
    
            if (data.error) {
                alert("Error creating order: " + data.error);
                return;
            }
    
            const { order_id, amount } = data; // Backend response (order_id and amount)
    
            // Step 2: Open Razorpay checkout with the created order_id
            const options = {
                key: "rzp_test_9qlbqULX5I6dyn", // Replace with your Razorpay key ID
                amount: amount * 100, // Amount in paisa (100 paisa = 1 INR)
                currency: "INR",
                order_id: order_id, // Razorpay order ID from the backend
                handler: async function (response) {
                    console.log("Payment response:", response); // Log the payment response
    
                    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
    
                    // Step 3: Verify the payment via the backend
                    const verifyResponse = await fetch("http://localhost:3001/api/v1/orderverify/verifypayment", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${bearerToken}`, // Pass token for payment verification
                        },
                        body: JSON.stringify({
                            razorpay_payment_id: razorpay_payment_id,
                            razorpay_order_id: razorpay_order_id,
                            razorpay_signature: razorpay_signature,
                        }),
                    });
    
                    const verifyData = await verifyResponse.json();
                    console.log("Verify Payment Response:", verifyData);
    
                    if (verifyData.error) {
                        alert("Payment verification failed: " + verifyData.error);
                    } else {
                        alert("Payment successful and verified!");
                        // Skip updating the order status to 'paid' for now
                    }
                },
                prefill: {
                    name: "Guest User", // Default name for guest users
                    email: "guest.user@example.com", // Default email for guest users
                    contact: "9999999999", // Default contact for guest users
                },
                theme: {
                    color: "#3399cc", // Customize the color of the Razorpay button
                },
            };
    
            const razorpay = new Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error("Error in payment:", error);
            alert("Payment failed! Check console for details.");
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 shadow-lg rounded-lg mt-[5rem]">
            <div className='text-center text-3xl text-gray-600 pt-5 pb-5'>
                You can purchase lesson here...Do check your inbox for confirmation and lesson will be added to your history...
            </div>
            <div className="mb-4">
        <button
            onClick={() => window.location.href = '/studentdashboard'} 
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded transition-colors"
        >
            ← Back to Dashboard
        </button>
    </div>
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {tutorDetails && (
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-center text-gray-800">
                    Lessons by {tutorDetails.name}
                </h2>
                <p className="text-center text-gray-600">{tutorDetails.email}</p>
            </div>
        )}
        {lessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessons.map((lesson) => (
                    <div
                        key={lesson.lesson_id}
                        className="bg-white shadow-md rounded-lg overflow-hidden p-6 transition-transform transform hover:scale-105"
                    >
                        <h4 className="text-xl font-semibold text-gray-800 mb-2">
                            {lesson.title}
                        </h4>
                        <p className="text-gray-700 mb-1">
                            <span className="font-medium text-gray-900">Subject:</span> {lesson.subject}
                        </p>
                        <p className="text-gray-700 mb-1">
                            <span className="font-medium text-gray-900">Description:</span> {lesson.description}
                        </p>
                        <p className="text-gray-700 mb-1">
                            <span className="font-medium text-gray-900">Duration:</span> {lesson.duration} minutes
                        </p>
                        <p className="text-gray-700 mb-4">
                            <span className="font-medium text-gray-900">Price:</span> {lesson.price} INR
                        </p>
                        <button
                            onClick={() => handlePayNow(lesson.lesson_id)} // Use lesson.lesson_id here
                            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors"
                        >
                            Pay Now
                        </button>
                    </div>
                ))}
            </div>
        ) : (
            !loading && <p className="text-center text-gray-600">No lessons found</p>
        )}
    </div>
    
    );
};

export default TutorLessons;
