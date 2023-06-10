import http from "http";
import express, { Express } from "express";
import routes from "./routes/devices";
import actionRoutes from "./routes/actions";
import storage from "node-persist";
import { Device, LocalStorageVariables } from "./types";

const app: Express = express();
storage.init().then(() => {
  /** INIT Device list data */
  storage.setItem(
    LocalStorageVariables.Devices,
    JSON.stringify([
      {
        deviceId: "1",
        deviceName: "GarageDoor",
        status: false,
      },
      {
        deviceId: "2",
        deviceName: "DishWasher",
        status: false,
      },
      {
        deviceId: "3",
        deviceName: "BedRoomLight",
        status: false,
      },
    ] as Device[])
  );
  storage.setItem(LocalStorageVariables.UserActions, JSON.stringify([]));
});

/** Parse the request */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  // set the CORS policy
  res.header("Access-Control-Allow-Origin", "*");
  // set the CORS headers
  res.header(
    "Access-Control-Allow-Headers",
    "origin, X-Requested-With,Content-Type,Accept, Authorization"
  );
  // set the CORS method headers
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST");
    return res.status(200).json({});
  }
  next();
});

/** Routes */
app.use("/devices", routes);
app.use("/actions", actionRoutes);

/** Error handling */
app.use((req, res, next) => {
  const error = new Error("not found");
  return res.status(404).json({
    message: error.message,
  });
});

/** Server */
const httpServer = http.createServer(app);
const PORT: any = process.env.PORT ?? 6060;
httpServer.listen(PORT, () =>
  console.log(`The server is running on port ${PORT}`)
);
