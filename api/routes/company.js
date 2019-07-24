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
router.get('/employees', async (req, res, next) => {
    try {
        const status = 200
        const unit = await Units.findById(req.params.unitID)
        
        if (unit.company == '{ employees: [] }' ) {
            console.log('company not assigned!')
            const error = { status: 404, message: 'No company assigned to this unit.' }
            next(error)
        } else {
            const unit = await Units.findById(req.params.unitID)
            const employees = await unit.company.employees
            res.json({ status, employees })
        }
        
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
router.get('/employees/:id', async (req, res, next) => {
    try {
        const status = 200
        const unit = await Units.findById(req.params.unitID)
        const employee = await unit.company.employees.id({ _id: req.params.id })

        if (unit.company == '{ employees: [] }' ) {
            console.log('company not assigned!')
            const error = { status: 404, message: 'No company assigned to this unit.' }
            next(error)
        } else if (!employee) {
            console.log('company not assigned!')
            const error = { status: 404, message: 'No employee with that ID.' }
            next(error)
        } else {
            res.json({ status, employee })
        }
    }
    catch(error) {
        // report back error if ...
        console.log(error)
        const e = new Error('Unit not found.')
        e.status = 404
        next(e)
    }
})

// Create new employees and add to the unit/company
router.post('/employees', async (req, res, next) => {
    try {
        const status = 201
        const unit = await Units.findById(req.params.unitID)
        const allEmployees = unit.company.employees
    
        if (unit.company == '{ employees: [] }' ) {
            console.log('company not assigned!')
            const error = { status: 404, message: 'No company assigned to this unit.' }
            next(error)
        } else {
            allEmployees.push(req.body)
            await unit.save()
    
            const newEmployee = unit.company.employees[unit.company.employees.length - 1]
            res.json({ status, newEmployee })
        }
    }
    catch(error) {
        // report back error if unit ID does not exist
        console.log(error)
        const e = new Error('Unit ID does not exist.')
        e.status = 404
        next(e)
    }
})

// Update an employee by ID
router.patch('/employees/:id', async (req, res, next) => {
    try {
        const status = 201
        const unit = await Units.findById(req.params.unitID)
        const employee = unit.company.employees.id({ _id: req.params.id })
    
        if (unit.company == '{ employees: [] }' ) {
            console.log('company not assigned!')
            const error = { status: 404, message: 'No company assigned to this unit.' }
            next(error)
        } else if (!employee) {
            console.log('no employee with that ID!')
            const error = { status: 404, message: 'No employee with that ID.' }
            next(error)
        } else {
            employee.set(req.body)
            await unit.save()
    
            // grab updated employee info
            const updatedEmployee = unit.company.employees.id({ _id: req.params.id })
            res.json({ status, updatedEmployee })
        }
    }
    catch(error) {
        // report back error if there's no Unit ID match
        console.log(error)
        const e = new Error("Sorry, that Unit ID doesn't exist.")
        e.status = 404
        next(e)
    }
})

// Delete an employee by ID
router.delete('/employees/:id', async (req, res, next) => {
    try {
        const status = 200
        const unit = await Units.findById(req.params.unitID)
        const employee = unit.company.employees.id({ _id: req.params.id })

        if (unit.company == '{ employees: [] }' ) {
            console.log('company not assigned!')
            const error = { status: 404, message: 'No company assigned to this unit.' }
            next(error)
        } else if (!employee) {
            console.log('no employee with that ID!')
            const error = { status: 404, message: 'No employee with that ID.' }
            next(error)
        } else {
            employee.remove()
            await unit.save()
    
            res.json({ status, employee })
        } 
    }
    catch(error) {
        // report back error if there's no unit ID match
        console.log(error)
        const e = new Error("Unit ID doesn't match")
        e.status = 404
        next(e)
    }
})

module.exports = router