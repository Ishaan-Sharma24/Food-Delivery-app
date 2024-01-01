const express=require('express');
const router=express.Router();
const User=require('../models/User')

const {body,validationResult}=require('express-validator');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const jwtSecret="123456789ishaan";

router.post('/createuser', [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('name').isLength({ min: 3 })
], async (req, res) => {
    let success = false
    console.log(req.body.name);  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("validation error");
        return res.status(400).json({ success, errors: errors.array() })
    }
   
    // let user = await User.findOne({email:req.body.email})
   const salt = await bcrypt.genSalt(10)
   let securePass = await bcrypt.hash(req.body.password, salt);
    try {
       
        await User.create({
            name: req.body.name,
            password: securePass,  //first write this and then use bcryptjs
           // password: req.body.password,
            email: req.body.email,
            location: req.body.location
           
        }).then(user => {
            const data = {
                user: {
                    id: user.id
                }
            }
           const authToken = jwt.sign(data, '123456789ishaan');
            success = true
           
            res.json({ success,authToken })
        })
            .catch(err => {
                console.log(err);
                res.json({ error: "Please enter a unique value." })
            })
    } catch (error) {

        console.error("error");
    }
})
router.post('/login', [
    body('email', "Enter a Valid Email").isEmail(),
    body('password', "Password cannot be blank").exists(),
], async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });  //{email:email} === {email}
        if (!user) {
            return res.status(400).json({ success, error: "Try Logging in with correct email credentials" });
        }

        const pwdCompare = await bcrypt.compare(password, user.password); // this return true false.
        if (!pwdCompare) {
            return res.status(400).json({ success, error: "Try Logging in with correct pass credentials" });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        success = true;
        const authToken = jwt.sign(data, jwtSecret);
        res.json({ success,authToken })


    } catch (error) {
        console.error(error.message)
        res.send("Server Error")
    }
})

module.exports = router;