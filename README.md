\#  Raag App



A full-stack Insurance claim application consisting of:



\- \*\*Raag Aap\*\* — Mobile App (React Native)

\- \*\*Backend\*\* — Node.js REST API

\- \*\*Frontend\*\* — Web App (React)



---



\## 📁 Project Structure



```

/

├── raag-app/        # Raag Aap — Mobile Application

├── backend/       # Node.js Backend API

└── frontend/      # React Web Application

```



---



\## 📱 Raag Aap — Mobile App



\*\*Raag Aap\*\* is the mobile application built with React Native. It is the primary app through which users interact with the Raag platform on their smartphones.



\### Prerequisites



\- Node.js (v18 or above)

\- npm or yarn

\- Expo CLI / React Native CLI

\- Android Studio (for Android) or Xcode (for iOS)



\### Steps to Run



```bash

\# 1. Navigate to the mobile directory

cd raag-app



\# 2. Install dependencies

npm install



\# 3. Start the app

npm start



\# For Android

npm run android



\# For iOS

npm run ios

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

| 3        | `raag-app/`  | `npm start`   |



---



\## 🛠️ Tech Stack



| Layer    | Technology          |

|----------|---------------------|

| Mobile   | React Native (Expo) |

| Backend  | Node.js, Express    |

| Frontend | React.js            |



---



\## 📬 Contributing



Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.



---



\## 📄 License



\[MIT](LICENSE)

