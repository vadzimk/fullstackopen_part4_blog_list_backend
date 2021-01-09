const dummy = blogs => {
    return 1
}


const totalLikes = (blogs) => {
    return blogs.reduce((acc, curr) => acc + curr.likes, 0)
}



export {dummy, totalLikes}

