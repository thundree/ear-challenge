const NODE_ENV = process.env.NODE_ENV || "development";
require("dotenv").config({ path: `.env.${NODE_ENV}` });

// Opções de configuração do MongoDB
export const mongoOptions = {
  maxPoolSize: 10, // Limitar o número máximo de sockets abertos
  minPoolSize: 2, // Número mínimo de sockets a serem mantidos abertos
  socketTimeoutMS: 45000, // Tempo limite para inatividade do socket
  serverSelectionTimeoutMS: 5000, // Tempo limite para seleção de servidor
  heartbeatFrequencyMS: 10000, // Frequência dos heartbeats
};

const MONGO_INITDB_ROOT_USERNAME = process.env.MONGO_INITDB_ROOT_USERNAME;
const MONGO_INITDB_ROOT_PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD;
const MONGO_DATABASE = process.env.MONGO_DATABASE;
const MONGO_CONTAINER = process.env.MONGO_CONTAINER;

if (
  !MONGO_INITDB_ROOT_USERNAME ||
  !MONGO_INITDB_ROOT_PASSWORD ||
  !MONGO_DATABASE
) {
  console.error("MongoDB username, password, or database not provided");
  process.exit(1);
}

// URL do MongoDB com base no ambiente
const MONGO_HOST = NODE_ENV === "development" ? "localhost" : MONGO_CONTAINER;
export const mongoUri = `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${MONGO_HOST}:27017/${MONGO_DATABASE}?authSource=admin`;
