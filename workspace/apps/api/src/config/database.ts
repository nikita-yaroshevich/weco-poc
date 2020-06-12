const db = process.env.DATABASE_CONNECTION ? JSON.parse(process.env.DATABASE_CONNECTION) : {};
db.host = process.env.DATABASE_HOST || db.host;
db.port = process.env.DATABASE_PORT || db.port;
db.database = process.env.DATABASE_NAME || db.database;
db.username = process.env.DATABASE_USERNAME || db.username;
db.password = process.env.DATABASE_PASSWORD || db.password;
export default db;
