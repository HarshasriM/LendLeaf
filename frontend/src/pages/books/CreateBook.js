import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { createBook } from "../../features/books/bookSlice.js";
import { useNavigate } from 'react-router-dom';

function CreateBook() {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        genre: '',
        condition: '',
        price: '',
        colony: '',
        city: '',
        district: '',
        state: '',
        country: '',
        images: []
      });
      const [images, setImages] = useState([]);
      const [previewUrls, setPreviewUrls] = useState([]);

      const dispatch = useDispatch();
      const navigate = useNavigate();
      const { isLoading } = useSelector((state) => state.book);

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      };
      const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        const previews = files.map((file) => URL.createObjectURL(file));
        setPreviewUrls(previews);
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        // const updatedFormData = {
        //     ...formData,
        //     images: images,
        //   };
       
        //console.log(updatedFormData)
        const data = new FormData();

        for (const key in formData) {
        data.append(key, formData[key]);
        }

        images.forEach((image) => {
        data.append("images", image); // must match multer field name
        });

        dispatch(createBook(data));
        if(!isLoading)
            navigate("/books")
      }
    
    return (
        <div className="px-10 py-8 flex items-center flex-col">
            <Typography
            variant="h4"
            gutterBottom
            sx={{
                color: "#9333ea",
                fontFamily: '"Anton", sans-serif',
                fontWeight: 600,
                fontSize: { xs: '30px', md: '40px' },
                textShadow: '0px 4px 10px rgba(0,0,0,0.2)',
                textAlign: "start",
                marginBottom: '20px'
            }}
            >
            Create Book
            </Typography>
    
            <form onSubmit={handleSubmit} className="w-full max-w-3xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <Typography variant="subtitle" className="font-bold text-black mt-4 mb-2">BookDetails</Typography>
                    </div>
        
                    {[
                    { label: 'Title', name: 'title' },
                    { label: 'Author', name: 'author' },
                    { label: 'Genre', name: 'genre' },
                    { label: 'Condition', name: 'condition' },
                    { label: 'Price (₹)', name: 'price', type: 'number' },
                    { label: 'Description', name: 'description' }
                    ].map(({ label, name, type = 'text' }) => (
                    <div key={name} className="sm:col-span-1">
                        <label htmlFor={name} className="block text-md font-semibold  text-secondary">{label}</label>
                        <input
                        required
                        type={type}
                        id={name}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className="form-input mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 placeholder:text-gray-500 focus:ring-2 focus:ring-custom-green-light sm:text-sm"
                        />
                    </div>
                    ))}
        

                    <div className="sm:col-span-2">
                    <Typography variant="subtitle" className="font-bold text-black mt-4 mb-2">Address</Typography>
                    </div>
        
                    {[
                    { label: 'Colony', name: 'colony' },
                    { label: 'City', name: 'city' },
                    { label: 'District', name: 'district' },
                    { label: 'State', name: 'state' },
                    { label: 'Country', name: 'country' }
                    ].map(({ label, name }) => (
                    <div key={name}>
                        <label htmlFor={name} className="block text-md font-semibold  text-secondary">{label}</label>
                        <input
                        required
                        id={name}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className="form-input mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 placeholder:text-gray-500 focus:ring-2 focus:ring-custom-green-light sm:text-sm"
                        />
                    </div>
                    ))}
        
                    <div className="sm:col-span-2 mt-4">
                        <label htmlFor="images" className="block font-bold text-black mt-4 mb-2">Upload Book Images</label>
                        <input
                            required
                            type="file"
                            id="images"
                            name="images"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
                        />
                    </div>
                    
                    <div className="flex justify-evenly gap-4 mt-4">
                        {previewUrls.map((url, idx) => (
                            <img
                            key={idx}
                            src={url}
                            alt={`preview-${idx}`}
                            className="h-24 w-24 object-cover rounded-md ring-2 ring-gray-300 shadow"
                            />
                        ))}
                    </div>

                    <div className="col-span-full mt-2">
                        <button
                            type="submit"
                            className="px-6 py-3 font-bold text-md text-white bg-secondary rounded-full hover:shadow-lg hover:shadow-primary"
                        >
                            {isLoading? "creating": "Create Book"}
                        </button>
                    </div>
                </div>
            </form>
      </div>
    );
}

export default CreateBook;