'use strict'

const connectDb = require('./db')
const { ObjectID } = require('mongodb')
const errorHandler = require('./errorHandler')

module.exports = {
  getCourses: async () => {
    let db
    let courses = []

    try {
      db = await connectDb()
      courses = await db.collection('courses').find().toArray()
    } catch (error) {
      errorHandler(error)
    }

    return courses
  },
  getCourse: async (root, {
    id
  }) => {
    let db
    let course

    try {
      db = await connectDb()
      course = await db.collection('courses').findOne({
        _id: ObjectID(id)
      })
    } catch (error) {
      errorHandler(error)
    }

    return course
  },
  getPeople: async () => {
    let db
    let people = []

    try {
      db = await connectDb()
      people = await db.collection('people').find().toArray()
    } catch (error) {
      errorHandler(error)
    }

    return people
  },
  getPerson: async (root, {
    id
  }) => {
    let db
    let person

    try {
      db = await connectDb()
      person = await db.collection('people').findOne({
        _id: ObjectID(id)
      })
    } catch (error) {
      errorHandler(error)
    }

    return person
  },
  searchItems: async (root, {
    keyword
  }) => {
    let db
    let items
    let courses
    let people

    try {
      db = await connectDb()
      courses = await db.collection('courses').find(
        { $text: { $search: keyword } }
      ).toArray()
      people = await db.collection('people').find({
        $text: {
          $search: keyword
        }
      }).toArray()
      items = [...courses, ...people]
    } catch (error) {
      errorHandler(error)
    }

    return items
  }
}
