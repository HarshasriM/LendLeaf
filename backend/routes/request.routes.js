import requestController from "../controllers/request.controller.js";
import express from "express";
import isAuthenticated from "../middlewares/authMiddleware.js"
const router = express.Router()

router.post("/create",isAuthenticated,requestController.createRequest);
router.patch("/updaterequest/:reviewId",isAuthenticated,requestController.updaterequestAccess);
router.patch("/borrow/:reviewId",isAuthenticated,requestController.markAsBorrowed);
router.patch("/return/:reviewId",isAuthenticated,requestController.markAsReturned);
router.patch("/cancel/:reviewId",isAuthenticated,requestController.cancelRequest);
router.get("/lender",isAuthenticated,requestController.getRequestsToLender);
router.get("/borrow",isAuthenticated,requestController.getRequestsToLender);

export default router;