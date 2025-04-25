// import { Batch, BatchAllocation } from "./batch.model.js";
// import House from "../house/house.model.js";

// // Get all batches for the logged-in user's farm
// const getData = async (req, res) => {
//   try {
//     const user = req.user;

//     if (!user.farmId) {
//       return res
//         .status(400)
//         .json({ message: "User does not belong to a farm" });
//     }

//     const batches = await Batch.find({ farmId: user.farmId });

//     res.status(200).json(batches);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// const createData = async (req, res) => {
//   try {
//     const user = req.user;

//     if (!user.farmId) {
//       return res
//         .status(400)
//         .json({ message: "User does not belong to a farm" });
//     }
//     const { name, arrivalDate, ageAtArrival, chickenType, quantity, supplier } =
//       req.body;

//     const newBatch = new Batch({
//       farmId: user.farmId,
//       name,
//       arrivalDate,
//       ageAtArrival,
//       chickenType,
//       quantity,
//       supplier,
//     });

//     await newBatch.save();
//     res.status(201).json(newBatch);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// export default {
//   getData,
//   createData,
// };

import SensorData from "./monitoring.model.js";

const getData = async (req, res) => {
  try {
    const user = req.user;

    if (!user.farmId) {
      return res
        .status(400)
        .json({ message: "User does not belong to a farm" });
    }

    const batches = await Batch.find({ farmId: user.farmId });

    res.status(200).json(batches);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createData = async (req, res) => {
  try {
   
    const { temperature, humidity } = req.body;

    const data = new SensorData({ temperature, humidity });
    await data.save();
    res.status(201).json(data);
  } catch (error) {
    res.status(500).send('Error saving data');
  }
};

export default {
  getData,
  createData,
};