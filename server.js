import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
// ...

//Components
import Connection from "./database/db.js";
import Router from "./routes/route.js";

dotenv.config();

const app = express();
app.use(express.json());

// app.use(cors());
// app.use(cors({origin: ['https://designdrop.onrender.com']}));
app.use(cors({origin:'*'}))
// {origin: ['http://localhost:8888', 'http://127.0.0.1:8888']}
// cors({origin: ['http://localhost:8888', 'http://127.0.0.1:8888']})


// HEADER
function headers (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', "*");

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
}

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use("/", Router);
app.use("/",Router);


const PORT = process.env.PORT || 8000;

const URL = process.env.MONGODB_URI || process.env.MY_MONGO_URI;

Connection(URL);

app.listen(PORT, () =>
  console.log(`Server is running successfully on PORT ${PORT}`)
);
