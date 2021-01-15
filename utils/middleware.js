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

export default {requestLogger, errorHandler}