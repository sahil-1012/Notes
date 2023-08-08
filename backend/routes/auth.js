const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require("../models/User");
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'jwt-secret';

// ~ ***** CREATE A USER USING  :POST  "/api/auth/createuser"     doesn't REQUIRED AUTHENTICATION 


// *****  ROUTE - 01 CREATE A USER
router.post('/createuser', [
    body('name', "Enter the Valid name").isLength({ min: 3 }),
    body('email', "Enter the Valid Email").isEmail(),
    body('password', "Password must contains more than 5 Characters").isLength({ min: 5 })],

    async (req, res) => {
        let success = false;
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            try {
                // **** IF ONE USER EXIST THEN RETURN USER ALREADY EXISTS
                let user = await User.findOne({ email: req.body.email });
                // ~ ***** METHOD - 02
                if (user) {
                    return res.status(400).send({ success, error: "User Already Exists" });
                    
                    // return res.status(400).send("User Already Exists");      // TEXT REPLY
                }

                const salt = await bcrypt.genSalt(10);
                const secPass = await bcrypt.hash(req.body.password, salt);

                // ***** CREATING A NEW USER
                user = await User.create({
                    name: req.body.name,
                    password: secPass,
                    email: req.body.email
                })
                const data = {
                    user: { id: user.id }
                }

                const authToken = jwt.sign(data, JWT_SECRET);

                success = true;
                res.json({ authToken, success });


            } catch (error) {
                console.log(error);
                res.status(500).send("Some Exceptionally Internal error occurred");

            }
        } else {
            res.send({ errors: errors.array() });  // ! Used with Method -1 
        }

    }
);

// *****  ROUTE - 02 LOGIN USER WITH CREDENTIAL
router.post('/login', [
    body('email', "Enter the Valid Email").isEmail(),
    body('password', "Password cant be Blank").exists()],
    async (req, res) => {
        const error = validationResult(req);
        let success = false;

        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }

        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: "Try to Login with appropriate Credentials" });
            }
            let success;
            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                return res.status(400).json({ success, error: "Try to Login with appropriate Credentials" })
            }

            const data = {
                user: { id: user.id }
            }

            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({
                authToken: authToken,
                success
            });


        } catch (error) {
            console.error(error.message);
            res.status(500).send("Some Exceptionally Internal error occurred");

        }
    });

// *****  ROUTE - 03 GET USER DATA - Login Required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;

        // NOW WE CAN SELECT ALL THE FIELDS EXCEPT PASSWORD
        const user = await User.findById(userId).select("-password");
        res.send(user);

    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});


module.exports = router;