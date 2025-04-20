import requestController from "../controllers/request.controller.js";
import express from "express";
import isAuthenticated from "../middlewares/authMiddleware.js"
const router = express.Router()

router.post("/create/:bookId",isAuthenticated,requestController.createRequest);
router.get("/checkrequestforbook/:bookId",isAuthenticated,requestController.checkUserRequest)
router.patch("/updaterequest/:requestId",isAuthenticated,requestController.updaterequestAccess);
router.patch("/borrow/:requestId",isAuthenticated,requestController.markAsBorrowed);
router.patch("/return/:requestId",isAuthenticated,requestController.markAsReturned);
router.patch("/cancel/:requestId",isAuthenticated,requestController.cancelRequest);
router.get("/lender",isAuthenticated,requestController.getRequestsToLender);
router.get("/borrower",isAuthenticated,requestController.getRequestsByBorrower);

export default router;