import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
function SingleBook() {
    const {id} = useParams();
    const [book,setBook] = useState({})
    useEffect(()=>{
        const fetchSingleBook = async ()=>{
            const response =await axios.get(`http://localhost:4000/api/books/${id}`);
            setBook(response.data)
        }
        fetchSingleBook()
    },[])
    return (
        <div>
            
        </div>
    );
}

export default SingleBook;