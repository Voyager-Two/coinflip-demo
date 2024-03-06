import User from "../models/user.js";
import Wagers from "../models/wagers.js";

const userData = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    const existingUser = await User.findOne({ _id: req.userId });

    if (!existingUser) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const lastTenWagers = await Wagers.find({ user_id: existingUser._id }).sort({ _id: -1 }).limit(10);

    return res.status(200).json({
      past_wagers: lastTenWagers,
      wager_tokens: existingUser.wager_tokens
    });

  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default userData;
