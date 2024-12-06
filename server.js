const mongoose = require("mongoose");
const app = require("./app");
const { PORT } = require("./config");

// Connect to MongoDB
mongoose
  .connect(process.env.URI)
  .then(() => console.log("Database connected successfully"))
  .catch((error) =>
    console.error(
      "Something went wrong while connecting to database: " + error,
    ),
  );

// Start the server
app.listen(PORT, function () {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);
});
