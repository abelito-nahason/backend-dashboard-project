const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const verifyAuth = require('../middleware/verifyAuth')

router.post('/register', async (req,res) => {

    try {
        const {username,password} = req.body
    
        if(!username || !password) return res.status(400).json({message: 'Missing required fields', success: false})
    
        let userExists = await User.findOne({username})
        if(userExists) return res.status(400).json({message: 'user already exists!', success: false})
        
        let user = new User({
            username,
            password
        })
    
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password,salt)
        await user.save()        

        jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: 36000}, (err,token) => {
            if(err) throw err
            return res.status(200).json({
                token
            })
        })

    } catch (error) {
        console.log(error)
        return res.status(400).json({success:false})
    }

})  

router.post('/login', async (req,res) => {
    
    try {
        const {username, password} = req.body

        if(!username || !password) return res.status(400).json({message: "Invalid credentials", success: false})

        let user = await User.findOne({username}).select('+password')
        if(!user) return res.status(400).json({message: "Invalid credentials"})
            
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(400).json({message: "Invalid credentials"})
        
        jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: 36000}, (err,token) => {
            if(err) throw err
            return res.status(200).json({
                token
            })
        })
            
    } catch (error) {
        console.log(error)
        return res.status(400).json({success:false})
        
    }

})


module.exports = router;