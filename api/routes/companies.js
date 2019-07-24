const router = require('express').Router({ mergeParams: true })
const Units = require('../models/units')

// base route is /api/v1/companies

// GET companies
router.get('/', async (req, res, next) => {
    const status = 200
    const query = req.query
    const value = Object.values(query)

    if (Object.keys(query) == 'name') {
        const nameMatches = await Units.find({ 'company.name': new RegExp(value, 'i') })
        res.json({ status, nameMatches })

        //TODO: Finish this
    } else if (Object.keys(query) == 'employees_lte') {
        //const lessThanEqual = await Units.find().count()
        // const lessThanEqual = await Units.aggregate([{
        //     $group: {
        //         _id: 1,
        //         count: { $size: '$employees' }
        //     }
        // }])
        // console.log(lessThanEqual)
        // res.json({ status, lessThanEqual })

        // TODO: finish this
    } else if (Object.keys(query) == 'employees_gte') {

    } else {
        // returns all company information
        const units = await Units.find().select('company')
        res.json({ status, units })
    }
})

module.exports = router