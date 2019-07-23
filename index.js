const { MONGO_DB_CONNECTION, NODE_ENV, PORT } = process.env
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const app = express()

// Set up DB connection
if (MONGO_DB_CONNECTION) {
    mongoose.connect(MONGO_DB_CONNECTION, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true })
    console.log('Connected to database...')
} else {
    console.log('Could not connect to the database!')
}

// Application-level Middleware
if (NODE_ENV === 'development') app.use(morgan('dev'))
app.use(require('body-parser').json())

// Routes
app.use('/api/v1/units', require('./api/routes/units'))
app.use('/api/v1/units/:unitID/company', require('./api/routes/company'))
app.use('/api/v1/companies', require('./api/routes/companies'))
app.use('/api/v1/employees', require('./api/routes/employees'))

// Not Found Error Handler
app.use((req, res, next) => {
    const error = new Error(`Could not ${req.method} ${req.path}`)
    error.status = 404
    next(error)
})

// Error Handler
app.use((err, req, res, next) => {
    if (NODE_ENV === 'development') console.error(err)
    const { message, status } = err
    res.status(status).json({ status, message })
})


// Open Connection
const listener = () => console.log('Listening on port ' + PORT)
app.listen(PORT, listener)
