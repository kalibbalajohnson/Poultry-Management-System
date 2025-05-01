import SensorData from "./monitoring.model.js";

const getSensorDataForHouse = async (req, res) => {
  try {
    const user = req.user;
    if (!user.farmId) {
      return res
        .status(400)
        .json({ message: "User does not belong to a farm" });
    }

    const { houseId } = req.params;
    const data = await SensorData.find({ houseId }).sort({ timestamp: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createSensorDataForHouse = async (req, res) => {
  try {
    const { houseId, temperature, humidity } = req.body;

    if (!houseId || temperature == null || humidity == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const sensorData = await SensorData.create({
      houseId,
      temperature,
      humidity,
    });

    res.status(201).json(sensorData);
  } catch (error) {
    console.error("Error creating sensor data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  createSensorDataForHouse,
  getSensorDataForHouse,
};
