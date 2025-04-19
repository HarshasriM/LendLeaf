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
    const { singleBook,isLoading } = useSelector((state) => state.book);
   
    useEffect(()=>{
        const fetchSingleBook=()=>{
            dispatch(getSingleBook(id));
           
        }
        fetchSingleBook()
    },[dispatch,id])

    
    if (isLoading) return <div>Loading...</div>;
    const position = [singleBook.location.coordinates[1], singleBook.location.coordinates[0]];
    return (
        <div className="p-6">
        {/* Carousel */}
        <div className='flex gap-8 mb-8'>
            <div className="mb-6  overflow-hidden  h-[450px] w-3/5">
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
                    className="px-8 py-2 mx-2 font-semibold text-md text-white bg-primary rounded-xl hover:shadow-lg hover:shadow-primary"
                    >
                    Request
                    </button>
                    <button
                    className="px-8 py-2 font-semibold mx-2 text-md text-white bg-primary rounded-xl hover:shadow-lg hover:shadow-primary"
                    >
                    Review                    
                    </button>
                </div>
  
            </div>
        </div>
        <div className='flex gap-8 my-2'>
            {/* Reviews Tabs */}
             {/* Map */}
            <div className="bg-white p-6 rounded-2xl  h-[450px] w-3/5">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <LocationOnIcon className="text-red-500 mr-2" /> Book Location
                </h3>
                <MapContainer center={position} zoom={13} scrollWheelZoom={false} className="h-[400px] w-full rounded-xl">
                    <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position}>
                    <Popup>
                        {singleBook.title} - {singleBook.city}
                    </Popup>
                    </Marker>
                </MapContainer>
            </div>
            <div className="bg-white p-6 rounded-2xl  h-[450px] w-2/5">
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
       
      </div>
    );
}

export default SingleBook;