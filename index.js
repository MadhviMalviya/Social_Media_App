import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import AuthRoute from './Routes/AuthRoutes.js'
import userRoute from './Routes/userRoute.js'
import PostRoute from './Routes/postRoutes.js'

//Routes
const app = express();

//Middleware 
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
dotenv.config();
mongoose.connect(process.env.MONGO_DB)
    
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Server chal rha hai port ${process.env.PORT} pr`)
    );
  })

  .catch((error) => {
    console.error("Arey Error hai", error.message);
  });

  // usage of route
app.use('/auth', AuthRoute)
app.use('/user', userRoute)
app.use('/post',PostRoute)