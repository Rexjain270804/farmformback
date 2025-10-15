import mongoose from 'mongoose'

const RegistrationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  registrationDate: String,
  farmerName: { type: String, required: true },
  fatherSpouseName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  altEmail: String,
  village: String,
  mandal: String,
  district: String,
  state: String,
  aadhaarOrFarmerId: String,
  totalLand: String,
  areaUnderNaturalHa: String,
  presentCrop: String,
  sowingDate: String,
  harvestingDate: String,
  cropTypes: String,
  currentPractice: String,
  yearsExperience: String,
  irrigationSource: String,
  livestock: [String],
  willingNaturalInputs: String,
  trainingRequired: String,
  localGroup: String,
  preferredSeason: String,
  remarks: String,

  // Payment/order
  orderId: String,
  paymentStatus: { type: String, enum: ['pending','paid','failed'], default: 'pending' },
  paymentId: String,
  signature: String,
  paidAt: Date,
}, { timestamps: true })

export const Registration = mongoose.model('Registration', RegistrationSchema)
