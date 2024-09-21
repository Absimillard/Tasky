
const fetchNotifications = async(req, res, io, UserNotif) => {
    try {
    const userId = req.params.id;
    const user = await UserNotif.findOne({_id: userId});
    const notifications = user.notifications;
    res.json({notifications});
    
    io.emit('notifsData', notifications);
    } catch(err){
       return res.sendStatus(404);
    }
}
const fetchNotification = async(req, res, io, UserNotif) => {
    try {
    const notifId = req.params.notifId;
    const userId = req.params.id;
    const result = await UserNotif.findOne(
        { "notifications._id": notifId }
    );
    console.log(result)
    io.emit('notifData', result);
    res.json({result});
    } catch(err){
       return res.sendStatus(404);
    }
}
const updateAllNotifications = async(req, res, io, UserNotif) => {
    try {
    const userId = req.params.id;
    const user = await UserNotif.findOneAndUpdate(
        {_id: userId},
        {$set: {"notifications.$[el].read.status": true } }
      );
    const notifications = user.notifications;
    res.json({notifications});
    io.emit('markAllAsRead', notifications);
    } catch(err){
       return res.sendStatus(404);
    }
}
const updateNotification = async (req, res, io, UserNotif) => {
    try {
        console.log(req)
        const notifId = req.params.notifId;
        const userId = req.params.id;
        // Extract the fields to be updated from the request body
        const { status } = req.body;
        // Update the status of the notification
        const newNotif = await UserNotif.findByIdAndUpdate(
            userId,
            { "notifications.$[elem].read.status": true },
            { arrayFilters: [{ "elem._id": notifId }], new: true });
        // Check if result is null or undefined
        
        io.emit('markAsRead', newNotif);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Internal server error
    }
};







module.exports= function() {
    return{
        fetchNotifications,
        fetchNotification,
        updateNotification,
        updateAllNotifications,
  };
  }