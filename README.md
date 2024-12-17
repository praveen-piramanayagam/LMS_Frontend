# LMS_Frontend

This is the frontend repository for a Learning Management System (LMS) that allows students and tutors to interact with the backend system, book lessons, make payments, and join scheduled classes. The frontend is built using React and Tailwind CSS, providing a responsive and user-friendly interface.

## Features

- **User Authentication:** Secure login for both students and tutors using JWT authentication.
- **Lesson Booking:** Browse and book lessons with integrated payment via Razorpay.
- **Payment Integration:** Process payments using Razorpay and handle order creation and verification.
- **Scheduled Classes:** View upcoming classes, meeting links, and session details.
- **Email Notifications:** Students and tutors receive email updates about order and payment status.

## Tech Stack

- **React**: JavaScript library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Axios**: Promise-based HTTP client for making API requests.
- **React Router**: Library for navigation and routing in React.
- **Razorpay**: Payment gateway for handling payments.

## Installation

Follow these steps to get the frontend up and running:

1. **Clone the repository**

   ```bash
   git clone https://github.com/praveen-piramanayagam/LMS_Frontend.git
   cd LMS_Frontend

2. **Install dependencies**
npm install

3. **Start the development server**
npm start

**Pages and Components**
1. Login Page
Description: A login page where students and tutors can sign in using their credentials.
Features:
- JWT-based authentication.
- User redirection after login.
2. Lesson Booking Page
Description: A page where students can view available lessons and book them.
Features:
- Display lesson details such as title, tutor, price, and schedule.
- Razorpay integration to process payments.
- Order creation upon booking a lesson.
3. Payment Verification Page
Description: A page to verify payment after completing the Razorpay checkout.
Features:
- Payment ID and order ID are sent to the backend for verification.
- Email notifications sent to both student and tutor after payment verification.
