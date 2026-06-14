const Material = require("../models/Material");

// @desc Get all materials (with search)
// @route GET /api/materials
// @access Public
const getMaterials = async (req, res) => {
  try {
    const search = req.query.search || "";

    const materials = await Material.find({
      title: { $regex: search, $options: "i" },
    }).sort({ createdAt: -1 });

    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching materials",
      error: error.message,
    });
  }
};

// @desc Create material
// @route POST /api/materials
// @access Private
const createMaterial = async (req, res) => {
  try {
    const { title, description, category, fileUrl } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const material = await Material.create({
      title,
      description,
      category,
      fileUrl,
      uploadedBy: req.user._id,
    });

    res.status(201).json({
      message: "Material created successfully",
      material,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while creating material",
      error: error.message,
    });
  }
};

// @desc Delete a material
// @route DELETE /api/materials/:id
// @access Private (admin only)
const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    await Material.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Server error while deleting material',
      error: error.message,
    });
  }
};

module.exports = {
  getMaterials,
  createMaterial,
  deleteMaterial,
};