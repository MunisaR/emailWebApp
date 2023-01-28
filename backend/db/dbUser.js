import { connect, model, mongoose } from "mongoose";
import { UUID } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const { Schema } = mongoose;
import moment from "moment/moment.js";

mongoose.set("strictQuery", false);

const dbUri = process.env.MONGO_CONNECTION_STRING;

connect(dbUri);
const genId = () => {
  return uuidv4();
};
export const Users = new Schema({
  id: {
    type: String,
    default: genId,
  },
  name: String,
  sent: {
    type: Array,
  },
  received: {
    type: Array,
  },
  date: { type: Date, default: Date.now },
});

export const Messages = new Schema({
  id: UUID,
  customId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    require: true,
  },
  text: {
    type: String,
    require: true,
  },
  sender: {
    type: String,
    require: true,
  },
  reciever: {
    type: String,
    require: true,
  },
  status: {
    type: Boolean,
    require: true,
    default: false,
  },
  date: {
    type: String,
    require: true,
    default: moment().format("LLL"),
  },
});

export const Message = mongoose.model("Message", Messages);

export const User = mongoose.model("User", Users);
