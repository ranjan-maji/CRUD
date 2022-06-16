const express = require('express');
const router = new express.Router();
const Empley = require('../models/employee');
const bcrypt = require('bcrypt');


// New employee Create and send data in database
router.post('/employee', async(req, res) => {

    try{
        const newUser = new Empley(req.body)
        const createUser = await newUser.save()
        res.status(201).send(createUser)
    }catch(error)
        { res.status(400).send(error);}
})


//Read  All employee data from employee database
router.get('/employeeall', async(req, res) => {
    try{
        const dtlEmp = await Empley.find()
        res.send(dtlEmp)
    }catch(error){
        res.send(error)
    }
})

//Read one employee data from employee database
router.get('/employeeone/:id', async(req, res) => {
    try{
        const _id = req.params.id
        const oneEnp = await Empley.findById(_id)

       if(!oneEnp){
            return res.send()              
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
        const {email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json(error)
        }

        const userLogin = await Empley.findOne({email: email });
        

        if(userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);

            if(!isMatch) {
                res.status(400).json(error);
                
            } else {
                res.status(400).json(userLogin);
            }
            } else {
                    res.status(400).json(error)
                }

            }catch(error) {
                console.log(error);
            }

        
    });




module.exports = router;