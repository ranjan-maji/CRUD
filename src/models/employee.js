
const mongoose = require('mongoose');
const validator = require('validate');
const bcrypt = require('bcrypt');


const employee = new mongoose.Schema({

            name: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
                unique: [true, 'Email id already Present'],
                validator(value){
                    if(!validator.isEmail(value)){
                        throw new Error('Invalid Email')
                    }
                }
            },
            phone: {
                type: Number,
                min:10,
                required:true,
                unique:true
            },
            address: {
                type:String,
                required: true
            },
            password: {
                type:String,
                required:true
            }
})


employee.pre('save', async function(next) {

   if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password, 10);
   
    
   }
   next();
})

//we will crearte a  new collection
const Empley = new mongoose.model('Empley', employee);

module.exports = Empley;