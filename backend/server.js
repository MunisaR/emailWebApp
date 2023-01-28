import express from "express";
import { User, Message } from "./db/dbUser.js";
import bodyParser from "body-parser";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/user", async (req, res) => {
  const users = await User.find({
    name: req.body.name,
  });
  try {
    if (users.length > 0) {
      res.json("user already exists");
    } else {
      let newUser = new User({
        name: req.body.name,
      });
      newUser.save((e) => console.log(e));
      const user = await User.find();
      res.json("user created");
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/sender", async (req, res) => {
  try {
    const user = await User.find({
      name: req.body.n,
    });
    res.json(user);
  } catch (error) {
    console.log(error);
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.log(error);
  }
});

app.post("/get_user", async (req, res) => {
  try {
    const user = await User.find({ n: req.body.localName });
    res.json(user);
  } catch (error) {
    console.log(error);
  }
});

app.post("/get_sender", async (req, res) => {
  try {
    res.json({ sender });
  } catch (error) {
    console.log(error);
  }
});

app.patch("/receiver", async (req, res) => {
  try {
    const receiver = User.find({ name: req.body.recipient });
    User.findOneAndUpdate(
      { name: req.body.recipient },
      { $push: { received: req.body.email } },
      () => {
        console.log("message sended to recipient");
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.patch("/sender", async (req, res) => {
  try {
    const sender = User.find({ name: req.body.sender });
    User.findOneAndUpdate(
      { name: req.body.sender },
      { $push: { sent: req.body.email } },
      () => {
        console.log("message sended to sender");
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.post("/new_message", async function (req, res) {
  try {
    let newMessage = new Message(req.body.email);
    newMessage.save((e) => console.log(e));

    res.json(req.body);
  } catch (err) {
    console.log(err);
  }
});

app.post("/all_messages", async (req, res) => {
  try {
    const message = await Message.find({ sender: req.params.sender });
    res.json(message);
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
