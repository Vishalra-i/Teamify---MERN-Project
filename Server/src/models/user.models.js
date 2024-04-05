import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true // Ensures no duplicate IDs
  },
  first_name: { 
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Ensures no duplicate emails
  },
  gender: {
    type: String,
  },
  avatar: {
    type: String,
  },
  domain: {
    type: String,
    required: true
  },
  available: {
    type: Boolean,
    required: true
  }
});



export const User = mongoose.model('User', userSchema);

