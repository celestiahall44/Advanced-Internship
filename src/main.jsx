import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./Pages/Home/App";
import { FontSizeProvider } from "./FontSizeContext";
import ForYou from "./Pages/ForYou/ForYou";
import Search from "./Pages/Search/Search";
import BookDetails from "./Pages/BookDetails/BookDetails";
import ChoosePlan from "./Pages/ChoosePlan/ChoosePlan";
import Library from "./Pages/Library/Library";
import Player from "./Pages/Player/Player";
import Read from "./Pages/Read/Read";
import Payments from "./Pages/Payments/Payments";
import Settings from "./Pages/Settings/Settings";
import ProtectedRoute from "./ProtectedRoute";
import "../style.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <FontSizeProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<App />} />
        <Route path="/for-you" element={<ProtectedRoute><ForYou /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="/book/:id" element={<ProtectedRoute><BookDetails /></ProtectedRoute>} />
        <Route path="/choose-plan" element={<ProtectedRoute><ChoosePlan /></ProtectedRoute>} />
        <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
        <Route path="/player/:id" element={<ProtectedRoute><Player /></ProtectedRoute>} />
        <Route path="/read/:id" element={<ProtectedRoute><Read /></ProtectedRoute>} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
    </FontSizeProvider>
  </React.StrictMode>
);
