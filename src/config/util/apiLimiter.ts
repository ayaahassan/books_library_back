import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 50, 
    message: "Too many requests from this IP, please try again later"
}); 