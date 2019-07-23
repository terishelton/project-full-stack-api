const router = require('express').Router({ mergeParams: true })
const Units = require('../models/units')

// base route is /api/v1/employees

// get employee names that match query string
router.get('/', async (req, res, next) => {
    const status = 200
    const query = req.query
    const value = Object.values(query)

    // partial name match of query string for first or last name
    if (Object.keys(query) == 'name') {
        const nameMatches = await Units.find().or([{ 
            'company.employees.first_name': new RegExp(value, 'i' )
        }, { 
            'company.employees.last_name': new RegExp(value, 'i') }])
            .select('company.employees')
        console.log(nameMatches)

        res.json({ status, nameMatches })
    } 
    
    // match of query string for birthday
    // TODO: finish this... returns all employess for a company when the birthday matches
    if (Object.keys(query) == 'birthday') {
        const birthdayMatches = await Units.find({ 'company.employees.birthday': new RegExp(value, 'i' )}).select('company.employees.first_name company.employees.last_name company.employees.birthday company.employees.email')
        console.log(birthdayMatches)

        res.json({ status, birthdayMatches })
    }
})

router.get

module.exports = router