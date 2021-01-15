import mongoose from "mongoose";
import supertest from 'supertest'
import User from "../models/user.js";
import app from "../app.js";
import helper from './test_helper.js'

const api = supertest(app)

describe('users api', ()=>{
    beforeAll(async ()=>{
        // remove all users from db
        await User.deleteMany({})
    })

    test('a valid user can be created', async ()=>{
        const user = {
            username: 'testuser',
            name: 'auser',
            password: '123456'
        }

        const createdUser = await api.post('/api/users')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        console.log("createdUser.body", createdUser.body)

        expect(createdUser.body.username).toEqual(user.username)
        const usersInDb = await helper.usersInDB()
        expect(usersInDb.map(u=>u.username)).toContain(user.username)

    })

    test('an invalid user1 is not created', async ()=>{
        const invalidUser1 = {
            username: 'hu',
            name: 'huuser',
            password: '12345'
        }

        await api.post('/api/users')
            .send(invalidUser1)
            .expect(400)
    })

    test('non-unique username is not created', async ()=>{
        const invalidUser2 = {
            username: 'testuser',
            name: 'auser',
            password: '123456'
        }

        const response = await api.post('/api/users')
            .send(invalidUser2)
            .expect(400)

        expect(response.body.error).toContain("expected `username` to be unique")

    })

    test('short password not created', async ()=>{
        const invalidUser2 = {
            username: 'testuser1',
            name: 'auser',
            password: '16'
        }
        const response = await api.post('/api/users')
            .send(invalidUser2)
            .expect(400)
        expect(response.body.error).toContain('password must be at least 3 characters long')
    })


    afterAll(()=>{
        mongoose.connection.close()
    })
})