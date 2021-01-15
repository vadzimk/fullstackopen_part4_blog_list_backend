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

let token
beforeAll(async ()=>{
    await helper.createInitialUser()
    token = await helper.loginInitialUser(api)
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

})

describe('adding new blog posts', () => {

    test('a new blog post can be added', async () => {
        const newBlogPost = {
            title: "test title",
            author: "anonymous",
            url: "http://",
            likes: 1
        }
        await api.post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
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
            .set('Authorization', `Bearer ${token}`)
            .send(newBlogPost)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const newBlogId = response.body.id

        const allnotes = await api.get('/api/blogs')
        const newelyCreatedPost = allnotes.body.find(item => item.id === newBlogId)
        console.log(newelyCreatedPost)
        expect(newelyCreatedPost.likes).toBeDefined()
    })

    describe('if title and url missing in req data, res.status==400', () => {

        test('if title missing in req data, res.status==400', async () => {

            const noTitleBlogPost = {
                author: "anonymous",
                url: "http://"
            }

            await api.post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(noTitleBlogPost)
                .expect(400)
        })

        test('if url missing in req data, res.status==400', async () => {

            const noUrlBlogPost = {
                title: "missing likes test",
                author: "anonymous",
            }

            await api.post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(noUrlBlogPost)
                .expect(400)

        })
    })

})


describe('deleting blog post', () => {

    test('a blog post can be deleted', async () => {
        const newBlogPost = {
            title: "test title",
            author: "anonymous",
            url: "http://",
            likes: 1
        }
        const createdBlog = await api.post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlogPost)


        await api
            .delete(`/api/blogs/${createdBlog.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

    })
})


describe('updating blog post', () => {

    test('a blog post can be updated', async () => {
        const postsInDb = await helper.postsInDb()
        const blogPostToUpadte = postsInDb[0]
        console.log("blogPostToUpadte", blogPostToUpadte)

        const result = await api.put(`/api/blogs/${blogPostToUpadte.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                ...blogPostToUpadte,
                likes: blogPostToUpadte.likes + 1000
            })


        console.log("result.body", result.body)
        expect(result.body.likes).toEqual(blogPostToUpadte.likes + 1000)


    })
})

afterAll(() => {
    mongoose.connection.close().catch(e => console.log(e))
})