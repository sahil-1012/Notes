const express = require("express");
const router = express.Router();


const Notes = require("../models/Note");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require('express-validator');


// ~ ***** ROUTE 01: GET ALL THE NOTES *****
// ! GET ALL THE NOTES USING  : GET  "/api/notes/fetchnotes"
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);

    } catch (error) {
        console.error(error.message);
    }
});

// ~ ***** ROUTE 02: ADDING THE NEW NOTES *****
// ! GET ALL THE NOTES USING  : GET  "/api/notes/addnotes"
router.post('/addnotes', fetchuser, [
    body('title', "Enter the Valid Title").isLength({ min: 3 }),
    body('description', "Description must contain atleast 5 Characters").isLength({ min: 5 })],

    async (req, res) => {
        try {
            const { title, description, tag } = req.body;

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.message });
            }

            const notes = new Notes({
                title, description, tag, user: req.user.id
            })

            const savenote = await notes.save();

            res.json(savenote);

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Some Exceptionally Internal error occurred");

        }
    });

// ~ ***** ROUTE 03: UPDATING THE NOTES *****
// ! UPDATE ALL THE NOTES USING  : PUT  "/api/notes/updatenotes"
router.put('/updatenotes/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        // ! CREATING A NEW NOTE
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // ! FINDING THE NOTE TO BE UPDATED & UPDATE IT
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Note not found");
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        return res.json({ note });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Exceptionally Internal error occurred");

    }
});


// ~ ***** ROUTE 04: DELETING THE NOTES *****
// ! GET ALL THE NOTES USING  : DELETE  "/api/notes/updatenotes"
router.delete('/deletenotes/:id', fetchuser, async (req, res) => {
    try {
        // ! FINDING THE NOTE TO BE UPDATED & DELETE IT
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Note not found");
        }

        // ! ALLOW DELETION ONLY IF USER OWNS IT
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        return res.json({
            "Success": "Success the id is been Deleted",
            note
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Exceptionally Internal error occurred");

    }

});
module.exports = router;