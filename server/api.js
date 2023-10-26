const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { initializeDatabase, queryDB,insertDB, insertContent, selectContent, abfrage } = require("./database");
const jwt = require("jsonwebtoken");



const jwtSecret = process.env.JWT_SECRET || "supersecret";

const posts = "test"

const initializeAPI = async (app) => {
  req.log.info("Initializing API");
  db = initializeDatabase();

  app.post(
    "/api/login",
    body("username")
      .notEmpty()
      .withMessage("Username is required.")
      .isEmail()
      .withMessage("Invalid email format."),
    body("password")
      .isLength({ min: 10, max: 64 })
      .withMessage("Password must be between 10 to 64 characters.")
      .escape(),
    login
  );
  req.log.info("API login endpoint initialized");
  await insertDB(db, insertContent)
  req.log.info("Database initialized");
  app.get("/api/posts", getPosts);
  req.log.info("API posts endpoint initialized");
};







const login = async (req, res) => {
  req.log.info("Login function called");
  // Validate request
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const formattedErrors = [];
    result.array().forEach((error) => {
      console.log(error);
      formattedErrors.push({ [error.path]: error.msg });
    });
    req.log.error("Login validation errors", formattedErrors);
    return res.status(400).json(formattedErrors);
  }
  req.log.info("Login successful");
  // Check if user exists
  const { username, password } = req.body;
  const getUserQuery = `
    SELECT * FROM users WHERE username = '${username}';
  `;
  const user = await queryDB(db, getUserQuery);
  if (user.length === 0) {
    return res
      .status(401)
      .json({ username: "Username does not exist. Or Passwort is incorrect." });
  }
  // Check if password is correct
  const hash = user[0].password;
  const match = await bcrypt.compare(password, hash);
  if (!match) {
    req.log.error("Incorrect password for username: " + username);
    return res
      .status(401)
      .json({ username: "Username does not exist. Or Passwort is incorrect." });
  }
  // Create JWT
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: { username, roles: [user[0].role] },
    },
    jwtSecret
  );

  return res.send(token);
};



const getPosts = (req, res) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    req.log.error("No authorization header.");
    return res.status(401).json({ error: "No authorization header." });
  }
  const [prefix, token] = authorization.split(" ");
  if (prefix !== "Bearer") {
    req.log.error("Invalid authorization prefix.");
    return res.status(401).json({ error: "Invalid authorization prefix." });
  }
  const tokenValidation = jwt.verify(token, jwtSecret);
  if (!tokenValidation?.data) {
    req.log.error("Invalid token.");
    return res.status(401).json({ error: "Invalid token." });
  }
  if (!tokenValidation.data.roles?.includes("viewer")) {
    req.log.error("User is not a viewer.");
    return res.status(403).json({ error: "You are not a viewer." });
  }
  req.log.info("Retrieved and sent posts to the client.");
  return res.send(posts);
};

module.exports = { initializeAPI };
