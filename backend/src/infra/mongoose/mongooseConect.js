const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

/**
 * Cache de conexão global para ser reutilizado entre as invocações de funções serverless.
 */
let cachedConnection = null;

async function connectDB() {
  try {
    // Para desenvolvimento local, usa o banco em memória.
    if (process.env.NODE_ENV === "development") {
      const mongod = await MongoMemoryServer.create();
      const mongoUri = mongod.getUri();
      await mongoose.connect(mongoUri);
      console.log("Conectado ao MongoDB em memória");
      return;
    }

    // Para produção (Vercel), reutiliza a conexão em cache.
    if (cachedConnection) {
      console.log("Usando conexão de banco de dados em cache.");
      return cachedConnection;
    }

    console.log("Criando uma nova conexão com o banco de dados.");
    cachedConnection = await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado ao MongoDB na nuvem (Vercel).");
    return cachedConnection;
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    process.exit(1); // Encerra o processo em caso de falha na conexão inicial
  }
}

module.exports = connectDB;
