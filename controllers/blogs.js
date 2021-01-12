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

            if (request.body.title === undefined) {
                response.status(400).json({error: "title must be specified"})
                return
            }

            if (request.body.url === undefined) {
                response.status(400).json({error: "url must be specified"})
                return
            }

            const newBlog = {
                title: request.body.title,
                author: request.body.author,
                likes: request.body.likes || 0
            }

            const blog = new Blog(newBlog)
            const result = await blog.save()
            response.status(201).json(result)
        } catch (e) {
            next(e)
        }
    })

export default blogsRouter
