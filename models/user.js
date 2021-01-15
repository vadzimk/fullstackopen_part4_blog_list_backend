import express from "express";
import User from "../controllers/users.js";
import bcrypt from 'bcrypt'

const userRouter = express.Router()

userRouter.post('/',
    async (req, res, next)=>{
        const body = req.body
        const passwordHash = await bcrypt.hash(body.password, 10)
        const newUser = new User({
            username: body.username,
            name: body.name,
            passwordHash,
        })

        try {
            const savedUser = await newUser.save()
            res.json(savedUser)
        }catch (e){
            res.status(500).end()
            console.log(e)
            return next(e)
        }
    })


userRouter.get('/',
    async (req, res, next) => {
        try {
            const users = await User.find({})
            res.json(users)
        } catch (e) {
            return next(e)
        }
    })


export default userRouter