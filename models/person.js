const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');


const url = process.env.MONGODB_URI
console.log('connecting to', url.split('@')[1])
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {console.log('connected to MongoDB')})
  .catch((error) => {console.error('error connecting to MongoDB:', error.message)})

const countDigits  = (s) => s.split('').map((n) => n < 10).reduce((a,b)=>a+b)

const personSchema = new mongoose.Schema({
  name: { type: String, unique: true, minlength: 3, required: true, uniqueCaseInsensitive: true },
  number: {
    type: String,
    validate: {
      validator: (v) => {return countDigits(v) >= 8},
      message: props => `The '${props.value}' phone number doesn't have at least 8 digits!`
    },
    required: [true, 'phone number required']
  },
})
personSchema.plugin(uniqueValidator);
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
