const ping = require("./ping");
const eightBall = require("./8ball");

const allowedCommands = { ping, "8ball": eightBall };

module.exports = (message) => {
  const args = message.content.substr(1).split(" ");
  const command = args.shift().toLowerCase();
  if (command in allowedCommands) {
    allowedCommands[command](message, args);
  }
};
