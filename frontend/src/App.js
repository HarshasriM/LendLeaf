
import './App.css';
import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import VerifyOtp from "./components/auth/VerifyOtp.js"
import Home from './pages/Home.js';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookDetails from './pages/books/BookDetails.js';
import SingleBook from './pages/books/SingleBook.js';
import CreateBook from './pages/books/CreateBook.js';
function App() {
  return (
    <Router>
    <Navbar />
    <div className="pt-20 px-4"> {/* Padding to avoid navbar overlap */}
      <ToastContainer position="top-center" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/books" element={<BookDetails />} />
        <Route path='/book/:id' element={<SingleBook/>} />
        <Route path='/book/create' element={<CreateBook/>} />
      </Routes>
      

    </div>
  </Router>
  );
}

export default App;
