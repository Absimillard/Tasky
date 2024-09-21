// socketMiddleware.js

const socketMiddleware = (socketClient) => (storeAPI) => (next) => (action) => {
  try {
    // Handle functions dispatched as actions
    if (typeof action === 'function') {
      return action(storeAPI.dispatch, storeAPI.getState, socketClient);
    }

    // Handle actions with socket-related payloads
    const { meta, payload } = action;
    if (meta && meta.emit) {
      const { event, data, callback } = payload;
      socketClient.emit(event, data)
        .then((response) => {
          if (callback) {
            callback(response);
          }
        })
        .catch((error) => {
          console.error('Socket emit error:', error);
        });
    } else if (meta && meta.listen) {
      const { event, handler } = payload;
      socketClient.on(event, (data) => {
        // Dispatch an action to handle the received data
        console.log(event, handler, data)
        storeAPI.dispatch(handler(data));
      }).catch((error) => {
        console.error('Socket listen error:', error);
      });
    }

    // Pass the action through to the next middleware
    return next(action);
  } catch (err) {
    console.log('Unknown error', err);
  }
};

export default socketMiddleware;
