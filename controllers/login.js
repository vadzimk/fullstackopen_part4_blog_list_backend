import express from "express";
import User from "../models/user.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const loginRouter = express.Router()

loginRouter.post('/',
    async (req, res, next) => {
        const body = req.body
        const user = await User.findOne({username: body.username})
        const correct = user === null ? false : bcrypt.compare(body.password, user.passwordHash)

        if (!(user && correct)) {
            return res.status(401)  // unauthorized
                .json({error: 'invalid username or password'})
        }

        // generate token for authorized user

        const userForToken = {
            username: user.username,
            id: user._id
        }
        const token = jwt.sign(userForToken, process.env.SECRET_KEY)
        res.status(200)
            .send({
                token,
                username: user.username,
                name: user.name
            })
    })


export default loginRouter