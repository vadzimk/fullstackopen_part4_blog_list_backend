import bcrypt from 'bcrypt'
import Blog from "../models/blog.js";
import User from "../models/user.js";

const initial_blogs = [
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://',
        likes: 1
    },
    {
        title: 'You can run a single test with',
        author: 'Edsger W. Dijkstra',
        url: 'http://',
        likes: 5
    },
    {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: 'http://',
        likes: 12
    },
    {
        title: 'helper functions and unit tests',
        author: 'Edsger W. Dijkstra',
        url: 'http://',
        likes: 7
    }
]


const postsInDb = async ()=>{
    const blogs = await Blog.find({})
    return blogs.map(item=>item.toJSON())
}

const usersInDB = async ()=>{
    const users = await User.find({})
    return users.map(u=>u.toJSON())
}

const createInitialUser = async ()=>{
    const userDeleted = await User.deleteOne({username: 'roo'})  //delete all users from db
    console.log("userDeleted", userDeleted)
    const passwordHash = await bcrypt.hash('secretpassword', 10)
    const user = new User({
        username: 'roo',
        passwordHash
    })
    await user.save()
}

const loginInitialUser = async (api)=>{
    const user = {
        username: 'roo',
        password: 'secretpassword'
    }

    const authentication = await api.post('/api/login')
        .send(user)
    return authentication.body.token
}



export default {initial_blogs, postsInDb, usersInDB, createInitialUser, loginInitialUser}