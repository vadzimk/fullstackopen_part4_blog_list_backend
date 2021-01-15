const requestLogger = (req, res, next)=>{

    if(process.env.NODE_ENV !=='test') {
        console.log('Method', req.method)
        console.log('Path', req.path)
        console.log('Body', req.body)
        console.log('--------')
    }

    next()
}


// express error handler
// execution order of middleware is the same as the order that they are loaded into express with app.use func
const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    if (error.name === 'CastError') {  // handles particular error if this is it
        return response.status(400).send({error: 'malformatted id'})
    }
    if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }
    if(error.name === 'JsonWebTokenError'){
        return response.status(401).json({error: 'invalid token'})
    }

    next(error)  // in all other situations passes the error to default express error handler
}

const getTokenFromRequest = (req, res, next) => {
    const authorization = req.get('authorization') // http header value named 'authorization' e.g Authorization: Bearer alrg.rei.ariu
    console.log("authorization", authorization)
    let token = null
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        token = authorization.substring('bearer '.length)
    }
    req.token = token
    next()
}

export default {requestLogger, errorHandler, getTokenFromRequest}