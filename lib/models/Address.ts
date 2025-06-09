import mongoose, { Schema, Document } from 'mongoose';

export interface IAddress extends Document {
  user: Schema.Types.ObjectId;
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

const AddressSchema = new Schema<IAddress>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
});

export default mongoose.models.Address || mongoose.model<IAddress>('Address', AddressSchema);
