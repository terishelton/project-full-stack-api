var mongoose = require('mongoose')
var Schema = mongoose.Schema

var schema = new Schema({
    kind: {
        type: String,
        required: true
    },
    floor: {
        type: Number,
        required: true
    },
    special_monthly_offer: {
        type: Number
    },
    company: {
        name: {
            type: String,
            required: true
        },
        contact_email: {
            type: String,
            required: true,
            unique: true,
            match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        },
        employees: [{
            first_name: {
                type: String,
                required: true
            },
            last_name: {
                type: String,
                required: true
            },
            preferred_name: {
                type: String
            },
            position: {
                type: String
            },
            birthday: {
                type: String
            },
            email: {
                type: String,
                required: true,
                unique: true,
                match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            }
        }]
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updatedAt' }
});

module.exports = mongoose.model('Units', schema)