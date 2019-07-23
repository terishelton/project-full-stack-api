const router = require('express').Router({ mergeParams: true })
const Units = require('../models/units')

// base route is /api/v1/units/:unitID/company

// PATCH or update company by unit ID
router.patch('/', async (req, res, next) => {
    try {
        const status = 201
        const unit = await Units.findOneAndUpdate({ 
            _id: req.params.unitID
        }, {
            // only update what changed
            $set: {
                company: {
                    name: req.body.name,
                    contact_email: req.body.contact_email,
                    employees: req.body.employees
                }
            }
        }, {
            new: true,
            upsert: true
        }).select('-__v')
        
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

// Remove company from Unit
router.delete('/', async (req, res, next) => {
    try {
        const status = 200
        // find the entry by ID
        const unit = await Units.findOneAndUpdate({
            _id: req.params.unitID
        }, {
            // unset the company info
            $unset: {
                company: ''
            }
        }, {
            new: true
        }).select('-__v')

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

// TODO: FINISH. This returns employees but needs error checking
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
// TODO: needs error checking
router.get('/employees', async (req, res, next) => {
    try {
        const status = 200
        const unit = await Units.findById(req.params.unitID)

        //const company = await unit.({ company: null })
        const employees = await unit.company.employees

        // if (!unit) {
        //     throw new Error('No company assigned to this unit.')
        // }

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
// TODO: needs error checking
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
// TODO: needs error checking
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
        // report back error if 
        console.log(error)
        const e = new Error('Create new employee failed.')
        e.status = 404
        next(e)
    }
})

// Update an employee by ID
// TODO: needs error checking
router.patch('/employees/:id', async (req, res, next) => {
    try {
        const status = 201
        const unit = await Units.findById(req.params.unitID)
        const employee = unit.company.employees.id({ _id: req.params.id })
    
        employee.set(req.body)
        await unit.save()

        // grab updated employee info
        const updatedEmployee = unit.company.employees.id({ _id: req.params.id })
        res.json({ status, updatedEmployee })
    }
    catch(error) {
        // report back error if ...
        console.log(error)
        const e = new Error('Fill this in')
        e.status = 404
        next(e)
    }
})

// Delete an employee by ID
// TODO: needs error checking
router.delete('/employees/:id', async (req, res, next) => {
    try {
        const status = 200
        const unit = await Units.findById(req.params.unitID)
        const employee = unit.company.employees.id({ _id: req.params.id })

        employee.remove()
        await unit.save()

        res.json({ status, employee })
    }
    catch(error) {
        // report back error if ...
        console.log(error)
        const e = new Error('Unable to delete employee')
        e.status = 404
        next(e)
    }
})

module.exports = router