import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TutorFilter = () => {
    const [tutors, setTutors] = useState([]);
    const [filter, setFilter] = useState({
        subject: '',
        nameStartsWith: '',
        minExperience: '',
        maxExperience: '',
        availability: '',  // Added availability filter
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilter({ ...filter, [name]: value });
    };

    const fetchTutors = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.get('https://lms-backend-ufn7.onrender.com/api/v1/filtertutor/filter', { params: filter });
            setTutors(data);
        } catch (err) {
            setError('Failed to fetch tutors');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchTutors();
    };

    const handleSeeLessons = (tutor) => {
        navigate(`/tutors/lessons/${tutor.tutorId}`);
    };

    // Function to format the scheduledClass as Day/Date
    const formatScheduledClass = (dateString) => {
        const date = new Date(dateString);
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-center mb-6">Find a Tutor</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="subject" className="block font-medium text-gray-700">
                        Subject
                    </label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={filter.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>

                <div>
                    <label htmlFor="nameStartsWith" className="block font-medium text-gray-700">
                        Name starts with
                    </label>
                    <input
                        type="text"
                        id="nameStartsWith"
                        name="nameStartsWith"
                        value={filter.nameStartsWith}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>

                <div>
                    <label htmlFor="availability" className="block font-medium text-gray-700">
                        Availability
                    </label>
                    <input
                        type="text"
                        id="availability"
                        name="availability"
                        value={filter.availability}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                    Search Tutors
                </button>
            </form>

            {loading && <p className="text-center mt-4">Loading...</p>}

            {tutors.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-xl font-semibold">Tutors Found</h3>
                    <ul>
                        {tutors.map((tutor) => (
                            <li key={tutor.tutorId} className="border-b py-4">
                                <h4 className="text-lg font-bold">{tutor.name}</h4>
                                <p>{tutor.experience} years of experience</p>
                                <p>{tutor.subjects.join(', ')}</p>

                                {/* Displaying scheduledClass formatted as Day/Date */}
                                {tutor.scheduledClass && (
                                    <p><strong>Scheduled Class:</strong> {formatScheduledClass(tutor.scheduledClass)}</p>
                                )}

                                <button
                                    onClick={() => handleSeeLessons(tutor)}
                                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                    See Lessons
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default TutorFilter;
