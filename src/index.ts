import express from "express";

import { systemConfig } from "./config/system.config";

const app = express();
const port = systemConfig.PORT;

app.listen(port, () => {
  console.log(`Blog API listening on port ${port.toString()}`);
});