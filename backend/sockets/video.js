module.exports = (io) => {
  const videoNamespace = io.of('/video');
  
  videoNamespace.on('connection', (socket) => {
    console.log('User connected to video:', socket.id);

    // Join video call room
    socket.on('join_call', (data) => {
      const { appointmentId, userId, role } = data;
      socket.join(`call_${appointmentId}`);
      
      // Notify other participants
      socket.to(`call_${appointmentId}`).emit('user_joined', {
        userId,
        role,
        socketId: socket.id
      });
      
      console.log(`User ${userId} (${role}) joined video call ${appointmentId}`);
    });

    // Handle WebRTC signaling
    socket.on('offer', (data) => {
      socket.to(`call_${data.appointmentId}`).emit('offer', data);
    });

    socket.on('answer', (data) => {
      socket.to(`call_${data.appointmentId}`).emit('answer', data);
    });

    socket.on('ice_candidate', (data) => {
      socket.to(`call_${data.appointmentId}`).emit('ice_candidate', data);
    });

    // Handle call events
    socket.on('start_call', (data) => {
      socket.to(`call_${data.appointmentId}`).emit('call_started', data);
    });

    socket.on('end_call', (data) => {
      socket.to(`call_${data.appointmentId}`).emit('call_ended', data);
    });

    socket.on('toggle_video', (data) => {
      socket.to(`call_${data.appointmentId}`).emit('video_toggled', data);
    });

    socket.on('toggle_audio', (data) => {
      socket.to(`call_${data.appointmentId}`).emit('audio_toggled', data);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected from video:', socket.id);
    });
  });
};