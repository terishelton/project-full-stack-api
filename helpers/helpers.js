const validate = (req, res, next) => {
    const error = { status: 400, message: 'Bad request' }
    if (!req.body) next(error)
    
    if (!req.body.kind) {
        // if there isn't a req.body.kind in the request, move on
        next()
    } else {
        // check the incoming create for the KIND of space
        // must match: seat, desk, small office, large office, or floor
        const availableKinds = ['seat', 'desk', 'small office', 'large office', 'floor']
        const kind = req.body.kind

        if (!availableKinds.includes(kind)) next(error)

        next()
    }
}

module.exports = { validate }