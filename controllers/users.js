import express from "express";
import User from "../models/user.js";
import bcrypt from 'bcrypt'

const userRouter = express.Router()

userRouter.post('/',
    async (req, res, next) => {
        const body = req.body
        if (!body.password || body.password.length < 3) {
            return res.status(400).json({error: "password must be at least 3 characters long"})
        }

        const passwordHash = await bcrypt.hash(body.password, 10)
        const newUser = new User({
            username: body.username,
            name: body.name,
            passwordHash,
        })

        try {
            const savedUser = await newUser.save()
            res.json(savedUser)
        } catch (e) {
            res.status(400).json({error: e.message})
            console.log(e)
            return next(e)
        }
    })


userRouter.get('/',
    async (req, res, next) => {
        try {
            const users = await User.find({})
                .populate('blogs', {url: 1, title: 1, author: 1, id: 1})
            res.json(users)
        } catch (e) {
            return next(e)
        }
    })


export default userRouter