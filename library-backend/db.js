const mongoose = require('mongoose')

const connectToDatabase = async uri => {
  console.log(`connecting to database: ${uri}`)

  try {
    await mongoose.connect(uri)
    console.log('connected to MongoDB')
  } catch (error) {
    console.log('error connecting to database', error.message)
    process.exit(1)
  }
}

module.exports = connectToDatabase
