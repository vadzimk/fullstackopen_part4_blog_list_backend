import express from "express";
import jwt from 'jsonwebtoken'

const blogsRouter = express.Router()
import Blog from "../models/blog.js";
import User from "../models/user.js";


const getTokenFromRequest = async (req) => {
    const authorization = req.get('authorization') // http header value named 'authorization' e.g Authorization: Bearer alrg.rei.ariu
    console.log("authorization", authorization)
    let token = null
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        token = authorization.substring('bearer '.length)
    }
    return token
}

blogsRouter.get('/',
    async (req, res, next) => {
        try {
            const blogs = await Blog.find({})
                .populate('user', {username: 1, name: 1, id: 1})
            res.json(blogs)
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
    async (req, res, next) => {

        const token = await getTokenFromRequest(req)
        console.log("token", token)

        let user
        try {
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY)  // obj the token was based on - payload {username, id}

            console.log("decodedToken", decodedToken)

            user = await User.findById(decodedToken.id)
            if (user === null){
                return res.status(400).json({error: `user not found, id ${decodedToken.id}`})
            }

        } catch (e) {
            res.status(401).json({error: 'token missing or invalid'})  // unauthorized
            return next(e)
        }

        if (req.body.title === undefined) {
            res.status(400).json({error: "title must be specified"})
            return
        }

        if (req.body.url === undefined) {
            res.status(400).json({error: "url must be specified"})
            return
        }

        const newBlog = {
            title: req.body.title,
            author: req.body.author,
            url: req.body.url,
            likes: req.body.likes || 0,
            user: user._id
        }

        const blog = new Blog(newBlog)
        try {
            const savedBlog = await blog.save()
            user.blogs = user.blogs.concat(savedBlog)
            await user.save()
            res.status(201).json(savedBlog)
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
