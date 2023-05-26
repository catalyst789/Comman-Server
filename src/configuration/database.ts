import mongoose from "mongoose";
import { config } from "../config";

mongoose
  .connect(config.mongoDBURL)
  .then(() => {
    console.log("MONGODB CONFIGURED");
  })
  .catch((error) => {
    console.log("ERROR CONFIGURING MONGOOSE: ", error);
  });
