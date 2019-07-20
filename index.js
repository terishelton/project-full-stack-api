const { MONGO_DB_CONNECTION, NODE_ENV, PORT } = process.env
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const app = express()

// Set up DB connection
if (MONGO_DB_CONNECTION) {
    mongoose.connect(MONGO_DB_CONNECTION, { useNewUrlParser: true, useFindAndModify: false })
    console.log('Connected to database...')
} else {
    console.log('Could not connect to the database!')
}

// Application-level Middleware
if (NODE_ENV === 'development') app.use(morgan('dev'))
app.use(require('body-parser').json())

// Routes - TBD

// Not Found Error Handler


// Error Handler

// Open Connection
const listener = () => console.log('You are doing a thing!')
app.listen(PORT, listener)
