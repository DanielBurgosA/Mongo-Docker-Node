// Create user
dbAdmin = db.getSiblingDB("admin");

// Create DB and collection
db = new Mongo().getDB("mock-databe");
db.createCollection("users", { capped: false });