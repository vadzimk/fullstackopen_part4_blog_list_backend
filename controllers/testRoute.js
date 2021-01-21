import express from "express"

const testRouter = express.Router()


import Blog from "../models/blog.js";
import User from "../models/user.js";

testRouter.post('/reset',
    async (req, res) => {
        await Blog.deleteMany({})
        await User.deleteMany({})
        res.status(200).end()
    })

export {testRouter}
