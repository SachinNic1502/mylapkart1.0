import mongoose, { Schema, models, model } from 'mongoose'

const ContactMessageSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

export default models.ContactMessage || model('ContactMessage', ContactMessageSchema)
