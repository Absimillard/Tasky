const mongoose = require("mongoose");
const userSchema = require("../models/User");
const projectSchema = require("../models/Project");
const notifUserSchema = require("../models/NotifUser");
const PrefNotifUserSchema = require("../models/PrefNotifUser");


async function connectDb() {
    try {
        // Connection URI for your MongoDB cluster
        const notifUri = process.env.NOTIFICATION_DB_URL;
        const testUri = process.env.TEST_DB_URL;
        const deletedUri = process.env.DELETED_DB_URL;
        // Connect to the MongoDB databases
        const testDb = await mongoose.createConnection(testUri).asPromise();
        const notificationDb = await mongoose.createConnection(notifUri).asPromise();
        const deletedDb = await mongoose.createConnection(deletedUri).asPromise();
        // Define the models for the databases
        const User = testDb.model("users", userSchema);
        const Project = testDb.model("projects", projectSchema);
        const DeletedUsers = deletedDb.model("users", userSchema);
        const DeletedProjects = deletedDb.model("projects", projectSchema);
        const UserNotif = notificationDb.model("users", notifUserSchema);
        const PrefUserNotif = notificationDb.model("usersPref", PrefNotifUserSchema);
        console.log("Databases connected");
        return { User, Project, UserNotif, PrefUserNotif, DeletedProjects, DeletedUsers };
    } catch(err) {
        console.error(err);
        throw new Error("Error connecting to databases");
    }
}

module.exports = connectDb;