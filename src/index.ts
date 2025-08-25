import express from 'express';
import dotenv from "dotenv";
import "reflect-metadata";
import cors from "cors";
import bodyParser from "body-parser";
import {AppDataSource} from "../database/typeorm.js";
import Login from "./Routes/Login"
import Users from "./Routes/Users"
import FIles from "./Routes/Files"


dotenv.config();
const app = express();

app.use("/Login",Login);
app.use("/Users",Users);
app.use("/Files",FIles);


// database initializer
(async () => {
  try {
    await AppDataSource.initialize();
    console.log("[+] Conectado a la base de datos SQL");
  } catch (error) {
    console.error("Error unu ",error);
    
  }
})();

const corsOptions = {
  origin: ["https://app.aboutadev.online:8443"],
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "user-agent",
    "api-key",
    "x-hub-signature-256",
  ],
  credentials: true,
};

const PORT = 3000;

// Middleware para leer JSON
app.use(express.json());

//Uso de cors
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.text());


// Ruta principal
app.get('/', (req, res) => {
  res.send('Bienvenido ya modificaste esto xd');
});

// Otra ruta de ejemplo
app.get('/saludo/:nombre', (req, res) => {
  const { nombre } = req.params;
  res.send(`Hola, ${nombre}!`);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
