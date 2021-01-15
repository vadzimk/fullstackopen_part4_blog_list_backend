import express from "express";

const blogsRouter = express.Router()
import Blog from "../models/blog.js";
import User from "../models/user.js";

blogsRouter.get('/',
    async (request, response, next) => {
        try {
            const blogs = await Blog.find({})
                .populate('user', {username: 1, name: 1, id: 1})
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

        if (request.body.title === undefined) {
            response.status(400).json({error: "title must be specified"})
            return
        }

        if (request.body.url === undefined) {
            response.status(400).json({error: "url must be specified"})
            return
        }

        let user

            const users = await User.find({})
            user = users[0]




        const newBlog = {
            title: request.body.title,
            author: request.body.author,
            url: request.body.url,
            likes: request.body.likes || 0,
            user: user._id
        }

        const blog = new Blog(newBlog)
        try {
            const savedBlog = await blog.save()
            user.blogs = user.blogs.concat(savedBlog)
            await user.save()
            response.status(201).json(savedBlog)
        } catch (e) {
            next(e)
        }
    })

blogsRouter.delete('/:id',
    async (req, res, next) => {
        try {
            const id = req.params.id
            const result = await Blog.findByIdAndRemove(id)
            if (!result) {  // if id is not found, result is null
                res.status(404).end()
            } else {
                res.status(204).end()  // no content (resource has been deleted per request)
            }
        } catch (e) {
            next(e)
        }
    })


blogsRouter.put('/:id',
    async (req, res, next) => {

        const blogPost = {
            title: req.body.title,
            author: req.body.author,
            url: req.body.url,
            likes: req.body.likes
        }
        try {
            const result = await Blog.findByIdAndUpdate(req.params.id, blogPost, {new: true})
            console.log(result)
            res.json(result)
        } catch (e) {
            next(e)
        }
    })

export default blogsRouter
