const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 5
    },
    born: {
      type: Number
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

schema.virtual('books', {
  ref: 'Book',
  localField: '_id',
  foreignField: 'author'
})

module.exports = mongoose.model('Author', schema)
