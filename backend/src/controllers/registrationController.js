const Registration = require("../models/Registration");
const Event = require("../models/Event");

// @desc Register user to event
// @route POST /api/registrations/:eventId
// @access Private
const registerToEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user._id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // Try to create registration
    const registration = await Registration.create({
      user: userId,
      event: eventId,
    });

    res.status(201).json({
      message: "Successfully registered to event",
      registration,
    });
  } catch (error) {
    // Duplicate registration error
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You are already registered for this event",
      });
    }

    res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
};

// @desc Get my registrations
// @route GET /api/registrations/me
// @access Private
const getMyRegistrations = async (req, res) => {
  try {
    const userId = req.user._id;

    const registrations = await Registration.find({ user: userId })
      .populate("event")
      .sort({ createdAt: -1 });

    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching registrations",
      error: error.message,
    });
  }
};

module.exports = {
  registerToEvent,
  getMyRegistrations,
};