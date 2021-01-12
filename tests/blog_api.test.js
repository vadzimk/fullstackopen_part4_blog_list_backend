import mongoose from "mongoose";

import app from "../app.js";
import supertest from 'supertest'

import Blog from "../models/blog.js";

import helper from "./test_helper.js";

const api = supertest(app)


beforeEach(async () => {
    await Blog.deleteMany({})  // database cleared
    const blogObjects = helper.initial_blogs.map(item => new Blog(item))
    const promiseArray = blogObjects.map(blog => blog.save())
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

    test('id property is defined', async () => {
        const response = await api.get('/api/blogs')
        console.log(response.body[0])

        expect(response.body[0].id).toBeDefined()
    })

    test('a new blog post can be added', async () => {
        const newBlogPost = {
            title: "test title",
            author: "anonymous",
            url: "http://",
            likes: 1
        }
        await api.post('/api/blogs')
            .send(newBlogPost)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        const contents = response.body.map(item => item.title)
        expect(response.body).toHaveLength(helper.initial_blogs.length + 1)
        expect(contents).toContain(newBlogPost.title)
    })

    test('missing likes property in the request defaults to zero', async () => {
        const newBlogPost = {
            title: "missing likes test",
            author: "anonymous",
            url: "http://"
        }

        const response = await api.post('/api/blogs')
            .send(newBlogPost)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const newBlogId = response.body.id

        const allnotes = await api.get('/api/blogs')
        const newelyCreatedPost = allnotes.body.find(item => item.id === newBlogId)
        console.log(newelyCreatedPost)
        expect(newelyCreatedPost.likes).toBeDefined()
    })


})


describe('if title and url missing in req data, res.status==400', ()=>{

    test('if title missing in req data, res.status==400', async () => {

        const noTitleBlogPost = {
            author: "anonymous",
            url: "http://"
        }

        await api.post('/api/blogs')
            .send(noTitleBlogPost)
            .expect(400)
    })

    test('if url missing in req data, res.status==400', async () => {

        const noUrlBlogPost = {
            title: "missing likes test",
            author: "anonymous",
        }

        await api.post('/api/blogs')
            .send(noUrlBlogPost)
            .expect(400)

    })
})

afterAll(() => {
    mongoose.connection.close().catch(e => console.log(e))
})