//create token and saving it in cookies
const sendShopToken = (user, statusCode, res) => {
  const token = user.getJwtToken();
  //options for cookies
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.status(statusCode).cookie("seller_Token", token, options).json({
    success: true,
    message: "success",
    user,
    token,
  });
};
module.exports = sendShopToken;
