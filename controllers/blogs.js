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


// using promises:
// blogsRouter.post('/',
//     (request, response) => {
//         const blog = new Blog(request.body)
//
//         blog
//             .save()
//             .then(result => {
//                 response.status(201).json(result)
//             })
//     })

blogsRouter.post('/',
    async (request, response, next) => {
        try {
            const blog = new Blog(request.body)
            const result = await blog.save()
            response.status(201).json(result)
        } catch (e) {
            next(e)
        }
    })

export default blogsRouter
