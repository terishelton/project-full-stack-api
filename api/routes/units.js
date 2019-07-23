const router = require('express').Router()
const Units = require('../models/units')
const helpers = require('../../helpers/helpers')

// GET all Units, all units of KIND, all units of FLOOR, or units that are OCCUPIED
router.get('/', (req, res, next) => {
    const status = 200
    const query = req.query

    // if query includes occupied...
    if (Object.keys(query) == 'occupied') {
        const value = Object.values(query)

        // check to see if asking if occupied is false and return entries with a null company entry
        if (value == 'false') {
            // if company is null, return them
            Units.find({ company: null }).select('-__v').then(response => {
                console.log('false is running')
                res.json({ status, response })
            })
        } else {
            // otherwise (e.g. if true), return only units that are not null or empty
            Units.find({ 'company': { $nin: [null, {}]} }).select('-__v').then(response => {
                console.log('true is running')
                res.json({ status, response })
            })
        }
    } else {
        // if not querying on being occupied, return entries based on other query or all units if no query
        Units.find(req.query).select('-__v').then(response => {
            console.log(response)
            res.json({ status, response })
        })
    }
})

// Temp route to create a unit for testing because this isn't in the assignment! There may be a reason for that, but I want to test.
router.post('/', helpers.validate, (req, res, next) => {
    const status = 201
    Units.create(req.body).then(response => {
        res.json({ status, response })
    }).catch(error => {
        // report back error if can't add
        console.log(error)
        const e = new Error("Can't add that unit!")
        e.status = 400
        next(e)
    })
})

// PATCH or update units by ID
router.patch('/:id', helpers.validate, (req, res, next) => {
    const status = 201
    const id = req.params.id

    Units.findOneAndUpdate({ 
        _id: id 
    }, { 
        $set: req.body 
    }, { 
        new: true 
    }).select('-__v').then(response => {
        res.json({ status, response })
    }).catch(error => {
        // report back error if can't add
        console.log(error)
        const e = new Error('No unit with that ID!')
        e.status = 404
        next(e)
    })
})

module.exports = router