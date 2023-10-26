const { insertDB, insertContent } = require("../../server/database");

document.addEventListener("DOMContentLoaded", () => {
  const feed = document.getElementById("feed");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const loginButton = document.getElementById("login");
  const bruteForceButton = document.getElementById("bruteForce");
  const resultText = document.getElementById("result");
  const logoutButton = document.getElementById("logout");
  const insertContentButton = document.getElementById("insertContent")





  const getPosts = async () => {
    if (!sessionStorage.getItem("token")) {
      logoutButton.classList.add("hidden");
      req.log.error("Error: User has no valid token, unable to display logout button.");
      return;
    }
    feed.innerHTML = "";
    req.log.info("Fetching posts from the server.");
    const response = await fetch("/api/posts", {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    const posts = await response.json();
    req.log.debug("Displaying posts in the feed.");
    for (const post of posts) {
      const postElement = document.createElement("div");
      postElement.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
      `;
      feed.appendChild(postElement);
    }
  };
  getPosts();

  insertContentButton.addEventListener("click", async () => {
    req.log.info("Insert Content button clicked.");
    await insertDB(db, insertContent)
    
    
  })
  getPosts();


  const login = async (username, password) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(username)) {
      resultText.innerHTML = "Invalid E-Mail";
      req.log.error("Invalid email format");
      return;
    }
    if (!password || password.length < 10) {
      resultText.innerHTML = "Password must be at least 10 characters.";
      req.log.error("Password validation failed")
      return;
    }req.log.info("Attempting login");
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    req.log.info("Login request completed"); 
    const result = await response.text();
    if (!result) {
      req.log.error("Login failed");
      return;
    }
    sessionStorage.setItem("token", result);
    logoutButton.classList.remove("hidden");
    getPosts();
    req.log.info("Login successful");
  };

  loginButton.addEventListener("click", async () => {
    const username = usernameInput.value;
    const password = passwordInput.value;
    await login(username, password);
    req.log.info("Login button clicked");
  });

  bruteForceButton.addEventListener("click", async () => {
    const username = usernameInput.value;
    const password = passwordInput.value;
    req.log.info("Brute force button clicked");
    while (true) {
      await login(username, password);
    }
  });

  logoutButton.addEventListener("click", () => {
    req.log.info("Logout button clicked");
    sessionStorage.removeItem("token");
    location.reload();
  });
});
