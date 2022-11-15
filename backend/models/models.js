const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Organization schema

let Organization = new Schema({ 
    _id: {
            type: Number
        },
    OrgName: {
        type: String,
        require: true  
    }
}, {
    collection: 'orgdata',
    timestamps: true
});

//collection for intakeData
let primaryDataSchema = new Schema({
    //reference each org 
    _id: { type: String, default: uuid.v1 },
    firstName: {
        type: String,
        require: true        
    },
    Organizationid: {
        type: mongoose.Schema.Types.Number,
        ref:'orgdata',
        default: process.env.ORG
    },
    middleName: {
        type: String
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    phoneNumbers: {
        type: Array,
        required: true
    },
    address: {
        line1: {
            type: String
        },
        line2: {
            type: String,
        },
        city: {
            type: String,
            required: true
        },
        county: {
            type: String,
        },
        zip: {
            type: String,
        }
    }
}, {
    collection: 'primaryData',
    timestamps: true
});

//collection for eventData
let eventDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    eventName: {
        type: String,
        require: true,
        unique: true // For use in delete CRUD
    },
    Organizationid: {
        type: mongoose.Schema.Types.Number,
        ref:'orgdata',
        default: process.env.ORG
    },
    services: {
        type: Array
    },
    date: {
        type: Date,
        required: true
    },          
    address: {
        line1: {
            type: String
        },
        line2: {
            type: String,
        },
        city: {
            type: String,
        },
        county: {
            type: String,
        },
        zip: {
            type: String,
        }
    },
    description: {
        type: String,
    },
    attendees: {
        type: String
    }
}, {
    collection: 'eventData'
});

// create models from mongoose schemas
const primarydata = mongoose.model('primaryData', primaryDataSchema);
const eventdata = mongoose.model('eventData', eventDataSchema);
const orgdata = mongoose.model('orgdata', Organization);

// package the models in an object to export 
module.exports = { primarydata, eventdata, orgdata }
