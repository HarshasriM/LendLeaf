import Book from "../models/Book.model.js";
import Request from "../models/Request.model.js";
import request from "../models/Request.model.js";
import generateRentReport from "../utils/rentchargeUtil.js"

class RequestController{
    async createRequest(req,res){
        try {
            const {bookId} = req.params;
            const { requestedDays } = req.body;
            const borrowerId = req.user._id; // from auth middleware
        
            const book = await Book.findById(bookId);
            if (!book || !book.isAvailable) {
              return res.status(404).json({success:false,data:{}, message: "Book not available" });
            }
        
            const lenderId = book.owner;
        
            const requestDate = Date.now();
        
            const newRequest = new Request({
              book: bookId,
              borrower: borrowerId,
              lender: lenderId,
              bookPrice:book.price,
              requestedDays,
              requestDate,
            });
        
            const savedRequest = await newRequest.save();
            await User.findByIdAndUpdate(borrowerId, { isBorrower: true });
            return res.status(201).json({ success:true, message:"Request created", data: savedRequest });
        
          } catch (error) {
            const statusCode = error.statusCode || 500
            return res.status(500).json({ success:false,data:{},message: "Error creating request", err: error.message });
          }
    };
    async updaterequestAccess(req,res){
        try{
            const {requestId} = req.params;
            const {status} = req.body;
            const request = await Request.findById(requestId);
            if (!request || request.status !== 'pending') {
                return res.status(400).json({success:false,message: "Request not found or already handled" });
            }
            request.status = status;
            await request.save();
        
            return res.status(200).json({success:true, message: `Request ${status}`, data:request });
        
            } catch (error) {
                const statusCode = error.statusCode || 500
                return res.status(statusCode).json({success:false,data:{}, message: "Failed to update request status", err: error.message });
            }      
    };
    async markAsBorrowed(req,res){
        try{
            const {requestId} = req.params;
            const request = await Request.findById(requestId).populate('book');
            if(!request || request.status!=="accepted"){
               return  res.status(400).json({success:false,message:"Invali status update"})
            }
            request.status="borrowed"
            request.borrowDate = Date.now();
            const deadlineDate = new Date();
            deadlineDate.setDate(deadlineDate.getDate() + request.requestedDays);
            request.deadlineDate = deadlineDate;
            await request.save();
            request.book.isAvailable=false;
            await request.book.save();
            return  res.status(200).json({ success:true,message: "Book marked as borrowed", data:request });
        }
        catch(error){
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({
                success:false,
                data:{},
                message:"Book status is not updated as borrowed ",
                err:error.message
            })
        }
    };
    async markAsReturned(req,res){
       try{
            const {requestId} = req.params;
            const request = await Request.findById(requestId).populate('book');
            if (!request || request.status !== 'borrowed') {
                return res.status(400).json({ message: "Invalid or not borrowed" });
            }

            request.status = 'returned';
            request.actualReturnDate = Date.now();
            const report = generateRentReport(request);
            request.report = report;
        
            await request.save();
        
            request.book.isAvailable = true;
            await request.book.save();
        
            res.status(200).json({success:true, message: "Book returned successfully", data:request, report:report });
       }
       catch(error){
            const statusCode = error.statusCode || 500
            return res.status(statusCode).json({
                success:false,
                message:"Book status is not updated as borrowed ",
                data:{},
                err:error.message
            })
       }

    }
    async cancelRequest(req,res){
       try{
            const {requestId} = req.params;
            const request = await Request.findById(requestId).populate("book");
            if (!request || ['borrowed', 'returned'].includes(request.status)) {
                return res.status(400).json({success:false, message: "Cannot cancel after borrowing" });
            }
            request.status = 'cancelled';
            await request.save();
            request.book.isAvailable=true;
            await request.book.save();
            return res.status(200).json({success:true,message:"Cancelled Book Request",data:request});
       }
       catch(error){
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            success:false,
            message:"Cancelling Book request is failed",
            data:{},
            err:error.message
        })
       }
    }
    async getRequestsByBorrower(req,res){
        try{
            const requests = await Request.find({ borrower: req.user._id })
              .populate('book')
              .sort({ createdAt: -1 });
        
            res.status(200).json({success:true,message:"Retrieved requests successfully",data:requests });
          }catch (error) {
            const statusCode = error.statusCode || 500
            res.status(statusCode).json({success:false, message: "Failed to fetch borrower requests",data:{} });
          }
    }; 
    async getRequestsToLender(req,res){
        try {
            const requests = await Request.find({ lender: req.user._id })
              .populate('book borrower')
              .sort({ createdAt: -1 });
        
            res.status(200).json({ success:true,message:"Fetched all lender received requests",data:requests });
          } catch (error) {
            const statusCode = error.statusCode || 500
            res.status(statusCode).json({success:true,message: "Failed to fetch lender requests",data:{}});
          }
        
    }
};
export default new RequestController();