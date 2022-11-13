const express = require("express");
const router = express.Router();

//importing data model schemas
let { eventdata } = require("../models/models"); 
let { orgdata } = require("../models/models"); 

const orgid = process.env.ORG;

//Get orgname from Organization
router.get("/orgname", (req, res, next) => { 
    orgdata.find({ _id: orgid}, {_id: 0, OrgName: 1},(error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});


//GET all entries
router.get("/", (req, res, next) => { 
    eventdata.find( 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

//GET single entry by ID 
router.get("/id/:id", (req, res, next) => { 
    eventdata.find({ Organizationid: orgid, _id: req.params.id }, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});

//GET events based on organization 

router.get("/events", (req, res, next) => { 

    eventdata.find({ Organizationid: orgid }, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});

//GET attendees of all events from the last 2 months based on organization
router.get("/eventattendees", (req, res, next) => { 
    currentDate = new Date()
    function subtractMonths(numOfMonths, newdate = new Date()) {
    newdate.setMonth(newdate.getMonth() - numOfMonths);
    return newdate;
    } 
// this code is from https://bobbyhadz.com/blog/javascript-date-subtract-months#:~:text=function%20subtractMonths(numOfMonths%2C%20date%20%3D,Sun%20Feb%2027%202022%20console.
        
    eventdata.find({ Organizationid: orgid, date: {$lte: currentDate, $gte: subtractMonths(2)}},
        {_id: 0, attendees: { $sum: { $size:"$attendees"}}, eventName: 1}, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});

// Get attendees of a specific event 
router.get("/attendees/:eventName", (req, res, next) => { 

    eventdata.find({ Organizationid: orgid, eventName: req.params.eventName },
         {_id: 0, attendees: 1, eventName: 1}, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});




//GET entries based on search query
//Ex: '...?eventName=Food&searchBy=name' 
//change
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { eventName: { $regex: `^${req.query["eventName"]}`, $options: "i" }, Organizationid: orgid }
    } else if (req.query["searchBy"] === 'date') {
        dbQuery = {
            date:  req.query["eventDate"], Organizationid: orgid
        }
    };
    
    eventdata.find( dbQuery, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
    });
});

//GET events for which a client is signed up 
router.get("/client/:id", (req, res, next) => { 
    eventdata.find( 
        { Organizationid: orgid, attendees: req.params.id },
        {_id: 0, attendees: 1, eventName: 1}, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//POST 
router.post("/", (req, res, next) => { 
    eventdata.create( 
        req.body, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//PUT done
router.put("/:id", (req, res, next) => {
    eventdata.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.send('event updated');
            }
        }
    );
});

//PUT add attendee to event DONE
router.put("/addAttendee/:id", (req, res, next) => {
    //only add attendee if not yet signed up
    eventdata.find( 
        { _id: req.params.id, attendees: req.body.attendee, Organizationid: orgid }, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                if (data.length == 0) {
                    eventdata.updateOne(
                        { _id: req.params.id }, 
                        { $push: { attendees: req.body.attendee } },
                        (error, data) => {
                            if (error) {
                                consol
                                return next(error);
                            } else {
                                res.send("attendee has been added");
                            }
                        }
                    );
                }
                
            }
        }
    );
    
});
//DELETE event by _id
router.delete("/events/:_id", (req, res, next) => {
    //mongoose will use eventName of document
    eventdata.findOneAndRemove({_id: req.params._id }, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.send('event is deleted');
        }
    });
});


module.exports = router;