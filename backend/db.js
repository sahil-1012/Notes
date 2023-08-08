const mongoose = require('mongoose');
const mongoURI = 'mongodb://127.0.0.1:27017/inotebook?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.0';


async function connectToMongo() {
  await mongoose.connect(mongoURI);
  console.log('Connected to MongoDB Successfully');
  // const adminDb = mongoose.connection.db.admin();
  // const databases = await adminDb.listDatabases();
  // console.log(databases);
}

// connectToMongo().catch((err) => console.log(err));
module.exports = connectToMongo;
