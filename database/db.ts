import mongoose, { Connection } from 'mongoose';
let MDB: Connection | null = null;

export const connectDB = async (): Promise<Connection> => {

  const userName = process.env.MONGO_USERNAME
  const password = process.env.MONGO_PASSWORD
  const dbName = process.env.MONGO_DB_NAME

  if (MDB) {
    return MDB;
  }

  let connectionUrl = "mongodb+srv://ShubhamSP:" + password + "@cluster0.teccyhd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  // connectionUrl = "mongodb+srv://ShubhamSP:VsXLbJWnoxyWA5pa@cluster0.teccyhd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  connectionUrl = `mongodb://localhost:27017/${dbName}`
  try {

    const db = await mongoose.connect(connectionUrl);
    MDB = db.connection;
    console.log('********************************************* Connected to MongoDB *********************************************')

  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};

export const getDb = (): Connection => {
  if (!MDB) {
    throw new Error('MongoDB connection not established');
  }
  return MDB;
};