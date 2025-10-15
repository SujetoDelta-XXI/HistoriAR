import mongoose from 'mongoose';

const DaySchema = new mongoose.Schema({
  open:   { type: String },
  close:  { type: String },
  closed: { type: Boolean, default: false }
}, { _id: false });

const InstitutionSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  type:        { type: String, enum: ['Museo', 'Universidad', 'Municipalidad', 'Otro'], default: 'Museo' },
  description: { type: String },
  district:    { type: String },
  address:     { type: String },
  contactEmail:{ type: String },
  phone:       { type: String },
  schedule: {
    monday:    { type: DaySchema, default: { closed: true } },
    tuesday:   { type: DaySchema },
    wednesday: { type: DaySchema },
    thursday:  { type: DaySchema },
    friday:    { type: DaySchema },
    saturday:  { type: DaySchema },
    sunday:    { type: DaySchema }
  },
  website:     { type: String },
  imageUrl:    { type: String }
}, { timestamps: true });

export default mongoose.model('Institution', InstitutionSchema);
