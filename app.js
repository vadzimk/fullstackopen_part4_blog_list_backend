import express from "express";

const app = express()
import cors from 'cors'
import mongoose from "mongoose";
import blogsRouter from "./controllers/blogs.js";
import userRouter from "./controllers/users.js";
import loginRouter from "./controllers/login.js";
import config from "./utils/config.js";
import middleware from "./utils/middleware.js";



mongoose.connect(config.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => {
        console.log("Connected to MongoDB", config.DB_URL)
    })
    .catch(err => {
        console.log("Error connecting to MongoDB: ", err)
    })

app.use(cors())
app.use(express.json())
app.use(middleware.getTokenFromRequest)
app.use(middleware.requestLogger)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
if (process.env.NODE_ENV === 'test'){
    const {testRouter} = await import('./controllers/testRoute.js')
    app.use('/api/testing', testRouter)
}

app.use(middleware.errorHandler) // error handler will be the last middleware for some reason
export default app