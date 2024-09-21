const bcrypt = require('bcryptjs');
const moment = require('moment');

const fetchUsers = async (req, res, io, User, Project) => {
    const users = await User.find()
    //    .populate({
    //    path: 'ongoing.projectID',  // Path to the projectID field within the ongoing array
    //    select: 'title createdBy createdAt participants', // Replace with the fields you want to include
    //    model: Project               // Explicitly specifying the model if necessary
    //    })
    ;
    io.emit('usersData', users);
    res.json({users}); 
};
const fetchUser = async (req, res, io, User) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        // Convert the timestamps to the desired format
        const registerDate = moment(user.registerDate).format('DD/MM/YYYY');
        const createdAt = moment(user.createdAt).format('DD/MM/YYYY');
        const updatedAt = moment(user.updatedAt).format('DD/MM/YYYY');
        // Return the user object with the formatted timestamps
        res.json({ user: {
            ...user.toObject(),
            registerDate,
            createdAt,
            updatedAt
        }});
        
    io.emit('userData', user);
    } catch(err){
        return res.sendStatus(404);
    }
};
const createUser = async (req, res, io, User) => {
    try {
        // Get sent-in data from the request body
        const { avatar, name, email, password, affiliate, occupation, contact, status, privilege, address, city, zipcode } = req.body;
        const regDate = Date.now();
        const hash = bcrypt.hashSync(password, 8);
        // Create a new User object using the User model and the testDb connection
        const user = new User({
            avatar,
            name,
            email,
            password: hash,
            refreshToken: null,
            status,
            contact,
            address,
            city,
            zipcode,
            occupation,
            affiliate,
            privilege,
            registerDate: regDate,
            lastSeen: null,
        });
        // Save the new user to the database
        await user.save();
        const newUser = await User.findOne(email).select('_id');
        res.json({ newUser });
    } catch(err) {
        console.error(err);
        return res.sendStatus(403);
    }
};
const updateUser = async (req, res, io, User) => {
    try {
        const userId = req.params.id;
        const { avatar, name, email, city, zipcode, password, affiliate, occupation, status, privilege } = req.body;
        const hash = bcrypt.hashSync(password, 8);
        await User.findByIdAndUpdate(userId, {
            avatar,
            name,
            email,
            password: hash,
            occupation,
            city,
            zipcode,
            status,
            affiliate,
            privilege,
        });
        const user = await User.findById(userId);
        res.json({ user });

    } catch(err) {
      return res.sendStatus(403);
    }
};
const deleteUser = async (req, res, io, User, DeletedUsers, mongoose) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const userId = req.params.id;
  
      // Find the user to delete
      const userToDelete = await User.findById(userId).session(session);
  
      if (!userToDelete) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ error: "User not found" });
      }
  
      // Copy the user to the DeletedUsers collection with the original _id
      const deletedUser = new DeletedUsers({
        userId: userToDelete._id, // Original user ID
        name: userToDelete.name,
        email: userToDelete.email,
        avatar: userToDelete.avatar,
        occupation: userToDelete.occupation,
        contact: userToDelete.contact,
        affiliate: userToDelete.affiliate,
        status: userToDelete.status,
        privilege: userToDelete.privilege,
        registerDate: userToDelete.registerDate,
        lastSeen: userToDelete.lastSeen,
        deletedAt: new Date(), // Timestamp for deletion
      });
  
      await deletedUser.save({ session });
  
      // Delete the user from the User collection
      await User.deleteOne({ _id: userId }, { session });
  
      // Commit the transaction
      await session.commitTransaction();
      session.endSession();
  
      // Emit an event to notify connected clients about the deleted user
      io.emit('deleteUser', userId);
  
      res.json({ success: "User deleted and archived" });
    } catch (error) {
      // Abort the transaction and undo any changes
      await session.abortTransaction();
      session.endSession();
  
      console.error('Error deleting user:', error);
      res.status(500).json({ success: false, message: 'Error deleting user' });
    } finally {
        
    }
  };
  

module.exports= function() {
    return {
        fetchUsers,
        fetchUser,        
        createUser,
        updateUser,
        deleteUser,
    };
};