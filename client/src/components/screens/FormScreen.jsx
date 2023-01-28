import React, { useState } from "react";
import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container } from "reactstrap";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const genId = () => {
  return uuidv4();
};

const FormScreen = () => {
  const [recipientName, setRecipientName] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [all_users, setAllUser] = useState([]);
  const [toggledContainer, setToggledContainer] = useState(true);
  const [filtered_users, setFilteredUsers] = useState([]);
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [senderObj, setSenderObj] = useState("");
  const [messageToggle, setMessageToggle] = useState(false);
  const location = useLocation();
  localStorage.setItem("name", location.state.name);
  let localName = localStorage.getItem("name");
  console.log(localName);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Form submitted, ${recipientName}`);
    setRecipientName("");
    setTitle("");
    setMessage("");
  };

  const fetchData = async () => {
    await axios
      .get("/users")
      .then((res) => setAllUser(res.data))

      .catch((err) => console.log(err));
  };

  const fetchSender = async () => {
    await axios
      .post("/sender", { n: localStorage.getItem("name") })
      .then((res) => {
        setSenderObj(res.data);
        setSender(res.data[0]["name"]);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchData();
    fetchSender();
  }, []);

  useLayoutEffect(() => {
    fetchData();
    fetchSender();
  }, []);

  const updateRecipient = async () => {
    let email = {
      title,
      message,
      reciever: recipient,
      sender: sender,
      status: true,
      customId: genId(),
    };

    await axios
      .patch("/receiver", {
        recipient: String(recipientName),
        email: email,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateSender = async () => {
    let email = {
      title,
      message,
      reciever: recipient,
      sender: localName,
      status: true,
      customId: genId(),
    };

    await axios
      .patch("/sender", {
        sender: String(email.sender),
        email: email,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let email = {
    title,
    message,
    reciever: recipient,
    sender: location.state.name,
    status: true,
    customId: genId(),
  };

  return (
    <Container className="p-5 m-5">
      <div>
        <div className="alert alert-dismissible alert-light">
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
          ></button>
          <strong>{localName} is Sending Email</strong>
          <Container>
            <form className="p-5" onSubmit={handleSubmit}>
              <fieldset>
                <center>
                  <h1>Send Message</h1>
                </center>
                <div className="form-group">
                  <label
                    htmlFor="exampleInputEmail1"
                    className="form-label mt-4"
                  >
                    Name
                  </label>
                  <input
                    onBlur={() => setToggledContainer(false)}
                    value={recipientName}
                    onFocus={() => {
                      setMessageToggle(true);
                    }}
                    onChange={(e) => {
                      setToggledContainer(true);
                      setRecipientName(e.target.value);
                      setFilteredUsers(
                        all_users.filter((user) => {
                          return user.name.includes(e.target.value);
                        })
                      );
                      console.log(filtered_users);
                      setRecipient(
                        all_users.filter((el) => {
                          return el.name.includes(e.target.value);
                        })[0]["name"]
                      );
                    }}
                    type="name"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder="recipient name"
                  />
                </div>
                {recipientName.length > 0 ? (
                  <Container
                    className={`py-3 ${toggledContainer ? "" : "d-none"}`}
                  >
                    <div className=" p-1">
                      {filtered_users.map((user, index) => {
                        return (
                          <h5
                            key={index}
                            onClick={() => {
                              setRecipientName(user.name);
                              setToggledContainer(false);
                            }}
                          >
                            {user.name}
                          </h5>
                        );
                      })}
                    </div>
                  </Container>
                ) : (
                  ""
                )}
                <div className="form-group">
                  <label
                    htmlFor="exampleInputEmail1"
                    className="form-label mt-4"
                  >
                    Title
                  </label>
                  <input
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    type="title"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder="enter title"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleTextarea" className="form-label mt-4">
                    Message
                  </label>
                  <textarea
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    className="form-control"
                    id="exampleTextarea"
                    rows="3"
                  ></textarea>
                </div>
                <center>
                  <button
                    type="submit"
                    className=" mx-5 mt-5 btn btn-primary"
                    onClick={async () => {
                      if (message.length > 0 && recipientName.length > 0) {
                        updateRecipient();
                        updateSender();

                        setTimeout(() => {}, 3500);

                        await axios
                          .post("/new_message", {
                            email,
                          })
                          .then((res) => console.log(res))
                          .catch((err) => console.log(err));
                      } else {
                        alert("Please fill the form!!!");
                      }
                    }}
                  >
                    Submit
                  </button>
                </center>
              </fieldset>
            </form>
          </Container>
        </div>

        {messageToggle ? (
          <Container>
            <center>
              <h4 className="m-3">Messages</h4>
            </center>
            {Object.keys(senderObj).length > 0 &&
              senderObj[0].received.map((element, i) => (
                <div key={i} className="list-group">
                  <a
                    href="#"
                    className="list-group-item list-group-item-action flex-column align-items-start"
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-1">{element.sender}</h5>
                      <small>to me</small>
                    </div>
                    <p className="mb-1">{element.status}</p>
                    <small>Title: {element.title}</small>
                    <p className="m-0" style={{ textDecoration: "underline" }}>
                      Message:
                    </p>
                    <div className="bg-white rounded-3 px-3 py-1">
                      <p className="m-0">{element.message}</p>
                    </div>
                  </a>
                  <br />
                </div>
              ))}
          </Container>
        ) : (
          "no received"
        )}
      </div>
    </Container>
  );
};

export default FormScreen;
