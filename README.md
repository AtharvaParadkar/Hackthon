\#  Raag App



A full-stack Insurance claim application consisting of:



\- \*\*BFSI Aap\*\* — Mobile App (Flutter)

\- \*\*Backend\*\* — Node.js REST API

\- \*\*Frontend\*\* — Web App (React)



---



\## 📁 Project Structure



```

/

├── bfsi-app/        # BFSI Aap — Mobile Application

├── backend/       # Node.js Backend API

└── frontend/      # React Web Application

```



---



\## 📱 BFSI Aap — Mobile App



\*\*BFSI Aap\*\* is the mobile application built with Flutter. It is the primary app through which users interact with the BFSI platform on their smartphones.



\### Prerequisites



\- Flutter SDK

\- Android Studio (for Android) or Xcode (for iOS)



\### Steps to Run



```bash

\# 1. Navigate to the mobile directory

cd bfsi_app



\# 2. Install dependencies

flutter pub get



\# 3. Start the app

flutter run



```



---



\## 🖥️ Backend — Node.js API



The backend powers all the data and logic for both the mobile and web apps.



\### Prerequisites



\- Node.js (v18 or above)

\- npm



\### Steps to Run



```bash

\# 1. Navigate to the backend directory

cd backend



\# 2. Install dependencies

npm i



\# 3. Start the development server

npm run dev

```



> The backend server will start at `http://localhost:5000` (or as configured in your `.env` file).



\### Environment Variables



Create a `.env` file in the `backend/` directory:



```env

PORT=5000

DATABASE\_URL=your\_database\_url

JWT\_SECRET=your\_jwt\_secret

```



---



\## 🌐 Frontend — React Web App



The frontend is a web application built with \*\*React\*\*. It provides a browser-based interface to the Raag platform.



\### Prerequisites



\- Node.js (v18 or above)

\- npm



\### Steps to Run



```bash

\# 1. Navigate to the frontend directory

cd frontend



\# 2. Install dependencies

npm install



\# 3. Start the development server

npm start

```



> The web app will open at `http://localhost:3000` in your browser.



\### Build for Production



```bash

\# Create an optimized production build

npm run build

```



---



\## 🚀 Running the Full Project



To run all three parts together, open \*\*three separate terminals\*\*:



| Terminal | Directory  | Command       |

|----------|------------|---------------|

| 1        | `backend/` | `npm run dev` |

| 2        | `frontend/`| `npm start`   |

| 3        | `bfsi_app/`  | `flutter run`   |



---



\## 🛠️ Tech Stack



| Layer    | Technology          |

|----------|---------------------|

| Mobile   | Flutter |

| Backend  | Node.js, Express    |

| Frontend | React.js            |



---



\## 📬 Contributing



Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.



---



\## 📄 License



\[MIT](LICENSE)

