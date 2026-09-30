// Part 2
const express = require("express");
const fs = require("node:fs/promises");
const app = express();
const port = 3000;
const FILE = "./users.json";

async function readData() {
  try {
    const data = await fs.readFile(FILE, { encoding: "utf-8" });
    return data ? JSON.parse(data) : [];
  } catch (err) {
    if (err.code === "ENOENT") {
      return "file doesn't exist";
    }

    throw err;
  }
}

async function writeData(data) {
  await fs.writeFile(FILE, JSON.stringify(data), {
    encoding: "utf-8",
  });
}
// Create an API that adds a new user to your users stored in a JSON file
app.post("/user", express.json(), async (req, res) => {
  // steps of my logic
  try {
    // 1 - read user.json file
    // 2 - convert users from string to array of object using JSON.parse
    let users = await readData();
    // 3 - get body of request --> using middleware in express by using express.json()
    let { email, age, name } = req.body;
    // 4 - convert body to object // in express the middle ware function return body as an object
    // 5 - check on email
    const exist = users.find((user) => user.email === email);
    // if exist -> send response with user already exist
    if (exist) {
      return res
        .status(400)
        .send({ message: "Email already exist", success: false });
    }
    // else -> 5.1 - generate id to the new user
    const newId =
      users.length === 0 ? 1 : Math.max(...users.map((user) => +user.id)) + 1;
    // create user
    const newUser = {
      id: newId,
      name,
      age,
      email,
    };
    // 5.2 - add user to users
    users.push(newUser);
    // 5.3 convert users to string to write them in file
    // 5.3 - write file
    await writeData(users);
    // 5.4 - send response with user added successfully
    res.status(201).send({
      message: "user added successfully",
      success: true,
      data: newUser,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({
      message: "Internal Server Error",
      success: false,
    });
  }
});
// -----------------------------------------------------------------------
// Create an API that updates an existing user's name, age, or email by their ID. The user ID should be retrieved from the params
app.patch("/user/:id", express.json(), async (req, res) => {
  // 1. Get the user ID from the URL parameters
  const { id } = req.params;

  // 2. Get the fields to be updated from the request body
  const { email, age, name } = req.body;

  // 3. Read users from the JSON file
  let users = await readData();

  // Check if the users file is empty
  if (!users) {
    return res
      .status(404)
      .send({ message: "Users file is empty.", success: false });
  }

  // 4. Find the user by ID
  const exist = users.findIndex((user) => user.id === +id);

  // Return 404 if the user does not exist
  if (exist === -1) {
    return res
      .status(404)
      .send({ message: "User ID not found.", success: false });
  }

  // 5. Check if the new email is already used by another user
  const emailExist = users.find(
    (user) => user.email === email && user.id !== id,
  );

  // Return 400 if the email is already in use
  if (emailExist) {
    return res
      .status(400)
      .send({ message: "User email already exists.", success: false });
  }

  // 6. Update only the fields that were provided in the request body
  if (email != undefined) users[exist].email = email;
  if (name != undefined) users[exist].name = name;
  if (age != undefined) users[exist].age = age;

  // 7. Save the updated users back to the JSON file
  await writeData(users);

  // 8. Send a success response
  res.status(200).send({
    message: "User updated successfully",
    success: true,
  });
});

// -----------------------------------------------------------------------
//Create an API that deletes a User by ID. The user id should be retrieved from either the request body or optional params.
async function deleteUser(id) {
  //1. read file
  let users = await readData();
  //2. check if user with id is exist
  const userIdx = users.findIndex((user) => user.id === +id);
  // if user not exist
  if (userIdx === -1) {
    return false;
  }
  // else user is exist
  users.splice(userIdx, 1);
  // 4. write new users
  await writeData(users);
  return true;
}
app.delete("/user", express.json(), async (req, res) => {
  const id = req.body.id;

  if (!id) {
    return res.status(400).send({
      message: "User ID is required",
      success: false,
    });
  }

  const flag = await deleteUser(id);
  if (flag) {
    return res
      .status(200)
      .send({ message: "user Deleted Successfully ", success: true });
  } else {
    res.status(404).send({ message: "user ID not found ", success: false });
  }
});

app.delete("/user/:id", async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send({
      message: "User ID is required",
      success: false,
    });
  }

  const flag = await deleteUser(id);
  if (flag) {
    return res
      .status(200)
      .send({ message: "user Deleted Successfully ", success: true });
  } else {
    res.status(404).send({ message: "user ID not found ", success: false });
  }
});

// -----------------------------------------------------------------------
// Create an API that gets a user by their name. The name will be provided as a query parameter
app.get("/user/getByName", async (req, res) => {
  const name = req.query.name;
  const users = await readData();

  const result = users.filter(
    (user) => user.name.toLowerCase() === name.toLowerCase(),
  );

  if (result.length === 0) {
    return res.status(404).send({
      message: "user name not Found . ",
      success: false,
    });
  }
  res.send({ message: "users with name : ", success: true, data: result });
});

// -----------------------------------------------------------------------
//Create an API that gets all users from the JSON file.
app.get("/user", async (req, res) => {
  // read file -> (get users from file)
  const users = await readData();
  if (users.length === 0) {
    return res.status(404).send({ message: "No users found ", success: false });
  }
  // else send users in response
  res.status(200).send({
    message: "users fetched successfully ",
    success: true,
    data: users,
  });
});

// -----------------------------------------------------------------------
// Create an API that filters users by minimum age.
app.get("/user/filter", async (req, res) => {
  // get age from query and cast it to number using unary operator
  const age = Number(req.query.age);
  // check if age is not a number

  if (Number.isNaN(age)) {
    return res.status(400).send({
      message: "enter a Valid age ",
      success: false,
    });
  }
  // get users from file
  const users = await readData();
  if (users.length === 0) {
    return res
      .status(404)
      .send({ message: "there is no users ", success: false });
  }
  // use array method -> filter to get users with age > min age
  const result = users.filter((user) => user.age >= age);
  if (result.length === 0) {
    return res.status(404).send({
      message: "no user found",
      success: false,
    });
  }
  // else
  return res.status(200).send({
    message: "user fetched successfully ",
    success: true,
    data: result,
  });
});

// -----------------------------------------------------------------------
// Create an API that gets User by ID.
app.get("/user/:id", async (req, res) => {
  // get id from url
  const { id } = req.params;
  // read all users
  const users = await readData();
  // check if there is users or no
  if (users.length === 0) {
    return res.status(404).send({
      message: "there is no user ",
      success: false,
    });
  }
  // if there user find user with id
  const user = users.find((user) => user.id === +id);
  // check if there is no user match with id
  if (!user) {
    return res.status(404).send({
      message: "no user match ID",
      success: false,
    });
  }
  //if user exist send response
  res.status(200).send({
    message: "user fetched successfully",
    success: true,
    data: user,
  });
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
