module.exports = {
	name: "beep",
	description: "Beep!",
	execute(message) {
		message.channel.send("boop, I'm a robot");
	},
};
