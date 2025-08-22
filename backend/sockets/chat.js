module.exports = (io) => {
  const chatNamespace = io.of('/chat');
  
  chatNamespace.on('connection', (socket) => {
    console.log('User connected to chat:', socket.id);

    // Join appointment room
    socket.on('join_appointment', (appointmentId) => {
      socket.join(`appointment_${appointmentId}`);
      console.log(`User ${socket.id} joined appointment ${appointmentId}`);
    });

    // Handle new message
    socket.on('send_message', (data) => {
      const { appointmentId, message, senderId, senderName } = data;
      
      // Broadcast message to all users in the appointment room
      chatNamespace.to(`appointment_${appointmentId}`).emit('new_message', {
        appointmentId,
        message,
        senderId,
        senderName,
        timestamp: new Date(),
        id: Date.now() // Simple ID generation
      });
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      socket.to(`appointment_${data.appointmentId}`).emit('user_typing', {
        userId: data.userId,
        userName: data.userName
      });
    });

    socket.on('typing_stop', (data) => {
      socket.to(`appointment_${data.appointmentId}`).emit('user_stopped_typing', {
        userId: data.userId
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected from chat:', socket.id);
    });
  });
};