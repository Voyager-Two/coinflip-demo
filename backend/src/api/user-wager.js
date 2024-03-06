import User from "../models/user.js";
import Wagers from "../models/wagers.js";

const userWager = async (req, res) => {
  const { amount_to_wager, heads_or_tails } = req.body;

  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    const existingUser = await User.findOne({ _id: req.userId });

    if (!existingUser) {
      return res.status(404).json({ message: "User does not exist" });
    }

    if (existingUser.wager_tokens < amount_to_wager) {
      return res.status(400).json({ message: "Insufficient Tokens" });
    }

    const randomFlip = Math.random() < 0.5 ? "heads" : "tails";

    // Initialize variables
    let win = randomFlip === heads_or_tails;
    let multiplier = 2;
    let previousBalance = existingUser.wager_tokens;
    let newBalance;

    // Fetch the last 5 wagers of the user from table Wagers
    const lastFiveWagers = await Wagers.find({ user_id: existingUser._id }).sort({ _id: -1 }).limit(5);

    console.log('lastFiveWagers', lastFiveWagers)

    // Bonus payout
    // Determine if the user has won 3 or 5 times in a row
    if (win && lastFiveWagers.length >= 2) {
      console.log('determining bonus payout');
      let winCount = 0;
      for (let i = 0; i < lastFiveWagers.length; i++) {
        if (lastFiveWagers[i].win === true) {
          winCount++;
        } else {
          break;
        }
      }
      console.log('winCount', winCount);
      // If the user wins 3 times in a row, they receive 3x of what they wagered on the 3rd toss.
      // Minus 1 because they've also won the current toss
      if (winCount === 2) {
        multiplier = 3;
      }
      // If the user wins 5 times in a row, they receive 10x of what they wagered on the 5th toss.
      // Minus 1 because they've also won the current toss
      if (winCount === 4) {
        multiplier = 10;
      }
      console.log('multiplier', multiplier);
    }

    // Determine new user balance after wager
    if (win) {
      // If the user wins, they get back 2x the amount of coins they wagered.
      // Add the amount of coins they wagered to their total
      newBalance = (Number(existingUser.wager_tokens) - Number(amount_to_wager)) + (Number(amount_to_wager) * multiplier);
    } else {
      // If the user loses, they get back nothing.
      // Subtract the amount of coins they wagered from their total
      newBalance = Number(existingUser.wager_tokens) - Number(amount_to_wager);
    }

    // Update the user balance in database
    existingUser.wager_tokens = newBalance;
    await existingUser.save();

    // Insert the wager into the Wagers table
    const wager = new Wagers({
      user_id: existingUser._id,
      amount_wagered: amount_to_wager,
      user_side: heads_or_tails,
      coin_flip_result: randomFlip,
      win: win,
      balance_before: previousBalance,
      balance_after: newBalance,
      multiplier: multiplier
    });
    await wager.save();

    // Return API response
    if (win) {
      // Display won amount in message
      if (multiplier > 2) {
        return res.status(200).json({
          message: `You won ${newBalance - previousBalance} tokens! Bonus Payout: ${multiplier}x`,
          new_balance: existingUser.wager_tokens,
          wager: wager.toJSON()
        });
      }
      return res.status(200).json({
        message: `You won ${newBalance - previousBalance} tokens!`,
        new_balance: existingUser.wager_tokens,
        wager: wager.toJSON()
      });
    } else {
      return res.status(200).json({
        message: "You lost! Better luck next time",
        new_balance: existingUser.wager_tokens,
        wager: wager.toJSON()
      });
    }

  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default userWager;
