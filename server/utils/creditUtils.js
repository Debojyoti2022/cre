
const rewardDailyLogin = async (user) => {
    try {
      user.credits += 10; // Add 10 credits for daily login
      await user.save();
      return true;
    } catch (err) {
      console.error('Error rewarding daily login:', err);
      return false;
    }
  };
  
  // Function to reward saving a post
  const rewardSavePost = async (user) => {
    try {
      user.credits += 5; // Add 5 credits for saving a post
      await user.save();
      return true;
    } catch (err) {
      console.error('Error rewarding save post:', err);
      return false;
    }
  };
  
  // Function to reward reporting a post
  const rewardReportPost = async (user) => {
    try {
      user.credits += 7; // Add 7 credits for reporting a post
      await user.save();
      return true;
    } catch (err) {
      console.error('Error rewarding report post:', err);
      return false;
    }
  };
  
  // Function to reward profile completion
  const rewardProfileCompletion = async (user) => {
    try {
      // Check if the profile is complete (name and bio present)
      if (user.name && user.bio) {
        user.credits += 15; // Add 15 credits for completing the profile
        await user.save();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error rewarding profile completion:', err);
      return false;
    }
  };
  
  module.exports = {
    rewardDailyLogin,
    rewardSavePost,
    rewardReportPost,
    rewardProfileCompletion,
  };
  