import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import ForYou from "./ForYou";
import Search from "./Search";
import BookDetails from "./BookDetails";
import ProtectedRoute from "./ProtectedRoute";
import "../style.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<App />} />
        <Route path="/for-you" element={<ProtectedRoute><ForYou /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="/book/:id" element={<ProtectedRoute><BookDetails /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
