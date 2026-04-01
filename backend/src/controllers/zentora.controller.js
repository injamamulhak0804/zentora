import User from "../models/zentora.model.js";

export const getZentora = (req, res) => {
  res.json({
    message: "Get all Zentora data"
  });
};

export const createZentora = async (req, res) => {
  const data = req.body;

  const isValid = isvalidateZentoraData(data);

  if(!isValid) return res.status(400).json({
      success: false,
      message: "Invalid data provided"
    });

    const savedData = await User.create(data);
    savedData.save();
    


  res.json({
    message: "Zentora created",
    data
  });
};