import http from 'http'
import express from 'express'

import config from "./utils/config.js";

const app = express()
import cors from 'cors'
import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)


mongoose.connect(config.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(()=>{console.log("Connected to MongoDB")})
    .catch(err=>{console.log("Error connecting to MongoDB: ", err)})

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})

app.post('/api/blogs', (request, response) => {
    const blog = new Blog(request.body)

    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
})


app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
})