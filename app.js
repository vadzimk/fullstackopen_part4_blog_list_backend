import express from "express";

const app = express()
import cors from 'cors'
import mongoose from "mongoose";
import blogsRouter from "./controllers/blogs.js";
import config from "./utils/config.js";


mongoose.connect(config.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch(err => {
        console.log("Error connecting to MongoDB: ", err)
    })

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)


export default app