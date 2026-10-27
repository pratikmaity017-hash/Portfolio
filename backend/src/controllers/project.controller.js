const Project = require("../models/project.model");

const allowedFields = [
  "title",
  "description",
  "category",
  "technologies",
  "githubUrl",
  "liveUrl",
  "imageUrl",
  "isPublished",
];

function getProjectData(body) {
  const data = {};

  for (const field of allowedFields) {
    if (Object.hasOwn(body, field)) {
      data[field] = body[field];
    }
  }

  return data;
}

exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAdminProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }).lean();

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

exports.createProject = async (req, res, next) => {
  try {
    const project = await Project.create(getProjectData(req.body));

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: getProjectData(req.body) },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
