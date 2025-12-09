# Ayursutra - Modern Ayurveda Management Platform 🌿

Ayursutra is a premium, full-stack clinic management system designed for Ayurvedic practitioners and franchise centers. It combines ancient wisdom with modern technology, featuring real-time appointment scheduling, inventory tracking, telemedicine capabilities, and a Progressive Web App (PWA) interface.

## 🚀 Key Features

*   **Premium Scheduling**: Intelligent booking system with "Best Muhurat" logic and resource allocation (Room/Therapist).
*   **Role-Based Portals**:
    *   **Patient**: Book therapies, view medical history, innovative "Adverse Reaction" safety protocol.
    *   **Practitioner**: Live queue management, "Upcoming" appointments filter, automated SMS/Call triggers.
    *   **Admin**: Comprehensive dashboard for Revenue, Inventory (Stock tracking), and Franchise management.
*   **PWA Mobile App**: Installable on iOS/Android with offline capabilities and native-like performance.
*   **Notifications**: Automated SMS (via Twilio/Mock) and Voice Call reminders for Pre/Post-procedure care.
*   **Reports**: PDF generation for medical reports, booking receipts, and financial analytics.

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), TypeScript, Tailwind CSS
*   **Design**: Custom "Premium" CSS (Glassmorphism, Parallax), Lucide Icons, Recharts
*   **Backend / Database**: Firebase Firestore (NoSQL), Firebase Auth
*   **Serverless**: Vercel Serverless Functions (`api/`) for secure Twilio integration.
*   **PWA**: `vite-plugin-pwa` for Service Worker & Manifest generation.

## 📦 Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/madhavcvedpathak/ayursutraMain.git
    cd panchkarma
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env` file in the root with your Firebase and Twilio credentials:
    ```env
    VITE_FIREBASE_API_KEY=your_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    # ... other firebase config
    TWILIO_ACCOUNT_SID=your_sid
    TWILIO_AUTH_TOKEN=your_token
    TWILIO_PHONE_NUMBER=your_number
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

5.  **Build for Production**:
    ```bash
    npm run build
    ```

## 📱 Mobile PWA Instructions

1.  Deploy the application (e.g., to Vercel).
2.  Open the URL on your mobile browser (Chrome/Safari).
3.  Tap "Add to Home Screen" to install Ayursutra as a native-like app.

## 📄 License

Proprietary software developed for Ayursutra Clinics.
