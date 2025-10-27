import express from "express";

import { systemConfig } from "./config/system.config";
import { connect } from "./prisma/client";

const app = express();
const port = systemConfig.PORT;

async function startServer() {
  try {
    await connect();
    app.listen(port, () => {
      console.log(` Blog API listening on port ${port.toString()}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

void startServer();