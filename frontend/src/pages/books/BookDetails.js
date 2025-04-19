import { useDispatch,useSelector} from "react-redux";
import { getAllBooks } from "../../features/books/bookSlice.js";
import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
function BookDetails() {
    const dispatch = useDispatch();
    
    const booksData = useSelector((state) => state.book.allBooks);
    const isLoading = useSelector((state) => state.book.isLoading);
    const fetchAllBooks = ()=>{
          dispatch(getAllBooks());
    }
    useEffect(() => {
        fetchAllBooks();
      }, []);
    return (
        <div className="p-10">
        <h1 className="text-3xl font-bold text-custom-green-dark mb-6">Available Books</h1>
        
        {isLoading ? (
          <p>Loading books...</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
            {booksData.map((book) => (
              <Link to={`/book/${book._id}`}>
                <div key={book._id} className="w-fit bg-background rounded-2xl shadow-primary hover:shadow-lg shadow-primary transition-shadow duration-300 p-4">
                {/* Book image or placeholder */}
                <div className="w-60 h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                  {/* You can replace with <img src={book.imageUrl} /> */}
                  {/* <span className="text-5xl">📘</span> */}
                  <img className="rounded-2xl" src={book.imageBase64[0]} alt="BookImage"/>
                </div>
  
                <h2 className="text-lg font-semibold text-gray-800 mb-1">{book.title}</h2>
                <p className="text-gray-600 text-sm mb-1"><strong>Author:</strong> {book.author || "Unknown"}</p>
                <p className="text-gray-600 text-sm mb-1"><strong>Genre:</strong> {book.genre || "N/A"}</p>
                <p className="text-gray-800 text-sm font-medium mt-2">₹{book.price || 100}/day</p>
               </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
}

export default BookDetails;