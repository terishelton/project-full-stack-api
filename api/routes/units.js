const router = require('express').Router()
const Units = require('../models/units')

// Get all Units
router.get('/', (req, res, next) => {
    const status = 200
    Units.find().select('-__v').then(response => {
        console.log(response)
        res.json({ status, response })
    })
})

// Temp route to create a unit for testing because this isn't in the assignment! There may be a reason for that, but I want to test.
router.post('/', (req, res, next) => {
    const status = 201
    Units.create(req.body).then(response => {
        res.json({ status, response })
    }).catch(error => {
        // report back error if can't add
        console.log(error)
        const e = new Error('Something went wrong!')
        e.status = 400
        next(e)
    })
})

module.exports = router