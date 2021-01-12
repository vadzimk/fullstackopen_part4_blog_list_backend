import mongoose from "mongoose";

import app from "../app.js";
import supertest from 'supertest'

import Blog from "../models/blog.js";

import helper from "./test_helper.js";

const api = supertest(app)


beforeEach(async () => {
    await Blog.deleteMany({})  // database cleared
    const blogObjects = helper.initial_blogs.map(item => new Blog(item))
    const promiseArray = blogObjects.map(blog=> blog.save())
    await Promise.all(promiseArray)  // transforms promiseArray into a single promise
    // await will wait for fulfillment of the promise = db initialized
})

describe('blog api', () => {

    test('get all blogs', async () => {

        const response = await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body).toHaveLength(helper.initial_blogs.length)
    })

    test('id property is defined', async()=>{
        const response =await api.get('/api/blogs')
        console.log(response.body[0])

        expect(response.body[0].id).toBeDefined()
    })
})




afterAll(() => {
    mongoose.connection.close().catch(e => console.log(e))
})