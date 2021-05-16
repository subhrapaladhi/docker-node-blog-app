const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
const cors = require("cors");
const config = require("./config/config");

let RedisStore = require("connect-redis")(session);
let redisClient = redis.createClient({
  host: config.REDIS_URL,
  port: config.REDIS_PORT,
});

const port = process.env.PORT || 3000;
const mongoURL = `mongodb://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_IP}:${config.MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  mongoose
    .connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      console.log("successfully connected to DB");
    })
    .catch((e) => {
      console.log(e);
      setTimeout(connectWithRetry, 5000);
    });
};
connectWithRetry();

app.enable("trust proxy");
app.use(cors());
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    name: "tempcookieID",
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 60000,
      httpOnly: true,
    },
  })
);
app.use(express.json());

const postRouter = require("./routes/postRoute");
const userRouter = require("./routes/userRoute");

app.get("/api/v1", (req, res) => {
  res.send("<h2>Hi There!!</h2>");
  console.log("server pinged");
});

app.use("/api/v1/posts", postRouter);

app.use("/api/v1/users", userRouter);

app.listen(port, () => console.log(`Listening on port ${port}`));
