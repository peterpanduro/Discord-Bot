"use strict";

const Discord = require("discord.js");
const {
	prefix,
	token,
	rules_channel_id,
	rules_accepted_role_id,
} = require("../config.json");
const fs = require("fs");

// Create an instance of a Discord client
const client = new Discord.Client({ partials: ["MESSAGE", "REACTION"] });
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
			let reply = `You didn't provide any arguments, ${message.author}!`;
			if (command.usage) {
				reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
			}
			return message.channel.send(reply);
		}
		try {
			command.execute(message, args);
		} catch (e) {
			console.error(e);
		}
	}
});

/**
 * Check if reaction is recieved on <Rules> channel.
 * Add user to <Rules_Accepted_Role_Id>
 */
client.on("messageReactionAdd", async (reaction, user) => {
	if (rules_channel_id) {
		if (reaction.partial) {
			// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
			try {
				await reaction.fetch();
			} catch (error) {
				console.log("Something went wrong when fetching the message: ", error);
				// Return as `reaction.message.author` may be undefined/null
				return;
			}
		}
		// Now the message has been cached and is fully available
		if (reaction.message.channel.id === rules_channel_id) {
			const member = reaction.message.guild.member(user);
			const role = member.guild.roles.cache.find(
				(role) => role.id === rules_accepted_role_id
			);
			if (role) {
				member.roles.add(role);
			}
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
