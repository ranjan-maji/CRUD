
const mongoose = require('mongoose');
const validator = require('validate');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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
            },
            tokens: [{
                token: {
                    type: String,
                    required: true
                }
            }]
})

//Generating tokens
employee.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id:user.id.toString()}, 'hiiamranjanmajiiambackenddev')

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}


//Login Function with bcrypt form
employee.statics.findByCredentials = async (email, password) => {
    const user = await Empley.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

//convert password into Hash Method
employee.pre('save', async function(next) {

   if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password, 10);
   
    
   }
   next();
})

//we will crearte a  new collection
const Empley = new mongoose.model('Empley', employee);

module.exports = Empley;