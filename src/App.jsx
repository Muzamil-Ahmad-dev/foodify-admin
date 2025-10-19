import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AdminNavbar from "./components/adminNav/AdminNavbar";
import AddItemPage from "./pages/addItem/AddItem";
import ListItemsPage from "./pages/List-items/ListItems";
import OrdersPage from "./pages/orderPage/OrderPage";
import LoginModal from "./components/adminNav/login/Login";

export default function App() {
  return (
    <Router>
      <AdminNavbar />
        <Routes>
          <Route path="/" element={<Navigate to="/orders" />} />
          <Route path="/additem" element={<AddItemPage />} />
          <Route path="/listitem" element={<ListItemsPage />} />
          <Route path="/orders" element={<OrdersPage/>}/>
          
        </Routes>
    
    </Router>
  );
}
