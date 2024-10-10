// src/router.js
import { Routes, Route } from "react-router-dom";
import ChatbotCRMTable from './pages/CRM'// Your home page
import Home from './pages/home'; // Chatbot component

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={ <Home/> } />
      <Route path="/crm" element={ <ChatbotCRMTable/> } />
    </Routes>
  );
};

export default AppRouter;
