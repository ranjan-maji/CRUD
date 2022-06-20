const express = require('express');
const router = new express.Router();
const Empley = require('../models/employee');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');



// New employee Create and send data in database
router.post('/employee', async(req, res) => {

    try{
        const newUser = new Empley(req.body)
        const createUser = await newUser.save()
        const token = await newUser.generateAuthToken()
        res.status(201).send({ createUser, token })
    }catch(error)
        { res.status(400).send(error);}
})
//Read data from token
router.get('/user/me', auth, async (req, res) => {
    res.send(req.user)
})

//Read  All employee data from employee database
router.get('/employeeall', async(req, res) => {
    try{
        const dtlEmp = await Empley.find({})
        res.send(dtlEmp)
    }catch(error){
        res.status(500).send(error)
    }
})


//Read one employee data from employee database
router.get('/employeeone/:id', async(req, res) => {
    try{
        const _id = req.params.id
        const oneEnp = await Empley.findById(_id)

       if(!oneEnp){
            return res.status(404).send()              
        }else{
            res.send(oneEnp)
        } 
    }catch(error){
        res.send(error)
    }
})

//Update Data in patch Method by id
router.patch('/employeeupdate/:id', async (req, res) => {
    try{
        const _id = req.params.id;
        const updateEmployee = await Empley.findOneAndUpdate(_id, req.body, {
            new : true
        });
        res.send(updateEmployee);
        }catch(error){
            res.status(500).send(error);
        }
})


//delete the students by ID
router.delete('/employeedel/:id', async(req,res) => {
    try{
        const deleteEmployee = await Empley.findByIdAndDelete(req.params.id)
        if(!req.params.id){
            return res.status(400).send()
        }
        res.send(deleteEmployee)
    }catch(error){
        res.status(500).send(error)
    }
})

//Login Employees
router.post('/login' ,async(req, res) => {

    try { 
        const user = await Empley.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user , token })

    } catch (error) {

        res.status(400).send()
    }
        
    });


//Logout Employees

router.post('/logout', auth, async(req, res) => {
    try {

        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        res.clearCookie('jwt')
        await req.user.save()

        res.send('logout')
        console.log('logout successfully')
    } catch (error) {
        res.status(500).send(error)
    }
 })



module.exports = router;