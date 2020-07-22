"use strict";

const Discord = require("discord.js");
const { prefix, token } = require("../config.json");
const fs = require("fs");

// Create an instance of a Discord client
const client = new Discord.Client();
// Create a dynamic collection of commands from the files in /src/commands
client.commands = new Discord.Collection();
const commandFiles = fs
	.readdirSync("./src/commands")
	.filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on("ready", () => {
	console.log("I am ready!");
});

/**
 * When a message is sent, send to the command-recognizer
 */
client.on("message", (message) => {
	if (message.content.charAt(0) === prefix) {
		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();
		if (!client.commands.has(commandName)) return;

		const command = client.commands.get(commandName);
		if (command.args && !args.length) {
			return message.reply("You didn't provide any arguments!");
		}
		try {
			command.execute(message, args);
		} catch (e) {
			console.error(e);
		}
	}
});

/**
 * Start the bot
 */
try {
	client.login(token);
} catch (e) {
	console.log(e);
}
