import express from "express";

const blogsRouter = express.Router()
import Blog from "../models/blog.js";

blogsRouter.get('/',
    async (request, response, next) => {
        try {
            const blogs = await Blog.find({})
            response.json(blogs)
        } catch (e) {
            next(e)
        }
    })

blogsRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)

    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
})


export default blogsRouter
