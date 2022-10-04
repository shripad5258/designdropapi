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
app.use(cors({origin: '*'}))
// {origin: ['http://localhost:8888', 'http://127.0.0.1:8888']}
// cors({origin: ['http://localhost:8888', 'http://127.0.0.1:8888']})

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", Router);
const PORT = process.env.PORT || 8000;

const URL = process.env.MONGODB_URI || process.env.MY_MONGO_URI;

Connection(URL);

app.listen(PORT, () =>
  console.log(`Server is running successfully on PORT ${PORT}`)
);
