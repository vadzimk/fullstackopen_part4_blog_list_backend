import Blog from "../models/blog.js";

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



export default {initial_blogs, postsInDb}