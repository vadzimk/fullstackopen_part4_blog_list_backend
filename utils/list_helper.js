const dummy = blogs => {
    return 1
}


const totalLikes = (blogs) => {
    return blogs.reduce((acc, curr) => acc + curr.likes, 0)
}

const favoriteBlog = blogs => {
    const max = blogs.reduce((acc, curr) => curr.likes > acc ? curr.likes : acc, 0)

    const obj = blogs.find(e => e.likes === max)

    return {
        title: obj.title,
        author: obj.author,
        likes: obj.likes
    }

}
/**
 * @param blogs is array of blogs
 * @return object with parameters:
 * {author, blogs}
 * author who has most blogs and number of his blogs
 * */
const mostBlogs = (blogs)=>{
    const authors = []
    blogs.forEach(blog=>{
        const authorObj = authors.find(item=>item.author===blog.author)
        if (!authorObj){
            authors.push({
                author: blog.author,
                blogs: 1
            }, )
        } else {
            const index = authors.indexOf(authorObj)
            authors[index].blogs +=1
        }
    })
    if (authors.length>0)
        return authors.sort()[0]
    else
        return {}
}

/**
 * @param blogs is array of blogs
 * @return object with parameters:
 * {author, likes}
 * author who has most likes and number of his likes
 * */
const mostLikes=(blogs)=>{
    const authors = []
    blogs.forEach(blog=>{
        const authorObj = authors.find(a=>a.author===blog.author)
        if (!authorObj){
            authors.push({author: blog.author, likes: blog.likes})
        } else {
            const index = authors.indexOf(authorObj)
            authors[index].likes +=blog.likes
        }
    })
    if (authors.length>0)
        return authors.sort()[0]
    else
        return {}
}

const listWithMany = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 1,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'You can run a single test with',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        likes: 12
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'helper functions and unit tests',
        author: 'Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 7,
        __v: 0
    }
]

// let res = mostBlogs(listWithMany)
// console.log(res)
// res = mostLikes(listWithMany)
// console.log(res)


const listHelper = {dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes}
export default listHelper

