import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User";
import { mongoOptions, mongoUri } from "../config";

mongoose
  .connect(mongoUri, mongoOptions)
  .then(async () => {
    const username = "testuser";
    const password = "testpassword";

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar o usuário
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    console.log("Usuário criado com sucesso");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Erro ao conectar ao MongoDB", err);
    mongoose.connection.close();
  });
