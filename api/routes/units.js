const router = require('express').Router()
const Units = require('../models/units')

// Routes go here
router.get('/', (req, res, next) => {
    const status = 200
    Units.find().then(response => {
        console.log(response)
        res.json({ status, response })
    })
})

module.exports = router