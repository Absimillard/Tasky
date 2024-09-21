// Import dependencies
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { Server } = require("socket.io");
const http = require('http');
const connectDb = require("./config/connectDb");
const requireAuth = require("./middleware/requireAuth");
const dir = require('./middleware/mk_dir');
const fileUpload = require('./middleware/uploadImage');
const notificationSchema = require("./models/Notification");
const Notification = mongoose.model("Notification", notificationSchema);

(async () => {
  try {
    // Configuration
    if (process.env.NODE_ENV !== 'production') {
      require("dotenv").config();
    }

    // Initialize Express app
    const app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({ origin: true, credentials: true }));

    // Create HTTP server and socket.io instance
    const PORT = process.env.PORT || 3001;
    const server = http.createServer(app);
    const io = new Server(server, { cors: { origin: true, credentials: true } });

    // Middleware to authenticate socket connections
    io.use(async (socket, next) => {
      try {
        const token = socket.handshake.headers.authorization;

        if (!token || !token.startsWith('Bearer ')) {
          return next(new Error('Authentication error'));
        }

        const jwtToken = token.split(' ')[1];
        jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
          if (err) {
            return next(new Error('Authentication error'));
          }

          // Attach user info to the socket object
          socket.userId = decoded.sub;
          socket.privilege = decoded.privilege;
          next();
        });
      } catch (err) {
        next(new Error('Authentication error'));
      }
    });

    // Configure socket events
    const userSocketMap = new Map();
    const connectedSockets = new Map();

    io.on('connection', (socket) => {
      console.log('Client connected:', socket?.id);
      connectedSockets.set(socket?.id, socket);

      socket.on('auth', (userId) => {
        userSocketMap.set(userId, socket.id);
        io.emit('validAuth', userId);
        console.log(userSocketMap);
      });

      socket.on('createdUser', async (user) => {
        try {
          console.log(user);
          const adminUsers = await UserNotif.find({ privilege: { $in: ['admin', 'supAdmin'] } });
          const notification = new Notification({
            type: 'signup',
            object: 'users',
            content: {
              relatedId: user._id,
              message: `${user.name} has joined us!`,
            },
            read: {
              status: false,
              readAt: null,
            },
            createdAt: new Date()
          });

          // Update admin users with the new notification
          adminUsers.forEach(async (admin) => {
            await UserNotif.updateOne({ _id: admin._id }, { $push: { notifications: notification } });
          });

          console.log('User added');
          const relevantAdminUsers = adminUsers.map(admin => admin._id);
          const relevantUserIds = [];

          // Check each admin user ID against the userSocketMap
          relevantAdminUsers.forEach(adminId => {
            const stringAdminId = adminId.toString();
            if (userSocketMap.has(stringAdminId)) {
              relevantUserIds.push(stringAdminId);
            }
          });

          // Emit notification only to relevant users
          relevantUserIds.forEach(userId => {
            const socketId = userSocketMap.get(userId);
            if (socketId) {
              io.to(socketId).emit('incomingNotification');
            }
          });
        } catch (err) {
          console.error(err);
        }
      });

      socket.on('updatedProject', async (project, id, name) => {
        try {
          const updatedProject = await Project.findById(id).select('title participants guests');
          const participants = updatedProject.participants;
          const guests = updatedProject.guests;

          const notification = new Notification({
            type: 'update',
            object: 'projects',
            content: {
              relatedId: id,
              message: `${updatedProject.title} has been updated by ${name}!`,
            },
            read: {
              status: false,
              readAt: null,
            },
            dismissed: false,
            createdAt: new Date()
          });

          const relevantUserIds = participants.map(p => p._id);

          // Emit notification only to relevant users
          relevantUserIds.forEach(userId => {
            const socketId = userSocketMap.get(userId);
            if (socketId) {
              io.to(socketId).emit('incomingNotification', notification);
            }
          });

          participants.forEach(async (p) => {
            await UserNotif.updateOne({ _id: p.userID }, { $push: { notifications: notification } });
          });
        } catch (err) {
          console.error(err);
        }
      });

      socket.on('createdProject', async (project, id, name) => {
        try {
          const createdProject = await Project.findById(id).select('title participants guests');
          const participants = createdProject.participants;
          const guests = createdProject.guests;

          const notification = new Notification({
            type: 'update',
            object: 'projects',
            content: {
              relatedId: id,
              message: `${createdProject.title} has been created by ${name}!`,
            },
            read: {
              status: false,
              readAt: null,
            },
            dismissed: false,
            createdAt: new Date()
          });

          const relevantUserIds = participants.map(p => p._id);

          // Emit notification only to relevant users
          relevantUserIds.forEach(userId => {
            const socketId = userSocketMap.get(userId);
            if (socketId) {
              io.to(socketId).emit('incomingNotification', notification);
            }
          });

          participants.forEach(async (p) => {
            await UserNotif.updateOne({ _id: p._id }, { $push: { notifications: notification } });
          });
        } catch (err) {
          console.error(err);
        }
      });

      // Handle disconnections
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        userSocketMap.forEach((value, key) => {
          if (value === socket.id) {
            userSocketMap.delete(key);
          }
        });
      });
    });

    // Database connection and configuration
    const { User, Project, UserNotif, PrefUserNotif, DeletedProjects, DeletedUsers } = await connectDb();

    // CHANGE STREAMS
    const usersStream = User.watch();
    const projectsStream = Project.watch();

    usersStream.on('change', async (change) => {
      if (change.operationType === 'insert') {
        const newUser = change.fullDocument;
        try {
          const userNotif = new UserNotif({
            _id: newUser._id,
            name: newUser.name,
            privilege: newUser.privilege,
            notifications: [],
          });
          userNotif.save();
          const userNotifPref = new PrefUserNotif({
            _id: newUser._id,
            name: newUser.name,
            privilege: newUser.privilege,
            notifications: [],
          });
          userNotifPref.save();
        } catch (error) {
          console.error('Error inserting User notifications pool:', error);
        }
      } else if (change.operationType === 'update') {
        // Handle update operation
      } else if (change.operationType === 'delete') {
        try {
          await PrefUserNotif.findOneAndDelete({ _id: change.documentKey._id });
          await UserNotif.findOneAndDelete({ _id: change.documentKey._id });
        } catch (error) {
          console.error('Error deleting User notifications pool:', error);
        }
      }
    });

    projectsStream.on('change', async (change) => {
      if (change.operationType === 'insert') {
        const newProject = change.fullDocument;
        const team = newProject.participants;
        const notification = new Notification({
          type: 'project',
          message: `A project has been created!`,
          createdAt: new Date()
        });
        team.forEach(async (t) => {
          await UserNotif.findOneAndUpdate(
            { _id: t._id },
            { $push: { notifications: notification } },
            { new: true, runValidators: true }
          );
        });
        try {
          // Additional operations
        } catch (error) {
          console.error('Error inserting notification:', error);
        }
      } else if (change.operationType === 'update') {
        // Handle update operation
      } else if (change.operationType === 'delete') {
        try {
          const oldProject = change.fullDocument;
          const team = oldProject.participants;
          const notification = new Notification({
            type: 'project',
            message: `A project has been deleted!`,
            createdAt: new Date()
          });
          team.forEach(async (t) => {
            await UserNotif.findOneAndUpdate(
              { _id: t._id },
              { $push: { notifications: notification } },
              { new: true, runValidators: true }
            );
          });
        } catch (error) {
          console.error('Error inserting notification:', error);
        }
      }
    });

    // ROUTING
    app.get("/", (req, res) => res.json({ hello: "Visitor" }));
    app.post('/signup', (req, res) => userController.createUser(req, res, io, User));
    app.post('/login', (req, res) => authController.logIn(req, res, io, User));
    app.get('/check-auth', (req, res) => refreshAuthController.checkAuth(req, res, io, User));
    app.get('/logout', (req, res) => authController.logOut(req, res, User));
    app.use(requireAuth);
    app.get("/notifications/:id", (req, res) => notifController.fetchNotifications(req, res, io, UserNotif));
    app.get("/notifications/:id/:notifId", (req, res) => notifController.fetchNotification(req, res, io, UserNotif));
    app.put("/notifications/:id", (req, res) => notifController.updateAllNotifications(req, res, UserNotif));
    app.patch("/notifications/:id/:notifId", (req, res) => notifController.updateNotification(req, res, io, UserNotif));
    app.delete("/notifications/:id/:notifId", (req, res) => notifController.updateNotification(req, res, io, UserNotif));
    app.post('/upload', dir, fileUpload.Upload);
    app.get("/users", (req, res) => userController.fetchUsers(req, res, io, User, Project));
    app.get("/users/:id", (req, res) => userController.fetchUser(req, res, io, User));
    app.post('/users', (req, res) => userController.createUser(req, res, io, User));
    app.put('/users/:id', (req, res) => userController.updateUser(req, res, io, User));
    app.delete('/users/:id', (req, res) => userController.deleteUser(req, res, io, User, DeletedUsers));
    app.get("/projects", (req, res) => projectController.fetchProjects(req, res, io, Project, User));
    app.get("/projects/:id", (req, res) => projectController.fetchProject(req, res, io, Project));
    app.get("/projects/user/:id", (req, res) => projectController.fetchUserProjects(req, res, io, Project, User));
    app.post('/projects', (req, res) => projectController.createProject(req, res, io, Project, User));
    app.put('/projects/:id', (req, res) => projectController.updateProject(req, res, io, Project));
    app.delete('/projects/:id', (req, res) => projectController.deleteProject(req, res, io, Project, DeletedProjects));
    
    // Start server
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('Server shutting down...');
      
      // Disconnect all connected sockets
      connectedSockets.forEach((socket) => {
        socket.disconnect(true); // Pass true to indicate a server-initiated disconnect
      });

      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Error connecting to databases:', error);
    process.exit(1); // Exit the process if there's an error connecting to databases
  }
})();
