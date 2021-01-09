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



const listHelper = {dummy, totalLikes, favoriteBlog}
export default listHelper

