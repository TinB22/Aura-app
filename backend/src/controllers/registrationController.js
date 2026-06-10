const Registration = require("../models/Registration");
const Event = require("../models/Event");

// @desc Register user to event
// @route POST /api/registrations/:eventId
// @access Private
const registerToEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user._id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const registration = await Registration.create({
      user: userId,
      event: eventId,
    });

    res.status(201).json({
      message: "Successfully registered to event",
      registration,
    });
  } catch (error) {
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

// @desc User unregisters from event
// @route DELETE /api/registrations/:eventId
// @access Private
const unregisterFromEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user._id;

    const registration = await Registration.findOne({
      user: userId,
      event: eventId,
    });

    if (!registration) {
      return res.status(404).json({
        message: "Prijava nije pronađena",
      });
    }

    await Registration.findByIdAndDelete(registration._id);

    res.status(200).json({
      message: "Uspješno ste se odjavili s događaja",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while unregistering from event",
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

// @desc Admin gets registrations for selected event
// @route GET /api/registrations/event/:eventId
// @access Private admin
const getRegistrationsForEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const registrations = await Registration.find({ event: eventId })
      .populate("user", "name email role")
      .populate("event", "title date location")
      .sort({ createdAt: -1 });

    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching event registrations",
      error: error.message,
    });
  }
};

// @desc Admin removes one registration by registration id
// @route DELETE /api/registrations/admin/:registrationId
// @access Private admin
const removeRegistrationById = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.registrationId);

    if (!registration) {
      return res.status(404).json({
        message: "Prijava nije pronađena",
      });
    }

    await Registration.findByIdAndDelete(req.params.registrationId);

    res.status(200).json({
      message: "Prijavljeni korisnik je uklonjen s događaja",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while removing registration",
      error: error.message,
    });
  }
};

module.exports = {
  registerToEvent,
  unregisterFromEvent,
  getMyRegistrations,
  getRegistrationsForEvent,
  removeRegistrationById,
};