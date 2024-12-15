import React from 'react';

const CreateLessonForm = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Create New Lesson</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={newLesson.title}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Description</label>
                            <textarea
                                name="description"
                                value={newLesson.description}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            ></textarea>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                value={newLesson.subject}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Duration</label>
                            <input
                                type="number"
                                name="duration"
                                value={newLesson.duration}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={newLesson.price}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveLesson}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
    );
};

export default CreateLessonForm;