import mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator'

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true, minlength: 3},
    name: String,
    passwordHash: String,
    blogs: [{
        type: mongoose.Schema.Types.ObjectId, // mongoose schema types ObjectId
        ref: 'Blog'  // references mongoose Blog model
    }]
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON',
    {
        transform: (doc, retObj) => {
            retObj.id = retObj._id
            delete retObj._id
            delete retObj.__v
            delete retObj.passwordHash
        }
    })

const User = mongoose.model('User', userSchema)


export default User