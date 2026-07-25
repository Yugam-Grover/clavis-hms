require("dotenv").config();
const app = require("./src/app");
require("./src/config/db");

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server is up and running on PORT:", PORT);
});
