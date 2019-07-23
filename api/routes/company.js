const router = require('express').Router({ mergeParams: true })
const Units = require('../models/units')
const helpers = require('../../helpers/helpers')

// PATCH or update company by unit ID
// TODO: This doesn't update the entry. Come back to it. (But the Catch works)
router.patch('/', async (req, res, next) => {
    // this did work at some point?
    try {
        const status = 201
        const units = await Units.findById(req.params.unitID)
        const selectedCompany = units.company
        
        selectedCompany.set(req.body)
        await units.save()

        const unit = units.company[units.company.length - 1]
        console.log(unit)
        res.json({ status, unit })
    }
    catch(error) {
        // report back error if can't update
        console.log(error)
        const e = new Error('No unit with that ID!')
        e.status = 404
        next(e)
    }
})

// TODO: Need to come back to this one too
router.delete('/', async (req, res, next) => {
    try {
        const status = 200
        const unit = await Units.findById(req.params.unitID)
        const selectedCompany = await unit.company
        console.log(selectedCompany)

        selectedCompany.remove()
        await unit.save()
        res.json({ status, unit })
    }
    catch(error) {
        // report back error if can't delete
        console.log(error)
        const e = new Error('Something went wrong with that delete!')
        e.status = 404
        next(e)
    }
    
})

// TODO: FINISH. This returns employees but can't do the check on no company until I can delete a company
// use .where and .exists? .exists(false)
// Examples from documentation:
// { name: { $exists: true }}
// Thing.where('name').exists()
// Thing.where('name').exists(true)
// Thing.find().exists('name')

// { name: { $exists: false }}
// Thing.where('name').exists(false);
// Thing.find().exists('name', false);

// get all employees for company
// needs error checking
router.get('/employees', async (req, res, next) => {
    try {
        const status = 200
        const unit = await Units.findById(req.params.unitID)
        const employees = await unit.company.employees

        res.json({ status, employees })
    }
    catch(error) {
        // report back error if unit ID not found
        console.log(error)
        const e = new Error('Unit not found.')
        e.status = 404
        next(e)
    }
})

// get employee by ID
// needs error checking
router.get('/employees/:id', async (req, res, next) => {
    try {
        const status = 200
        const unit = await Units.findById(req.params.unitID)
        const employee = await unit.company.employees.id({ _id: req.params.id })

        res.json({ status, employee })
    }
    catch(error) {
        // report back error if ...
        console.log(error)
        const e = new Error('Fill this in')
        e.status = 404
        next(e)
    }
})

// Create new employees and add to the unit/company
// needs error checking
router.post('/employees', async (req, res, next) => {
    try {
        const status = 201
        const unit = await Units.findById(req.params.unitID)
        const allEmployees = unit.company.employees
    
        allEmployees.push(req.body)
        await unit.save()

        const newEmployee = unit.company.employees[unit.company.employees.length - 1]
        res.json({ status, newEmployee })
    }
    catch(error) {
        // report back error if ...
        console.log(error)
        const e = new Error('Fill this in')
        e.status = 404
        next(e)
    }
})

module.exports = router