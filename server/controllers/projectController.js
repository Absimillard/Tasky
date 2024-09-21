const mongoose = require('mongoose');

const fetchProjects = async (req, res, io, Project, User) => {
    try {
    const projects = await Project.find().populate({path:'createdBy', model: User}).populate({path:'participants._id', model: User});
    
    io.emit('projectsData', projects);
    res.json({projects}); // ({ projects: projects }) equal ({ projects })
    } catch(err) {
        return res.sendStatus(404);
    }
}

const fetchUserProjects = async (req, res, Project) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    // Ensure userId is valid (assuming MongoDB ObjectId)
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    // Find all projects where the userId appears in the participants._id array
    const userProjects = await Project.find({ 'participants._id': userId });

    // Check if any projects were found
    if (!userProjects || userProjects.length === 0) {
      return res.status(404).json({ error: 'No projects found for this user' });
    }

    // Send the projects data back to the client
    res.json({ userProjects });
  } catch (err) {
    console.error('Error fetching user projects:', err);
    return res.status(500).json({ error: 'An error occurred while fetching the projects' });
  }
};

const fetchProject = async (req, res, Project) => {
    try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    res.json({project});
    } catch(err){
       return res.sendStatus(404);
    }
}

const createProject = async (req, res, io, Project, User) => {
  // Start a session using the mongoose connection
  const session = await Project.startSession();
  try {
    session.startTransaction();

    // Extract data from the request body
    const { title, createdBy, createdAt, participants, guests, deadline, brief } = req.body;

    // Create the project document within the transaction
    const project = await Project.create([{
      title,
      brief,
      createdBy,
      createdAt,
      participants,
      guests,
      deadline,
    }], { session });

    const projectId = project[0]._id; // Since Project.create returns an array

    // Update each participant's 'ongoings' array
    for (const participant of participants) {
      const userId = participant._id;

      // Update the user's ongoing projects within the transaction session
      await User.findByIdAndUpdate(userId, {
        $push: { ongoing: { _id: projectId } },
      }, { session });

      // Emit a notification event to the client
      io.emit(`notification:${userId}`, {
        type: 'project_create',
        projectId: projectId,
        message: `${project[0].title} has been created`,
      });
    }

    // Commit the transaction
    await session.commitTransaction();

    // Respond with the newly created project
    return res.json({ project: project[0] });

  } catch (err) {
    console.error('Transaction failed:', err);

    // If there's an error, abort the transaction
    await session.abortTransaction();

    if (err.code === 11000) {
      return res.status(409).send({ message: 'Project already exists.' });
    } else {
      return res.status(500).send({ message: 'Internal server error.' });
    }
  } finally {
    // End the session
    session.endSession();
  }
};

const updateProject = async (req, res, io, Project, User, mongoose) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const projectId = req.headers['project-id'];
    const updatedFields = req.body;

    // Update the project within the transaction session
    const updatedProject = await Project.findByIdAndUpdate(projectId, updatedFields, { new: true, session });

    if (!updatedProject) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Project not found" });
    }

    // If participants were updated, update their `ongoings` arrays
    if (updatedFields.participants) {
      const participantIds = updatedFields.participants.map(participant => participant._id);

      // Update the `ongoings` array for each participant
      await Promise.all(
        participantIds.map(async userId => {
          await User.findByIdAndUpdate(userId, {
            $addToSet: { ongoings: { projectID: projectId } }, // Using addToSet to avoid duplicates
          }, { session });

          // Emit a notification event to the client
          io.emit(`notification:${userId}`, {
            type: 'project_update',
            projectId: projectId,
            message: `Project ${updatedProject.title} has been updated`,
          });
        })
      );
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Respond with the updated project data
    res.json({ project: updatedProject });
  } catch (err) {
    // Abort the transaction and undo any changes
    await session.abortTransaction();
    session.endSession();

    console.error('Error updating project:', err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteProject = async (req, res, io, Project, mongoose, DeletedProjects) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const projectId = req.params.id;

    // Find the project to delete
    const projectToDelete = await Project.findById(projectId).session(session);

    if (!projectToDelete) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Project not found" });
    }

    const participantIds = projectToDelete.participants.map(participant => participant._id);

    // Copy the project to the DeletedProjects collection with the original _id
    const deletedProject = new DeletedProjects({
      projectId: projectToDelete._id,  // Keep original project ID
      title: projectToDelete.title,
      brief: projectToDelete.brief,
      createdBy: projectToDelete.createdBy,
      createdAt: projectToDelete.createdAt,
      participants: projectToDelete.participants,
      guests: projectToDelete.guests,
      deadline: projectToDelete.deadline,
      deletedAt: new Date(),  // Timestamp for deletion
    });

    await deletedProject.save({ session });

    // Remove the project from the `ongoings` array of each participant
    await Promise.all(
      participantIds.map(async userId => {
        await User.findByIdAndUpdate(userId, {
          $pull: { ongoings: { projectID: projectId } }, // Remove project from ongoings
        }, { session });

        // Emit a notification event to the client
        io.emit(`notification:${userId}`, {
          type: 'project_delete',
          projectId: projectId,
          message: `Project ${projectToDelete.title} has been deleted and archived`,
        });
      })
    );

    // Delete the project from the original collection
    await Project.deleteOne({ _id: projectId }, { session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    io.emit('deleteProject', projectId);
    res.json({ success: "Project deleted and archived" });
  } catch (err) {
    // Abort the transaction and undo any changes
    await session.abortTransaction();
    session.endSession();

    console.error('Error deleting project:', err);
    return res.status(500).json({ error: "Internal server error" });
  }
};



module.exports= function() {
  return{
    fetchProjects,
    fetchUserProjects,
    fetchProject,      
    createProject,
    updateProject,
    deleteProject,
};
}