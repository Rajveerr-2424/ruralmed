const express = require('express');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

const router = express.Router();

// Get chat messages between patient and doctor
router.get('/:appointmentId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      appointmentId: req.params.appointmentId
    })
    .populate('senderId', 'firstName lastName role')
    .sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message
router.post('/', auth, async (req, res) => {
  try {
    const { appointmentId, content, type = 'text' } = req.body;

    const message = new Message({
      appointmentId,
      senderId: req.user.userId,
      content,
      type,
      timestamp: new Date()
    });

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'firstName lastName role');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;