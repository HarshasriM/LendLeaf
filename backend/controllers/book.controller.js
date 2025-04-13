import {convertToBase64,convertMultipleToBase64} from "../utils/imageUtils.js";
import Book from "../models/Book.model.js";
import axios from "axios";

// Create Book Controller
class BookController{
    //creating of book
    async createBook (req, res){
    try {
        const {title,author,description,genre,condition,price, colony,city,district,state,country} = req.body;

        const owner = req.user._id;

        // // Check if at least 3 images uploaded
        // if (!req.files || req.files.length < 3) {
        // return res.status(400).json({
        //     success: false,
        //     message: "Please upload at least 3 images.",
        // });
        // }

        // Convert uploaded buffers to base64
        const imageBase64 = req.files.map((file) =>
        convertToBase64(file)
        );

        // Combine full address string
        const fullAddress = `${colony}, ${city}, ${district}, ${state},${country}`;

        // Get geolocation from Mapbox
        const geoResponse = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            fullAddress
        )}.json`,
        {
            params: {
            access_token: process.env.MAP_TOKEN,
            },
        }
        );

        const [longitude, latitude] = geoResponse.data.features[0].center;

        const book = new Book({title,author,description,genre,condition,price,colony,city,district,state,country,owner,imageBase64,
        location: {
            type: "Point",
            coordinates: [longitude, latitude],
        },
        });

        await book.save();

        res.status(201).json({
        success: true,
        message: "Book created successfully",
        data: book,
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({
                success: false,
                data: {},
                message: error.message,
                err: error.name,
            });
    }   
    };
    //get all books and filtered
    async getBooks(req,res){
        try{
            const {search,genre,minPrice,maxPrice} = req.query;
            const filters = {isAvailable: true,};
          
            // Single search input — check multiple fields
            if (search) {
                const regex = new RegExp(search, 'i'); // case-insensitive match
                filters.$or = [{ title: regex },{ author: regex },{ district: regex },{ state: regex },{ colony: regex }];
            };
          
            // Genre filter (string match)
            if (genre) {
                filters.genre = new RegExp(`(^|,)${genre}($|,)`, "i");
            }
          
            // Price Range
            if (minPrice || maxPrice) {
                filters.price = {};
                if (minPrice) filters.price.$gte = parseFloat(minPrice);
                if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
            }
          
            //const books = await Book.find(filters).populate("owner", "name email");
            const books = await Book.find(filters);
          
            res.status(200).json({
                success: true,
                count: books.length,
                data: books,
                message:"Books are retrieved successfully from the database"
            });
        }
        catch(error){
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({
                success: false,
                count : 0,
                data: {},
                message: error.message,
                err: error.name,
            });
        }
    };
    //get book by Id
    async getbookbyId(req,res){
        try {
            const { id } = req.params;
            // const book = await Book.findById(id)
            //   .populate('owner', 'name email')  // populate owner details if needed
            //   .populate('reviews');             // populate review details if implemented
            const book = await Book.findById(id)
        
            if (!book) {
              return res.status(404).json({success: false, data:{},message: "Book not found" });
            }
            res.status(200).json({ success: true, data: book ,message:"Book is successfully retrieved"});
          } catch (error) {
            const statusCode = error.statusCode | 500
            res.status(500).json({ success: false,data:{}, message: "Not retrieved", err: err.message });
          }
    };
    //delete book by id
    async deletebookbyId(req,res){
        try {
            const { id } = req.params;
            const userId = req.user._id; // assuming user is authenticated and attached via middleware
        
            const book = await Book.findById(id);
        
            if (!book) {
              return res.status(404).json({ success: false, message: "Book not found" });
            }
        
            if (book.owner.toString() !== userId.toString()) {
              return res.status(403).json({ success: false, message: "Unauthorized: Not the owner of the book" });
            }
        
            await Book.findByIdAndDelete(id);
        
            return res.status(200).json({ success: true, message: "Book deleted successfully" });
          } 
          catch (error) {
            const statusCode = error.statusCode || 500
            return res.status(statusCode).json({ success: false, message: "Book doesn't deleted", err: err.message });
          }
    }
    //updatebookbyid
    async updatebookbyId(req,res){
        try{
            const {id} = req.params;
            const userId = req.user._id;
            const book = await Book.findById(id);
            const updates = req.body;
            let imageBase64;
            if (!book) {
                return res.status(404).json({ success: false,data:{}, message: "Book not found" });
            }
            if (book.owner.toString() !== userId.toString()) {
                return res.status(403).json({ success: false, data:{},message: "Unauthorized: Not the owner of the book" });
            }
            if(req.file){
                const base64 = convertToBase64(req.file)
                imageBase64 =[base64]
            }
            else if(req.files){
                imageBase64 = req.files.map((file) =>
                    convertToBase64(file)
                );
            }
            
            updates.imageBase64 = imageBase64
            if(updates.city || updates.colony || updates.country || updates.district || updates.state){
                // Combine full address string
                const fullAddress = `${updates.colony}, ${updates.city}, ${updates.district}, ${updates.state},${updates.country}`;

                // Get geolocation from Mapbox
                const geoResponse = await axios.get(
                     `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                        fullAddress
                )}.json`,
                {
                    params: {
                    access_token: process.env.MAP_TOKEN,
                    },
                }
                );
                const [longitude, latitude] = geoResponse.data.features[0].center;
                updates.location={
                    type:"Point",
                    coordinates:[longitude,latitude]
                }
            }
            
            const updatedBook = await Book.findByIdAndUpdate(id, updates, { new: true });

            res.status(200).json({
                success: true,
                message: "Book updated successfully",
                data: updatedBook,
            });
        }
        catch(error){
            const statusCode = error.statusCode || 500
            res.status(statusCode).json({
                success:false,
                data:{},
                message:"Book is not updated",
                err:error.message
            })
        }
       
    }
}

export default new BookController();