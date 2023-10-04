import mongoose from 'mongoose';

const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    buyerId: {
      type: String,
      required: true
    },
    sellerId: {
      type: String,
      required: true
    },
    readByBuyer: {
      type: Boolean,
      required: true
    },
    readBySeller: {
      type: Boolean,
      required: true
    },
    lastMessage: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Conversation', conversationSchema);
