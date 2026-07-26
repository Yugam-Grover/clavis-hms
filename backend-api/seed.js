require("dotenv").config();
require("./src/config/db");
const User = require("./src/models/user");

const seedAdmin = async () => {
  try {
    await User.create({
      fullName: "Admin User",
      email: "admin@Clavis.com",
      password: "admin1234",
      role: "admin",
    });

    console.log("✅ Admin seeded successfully");
    console.log("Email: admin@Clavis.com");
    console.log("Password: admin1234");
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
  }
};

seedAdmin();
