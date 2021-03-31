const client = require('mongodb').MongoClient;

export async function connect() {
    var connection = await client.connect(process.env.MONGODB_URI);
    return connection;
}