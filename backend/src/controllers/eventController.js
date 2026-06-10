const Event = require("../models/Event");
const Registration = require("../models/Registration");

// @desc Create a new event
// @route POST /api/events
// @access Private (admin only)
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    if (!title || !description || !date || !location) {
      return res.status(400).json({
        message: "Title, description, date and location are required",
      });
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while creating event",
      error: error.message,
    });
  }
};

// @desc Get all events
// @route GET /api/events
// @access Public
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name email role")
      .sort({ date: 1 });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching events",
      error: error.message,
    });
  }
};

// @desc Get single event by id
// @route GET /api/events/:id
// @access Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "createdBy",
      "name email role"
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching event",
      error: error.message,
    });
  }
};

// @desc Delete event
// @route DELETE /api/events/:id
// @access Private (admin only)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // Obriši sve prijave povezane s tim događajem
    await Registration.deleteMany({ event: event._id });

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Događaj i sve povezane prijave su uspješno obrisani",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while deleting event",
      error: error.message,
    });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  deleteEvent,
};