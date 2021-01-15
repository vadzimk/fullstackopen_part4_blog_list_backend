import mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator'

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    name: String,
    passwordHash: String
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