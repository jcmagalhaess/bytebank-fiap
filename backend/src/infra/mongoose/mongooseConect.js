const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

async function connectDB() {
  try {
    if (process.env.NODE_ENV === "development") {
      // Iniciar MongoDB em memória para desenvolvimento
      const mongod = await MongoMemoryServer.create();
      const mongoUri = mongod.getUri();
      await mongoose.connect(mongoUri);
      console.log("Conectado ao MongoDB em memória");
    } else {
      // Conectar ao MongoDB real em produção
      await mongoose.connect(
        "mongodb+srv://bytebank-fiap:q8l3VKdIXvWvUYmU@cluster0.gylk9nh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
      );
      console.log("Conectado ao MongoDB");
    }
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
  }
}

module.exports = connectDB;
