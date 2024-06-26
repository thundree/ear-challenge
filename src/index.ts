import express, { Request, Response } from "express";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import session, { SessionData } from "express-session";
import User from "./models/User";
import { mongoOptions, mongoUri } from "./config";

type RequestAuth = Request & {
  session: SessionData & {
    sessionId?: number | string;
    successMessage?: string;
  };
};

// Função para validar email
const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Conectar ao MongoDB
mongoose
  .connect(mongoUri, mongoOptions)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

const app = express();

// Configurar a engine de visualização Pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Middleware para parsear dados do corpo das requisições
app.use(express.urlencoded({ extended: true }));

// Middleware de sessão
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Para desenvolvimento; em produção, use secure: true
  })
);

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rota para a página inicial
app.get("/", (_req: Request, res: Response) => {
  res.render("home");
});

// Rota básica para o login
app.get("/login", (req: RequestAuth, res: Response) => {
  const successMessage = req.session.successMessage;
  req.session.successMessage = undefined; // Clear the message after displaying
  res.render("login", { error: null, successMessage });
});

// Rota para processar o login
app.post("/login", async (req: RequestAuth, res: Response) => {
  const { username, password } = req.body;

  // Validação básica
  if (!username || !password) {
    return res.render("login", {
      error: "All fields are required",
      successMessage: null,
    });
  }

  try {
    // Buscar o usuário no banco de dados
    const user = await User.findOne({ username });
    if (!user) {
      return res.render("login", {
        error: "Incorrect username or password",
        successMessage: null,
      });
    }

    // Verificar a senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("login", {
        error: "Incorrect username or password",
        successMessage: null,
      });
    }

    // Salvar usuário na sessão
    req.session.sessionId = `${user._id}`;

    // Redirecionar para a página da conta
    res.redirect("/my-account");
  } catch (error) {
    console.error(error);
    res.render("login", {
      error: "Server error. Please try again later.",
      successMessage: null,
    });
  }
});

// Rota para a página de registro
app.get("/register", (_req: Request, res: Response) => {
  res.render("register", { error: null });
});

// Rota para processar o registro
app.post("/register", async (req: RequestAuth, res: Response) => {
  const { username, password } = req.body;

  // Validação básica
  if (!username || !password) {
    return res.render("register", { error: "All fields are required" });
  }

  // Validar email
  if (!validateEmail(username)) {
    return res.render("register", { error: "Invalid email address" });
  }

  try {
    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar o usuário
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // Definir mensagem de sucesso na sessão
    req.session.successMessage = "Account created successfully. Please log in.";

    // Redirecionar para a página de login
    res.redirect("/login");
  } catch (error: any) {
    console.error(error);
    if (error.code === 11000) {
      return res.render("register", { error: "Email is already registered" });
    }

    res.render("register", { error: "Server error. Please try again later." });
  }
});

// Middleware para verificar a autenticação do usuário
function checkAuth(req: RequestAuth, res: Response, next: Function) {
  if (!req.session.sessionId) {
    return res.redirect("/login");
  }
  next();
}

// Rota para a página da conta do usuário
app.get("/my-account", checkAuth, async (req: RequestAuth, res: Response) => {
  try {
    const user = await User.findById(req.session.sessionId);
    if (!user) {
      return res.redirect("/login");
    }

    res.render("account", { username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Rota para logout
app.get("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    res.redirect("/login");
  });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
