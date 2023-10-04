import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    img: String,
    country: {
      type: String,
      required: true
    },
    phone: String,
    desc: String,
    isSeller: Boolean
  },
  {
    timestamps: true
  }
);

export default mongoose.model('User', userSchema);
