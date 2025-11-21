const { Doctor, User, Activity } = require('../models');

const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
};

exports.createDoctor = async (req, res) => {
  try {
    const { userId, specialization, licenseNumber, yearsOfExperience, availableSlots, bio, imageUrl } = req.body;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if doctor already exists for this user
    const existingDoctor = await Doctor.findOne({ where: { userId } });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'Doctor profile already exists for this user'
      });
    }

    // Check if license number already exists
    const existingLicense = await Doctor.findOne({ where: { licenseNumber } });
    if (existingLicense) {
      return res.status(400).json({
        success: false,
        message: 'License number already exists'
      });
    }

    const doctor = await Doctor.create({
      userId,
      specialization,
      licenseNumber,
      yearsOfExperience: yearsOfExperience || 0,
      availableSlots: availableSlots || 0,
      bio,
      imageUrl
    });

    // Update user role to doctor
    await user.update({ role: 'doctor' });

    // Log activity
    await Activity.create({
      type: 'create',
      description: `Created doctor profile: ${user.email}`,
      user: req.user.email,
      details: `Specialization: ${specialization}`,
      ipAddress: getClientIp(req)
    });

    // Fetch doctor with user details
    const doctorWithUser = await Doctor.findByPk(doctor.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] }]
    });

    res.status(201).json({
      success: true,
      message: 'Doctor profile created successfully',
      data: doctorWithUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating doctor profile',
      error: error.message
    });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address'] }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: doctors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving doctors',
      error: error.message
    });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address'] }]
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving doctor',
      error: error.message
    });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const { specialization, yearsOfExperience, availableSlots, bio, imageUrl } = req.body;

    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    await doctor.update({
      specialization: specialization || doctor.specialization,
      yearsOfExperience: yearsOfExperience !== undefined ? yearsOfExperience : doctor.yearsOfExperience,
      availableSlots: availableSlots !== undefined ? availableSlots : doctor.availableSlots,
      bio: bio || doctor.bio,
      imageUrl: imageUrl || doctor.imageUrl
    });

    // Log activity
    await Activity.create({
      type: 'update',
      description: `Updated doctor profile: ${doctor.id}`,
      user: req.user.email,
      details: `Specialization: ${specialization}`,
      ipAddress: getClientIp(req)
    });

    const updatedDoctor = await Doctor.findByPk(req.params.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] }]
    });

    res.status(200).json({
      success: true,
      message: 'Doctor updated successfully',
      data: updatedDoctor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating doctor',
      error: error.message
    });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const user = await User.findByPk(doctor.userId);
    if (user) {
      await user.update({ role: 'patient' });
    }

    await doctor.destroy();

    // Log activity
    await Activity.create({
      type: 'delete',
      description: `Deleted doctor profile: ${doctor.id}`,
      user: req.user.email,
      details: `Doctor ID: ${doctor.id}`,
      ipAddress: getClientIp(req)
    });

    res.status(200).json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting doctor',
      error: error.message
    });
  }
};
