const ping = require("./ping");

const allowedCommands = { ping };

module.exports = (message) => {
  const args = message.content.substr(1).split(" ");
  const command = args.shift().toLowerCase();
  if (command in allowedCommands) {
    allowedCommands[command](message, args);
  }
};
