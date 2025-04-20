import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleBook } from "../../features/books/bookSlice.js";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Tabs, Tab } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import axios from "../../services/axios.js";
import { toast } from 'react-toastify';



import L from "leaflet";

// Fix for default marker icon issues
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});




function SingleBook() {
    const {id} = useParams();
    const dispatch = useDispatch();
    const [tabValue, setTabValue] = useState(0);
    const [bookReviewExists,setBookReviewExists] = useState(false);
    const [ownerReviewExists,setOwnerReviewExists] = useState(false);
    const [requestExists,setRequestExists] = useState(false)
    const [reviewType, setReviewType] = useState(""); // "book" or "owner"

    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: '',
    });
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestData, setRequestData] = useState({
    requestDays:0});

    const { singleBook,isLoading } = useSelector((state) => state.book);
    const {user} = useSelector((state)=> state.auth)



    useEffect(()=>{
        const fetchSingleBook=()=>{
            dispatch(getSingleBook(id));
           
        }
        fetchSingleBook();
    },[dispatch,id])
    useEffect(()=>{
        const checkBookReview = async ()=>{
            try{
                const res = await axios.get(`api/review/checkbookreviewuser/${singleBook._id}`);
                console.log(res)
                setBookReviewExists(res.data.success)
            }catch(error){
                console.log("error in fetching checkBookReview")
            }
        }
        const checkLenderReview = async ()=>{
            try{
                const res = await axios.get(`api/review/checklenderreviewuser/${user._id}`);
                console.log(res)
                setOwnerReviewExists(res.data.success)
            }catch(error){
                console.log("error in fetching checkBookReview")
            }
        }
        const checkBookRequest= async ()=>{
            try{
                const res = await axios.get(`api/request/checkrequestforbook/${singleBook._id}`);
                console.log(res)
                setRequestExists(res.data.success)
            }catch(error){
                console.log("error in fetching checkBookRequest")
            }
        }
        checkBookReview();
        checkLenderReview();
        checkBookRequest();
    },[user._id,singleBook._id])





    const handleReviewSubmit = async (e)=>{
        e.preventDefault();
      
        try {
             await axios.post(`/api/review/addbookreview/${singleBook._id}`, {
              rating: reviewData.rating,
              comment: reviewData.comment,
            });
            setShowReviewModal(false);
            //console.log(res)
            toast.success("Review submitted!");
          } catch (err) {
            toast.error(err.response?.data?.message || "Error submitting review");
          }
    };
    const handleRequestSubmit = async (e)=>{
        e.preventDefault();
     
        try {
            await axios.post(`/api/request/create/${singleBook._id}`, {
                requestedDays: requestData.requestDays,
            });
            setShowRequestModal(false);
            //console.log(res)
            toast.success("Book request sent!");
          } catch (err) {
            toast.error(err.response?.data?.message || "Error sending request");
          }
    };




    if (isLoading) return <div>Loading...</div>;
    const position = [singleBook.location.coordinates[1], singleBook.location.coordinates[0]];


    return (
        <div className="p-6">
        {/* Carousel */}
            <div className='flex flex-col md:flex-row gap-8 mb-8'>
                <div className="mb-6  overflow-hidden  h-[450px] w-full md:w-3/5">
                <Carousel
                    showArrows
                    showThumbs
                    showStatus={false}
                    infiniteLoop
                    autoPlay
                >
                    {singleBook.imageBase64.length ? (
                    singleBook.imageBase64.map((img, idx) => (
                        <div key={idx}>
                        <img src={`${img}`} alt={`singleBook-${idx}`} className="object-contain h-[450px] w-3/5" />
                        </div>
                    ))
                    ) : (
                    <div>
                        <img src="https://via.placeholder.com/800x400?text=No+Image" alt="placeholder" />
                    </div>
                    )}
                </Carousel>
                </div>
                <div>
                    {/* Book Info */}
                    <div className="p-6 rounded-2xl mb-2">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{singleBook.title}</h1>
                        <h2 className="text-xl text-gray-600 mb-4">by {singleBook.author}</h2>
                        <p className="text-gray-700 mb-4">{singleBook.description}</p>
                        <p ><span className="font-semibold">Genre:</span> {singleBook.genre}</p>
                        <p><span className="font-semibold">Condition:</span> {singleBook.condition}</p>
                        <p><span className="font-semibold">Price:</span> ₹{singleBook.price} / day</p>
                        <p ><span className="font-semibold">Location:</span> {singleBook.colony}, {singleBook.city}, {singleBook.state}, {singleBook.country}</p>
                    </div>
                    {/* Owner Info */}
                    <div className="p-6 rounded-2xl mb-2">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Owner Details</h3>
                        <p className="mb-1"><span className="font-semibold">Name:</span> {singleBook.owner.firstName} {singleBook.owner.lastName}</p>
                        <p className="mb-1"><span className="font-semibold">Email:</span> {singleBook.owner.email}</p>
                        <p className="mb-1"><span className="font-semibold">Location:</span> {singleBook.owner.colony}, {singleBook.owner.city}, {singleBook.owner.state}, {singleBook.owner.country}</p>
                    </div>
                    <div className="col-span-full mt-2">
                        <button
                            onClick={() => {
                                setShowRequestModal(true);
                            }}
                            className="px-8 py-2 mx-2 font-semibold text-md text-white bg-primary rounded-xl hover:shadow-lg hover:shadow-primary"
                        >
                        Request
                        </button>
                        <button
                           onClick={() => {
                                setShowReviewModal(true);
                                setReviewType(""); // Reset on every open
                            }}
                            className="px-8 py-2 font-semibold mx-2 text-md text-white bg-primary rounded-xl hover:shadow-lg hover:shadow-primary"
                        >
                        Review                    
                        </button>
                    </div>
    
                </div>
            </div>
            <div className='flex gap-4 lg:gap-8 my-2 flex-col md:flex-row'>
                {/* Reviews Tabs */}
                {/* Map */}
                <div className="bg-white rounded-2xl  h-[450px] w-full md:w-3/5">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <LocationOnIcon className="text-red-500 mr-2" /> Book Location
                    </h3>
                    <MapContainer center={position} zoom={13} scrollWheelZoom={false} className="h-[400px] w-full rounded-xl z-0">
                        <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={position}>
                        <Popup>
                            {singleBook.title} - {singleBook.city}
                        </Popup>
                        </Marker>
                    </MapContainer>
                </div>
                <div className="bg-white rounded-2xl  h-[450px]  w-full md:w-2/5">
                <Tabs
                    value={tabValue}
                    onChange={(e, newVal) => setTabValue(newVal)}
                    textColor="inherit"
                    TabIndicatorProps={{ style: { backgroundColor: '#9333ea' } }}
                    sx={{
                    '& .MuiTab-root': {
                        color: '#6b21a8', // Inactive tab color
                    },
                    '& .Mui-selected': {
                        color: '#9333ea', // Active tab text color
                    },
                    }}
                >
                    <Tab label="Book Reviews" sx={{fontWeight:"bolder"}} />
                    <Tab label="Owner Reviews" sx={{fontWeight:"bolder"}}/>
                </Tabs>
        
                <div className="mt-4">
                    {tabValue === 0 ? (
                    <div>
                        {singleBook.reviews?.length > 0 ? (
                        singleBook.reviews.map((review, i) => (
                            <div key={i} className="p-4 border-b border-gray-200">
                            <p className=" text-secondary font-bold text-xl ">Rating: {review.rating}</p>
                            <p className="text-gray-700">{review.comment}</p>
                            
                            </div>
                        ))
                        ) : (
                        <p className="text-gray-500">No singleBook reviews available.</p>
                        )}
                    </div>
                    ) : (
                    <div>
                        {singleBook.owner.reviews?.length > 0 ? (
                        singleBook.owner.reviews.map((review, i) => (
                            <div key={i} className="p-4 border-b border-gray-200">
                            <p className="text-gray-700">{review.comment}</p>
                            <p className="text-sm text-gray-500">Rating: {review.rating}</p>
                            </div>
                        ))
                        ) : (
                        <p className="text-gray-500">No owner reviews available.</p>
                        )}
                    </div>
                    )}
                </div>
                </div>
            </div>

            {showReviewModal && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
                    <div className="relative w-full max-w-lg mx-auto bg-white p-6 rounded-xl shadow-xl">
                    
                    {/* Close button */}
                    <button
                        onClick={() => setShowReviewModal(false)}
                        className="absolute top-3 right-4 text-secondary hover:text-primary hover:rotate-45 transition text-4xl font-bold"
                    >
                        &times;
                    </button>

                    {/* Review Type Selection */}
                    {!reviewType && (
                        <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-6 text-secondary">What would you like to review?</h2>
                        <div className="flex justify-center gap-6">
                            <button
                            onClick={() => setReviewType("book")}
                            className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:shadow-md"
                            >
                            Review Book
                            </button>
                            <button
                            onClick={() => setReviewType("owner")}
                            className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:shadow-md"
                            >
                            Review Owner
                            </button>
                        </div>
                        </div>
                    )}

                    {/* Conditional Form Rendering */}
                    {reviewType === "book" && (
                        bookReviewExists ? (
                        <div className="text-center py-10 text-lg font-semibold text-gray-700">
                            You have already reviewed this book.
                        </div>
                        ) : (
                        <>
                            <h2 className="text-2xl font-semibold mb-4 text-center text-primary">Add Book Review</h2>
                            <form onSubmit={handleReviewSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1 font-medium">Rating (1 to 5)</label>
                                <input
                                type="number"
                                min="1"
                                max="5"
                                value={reviewData.rating}
                                onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })}
                                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-primary outline-none"
                                required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">Comment</label>
                                <textarea
                                rows="4"
                                value={reviewData.comment}
                                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-primary outline-none"
                                required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2 bg-primary text-white rounded-md hover:shadow-lg font-semibold"
                            >
                                Submit Review
                            </button>
                            </form>
                        </>
                        )
                    )}

                    {reviewType === "owner" && (
                        ownerReviewExists ? (
                        <div className="text-center py-10 text-lg font-semibold text-gray-700">
                            You have already reviewed the owner.
                        </div>
                        ) : (
                        <>
                            <h2 className="text-2xl font-semibold mb-4 text-center text-primary">Add Owner Review</h2>
                            <form onSubmit={handleRequestSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1 font-medium">Rating (1 to 5)</label>
                                <input
                                type="number"
                                min="1"
                                max="5"
                                value={reviewData.rating}
                                onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })}
                                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-secondary outline-none"
                                required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">Comment</label>
                                <textarea
                                rows="4"
                                value={reviewData.comment}
                                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-secondary outline-none"
                                required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2 bg-secondary text-white rounded-md hover:shadow-lg font-semibold"
                            >
                                Submit Review
                            </button>
                            </form>
                        </>
                        )
                    )}
                    </div>
                </div>
            )}

            {showRequestModal && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
                    <div className="relative w-full max-w-lg mx-auto bg-white p-6 rounded-xl shadow-xl">
                    {/* Close button */}
                    <button
                        onClick={() => setShowRequestModal(false)}
                        className="absolute top-3 right-4  text-secondary hover:text-primary hover:rotate-45 transition text-4xl font-bold"
                    >
                        &times;
                    </button>
                    {!requestExists ? (
                        <>
                            <h2 className="text-2xl font-semibold mb-4 text-center text-primary">Add Your Review</h2>

                                <form
                                    onSubmit={handleRequestSubmit}
                                    className="space-y-4"
                                >
                                    <div>
                                    <label className="block mb-1 font-medium">No of days need</label>
                                    <input
                                        type="number"
                                        value={requestData.requestDays}
                                        onChange={(e) => setRequestData({ ...requestData, requestDays: e.target.value })}
                                        className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-primary outline-none"
                                        required
                                    />
                                    </div>
                                    <button
                                    type="submit"
                                    className="w-full py-2 bg-primary text-white rounded-md hover:shadow-lg font-semibold"
                                    >
                                        Request
                                    </button>
                                </form>
                        </>
                        
                    ):(
                        <div className="text-center py-10 text-lg font-semibold text-gray-700">
                        You have already requested this book.
                        </div>
                    )
                    
                    }
                    
                    </div>
                </div>
            )}

      </div>
    );
}

export default SingleBook;