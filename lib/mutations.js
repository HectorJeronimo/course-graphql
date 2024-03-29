'use strict'

const connectDb = require('./db')
const { ObjectID } = require('mongodb')
const errorHandler = require('./errorHandler')

module.exports = {
  createCourse: async (root, { input }) => {
    const defaults = {
      teacher: '',
      topic: ''
    }

    const newCourse = Object.assign(defaults, input)
    let db
    let course

    try {
      db = await connectDb()
      course = await db.collection('courses').insertOne(newCourse)
      newCourse._id = course.insertedId
    } catch (error) {
      errorHandler(error)
    }

    return newCourse
  },
  createPerson: async (root, { input }) => {
    let db
    let person

    try {
      db = await connectDb()
      person = await db.collection('people').insertOne(input)
      input._id = person.insertedId
    } catch (error) {
      errorHandler(error)
    }

    return input
  },
  editCourse: async (root, { _id, input }) => {
    let db
    let course

    try {
      db = await connectDb()
      await db.collection('courses').updateOne(
        { _id: ObjectID(_id) },
        { $set: input }
      )
      course = await db.collection('courses').findOne(
        { _id: ObjectID(_id) }
      )
    } catch (error) {
      errorHandler(error)
    }

    return course
  },
  editPerson: async (root, { _id, input }) => {
    let db
    let person

    try {
      db = await connectDb()
      await db.collection('people').updateOne(
        { _id: ObjectID(_id) },
        { $set: input }
      )
      person = await db.collection('people').findOne(
        { _id: ObjectID(_id) }
      )
    } catch (error) {
      errorHandler(error)
    }

    return person
  },
  addPersonToACourse: async (root, { courseID, personID }) => {
    let db
    let person
    let course

    try {
      db = await connectDb()
      course = await db.collection('courses').findOne({
        _id: ObjectID(courseID)
      })
      person = await db.collection('people').findOne({
        _id: ObjectID(personID)
      })

      if (!course || !person) throw new Error('La Persona o el Curso no existe')

      await db.collection('courses').updateOne(
        { _id: ObjectID(courseID) },
        { $addToSet: { people: ObjectID(personID) } }
      )
    } catch (error) {
      errorHandler(error)
    }

    return course
  },
  deleteCourse: async (root, { _id }) => {
    let db

    try {
      db = await connectDb()
      await db.collection('courses').deleteOne(
        { _id: ObjectID(_id) }
      )
    } catch (error) {
      errorHandler(error)
    }

    return true
  },
  deletePerson: async (root, { _id}) => {
    let db

    try {
      db = await connectDb()
      await db.collection('people').deleteOne(
        {_id: ObjectID(_id)}
        )
    } catch (error) {
      errorHandler(error)
    }

    return true
  }
}
