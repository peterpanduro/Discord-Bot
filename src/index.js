"use strict";

const Discord = require("discord.js");
const fs = require("fs");
const {
	prefix,
	token,
	new_user_accept_rules,
	admin_role_id,
} = require("../config.json");

// Create an instance of a Discord client
// Partials are used to listen for reactions on existing messages
const client = new Discord.Client({
	partials: ["MESSAGE", "REACTION", "USER", "CHANNEL"],
});
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

		const member = message.guild.member(message.author);
		const isAdmin = member.roles.cache.some(
			(role) => role.id === admin_role_id
		);
		if (command.adminOnly && !isAdmin) {
			return message.channel.send(
				"You don't have the right permission for this command"
			);
		}
		try {
			command.execute(message, args);
		} catch (e) {
			console.error(e);
		}
	}
});

const getReactionFromPotentialPartial = async (reaction) => {
	if (!reaction.partial) {
		return reaction;
	}
	try {
		await reaction.fetch();
		return reaction;
	} catch (error) {
		console.log("Something went wrong when fetching the message: ", error);
		return; // Return as `reaction.message.author` may be undefined/null
	}
};

const getUserFromPotentialPartial = async (user) => {
	if (!user.partial) {
		return user;
	}
	try {
		await user.fetch();
		return user;
	} catch (error) {
		console.log("Something went wrong when fetching the message: ", error);
		return;
	}
};

/**
 * Check if reaction is recieved on <Rules> channel.
 * Add user to <Rules_Accepted_Role_Id>
 */
client.on("messageReactionAdd", async (reaction, user) => {
	reaction = await getReactionFromPotentialPartial(reaction);

	// Deconstruct settings
	const {
		enabled,
		rules_channel_id,
		rules_accepted_role_id,
	} = new_user_accept_rules;

	if (enabled) {
		if (reaction.message.channel.id === rules_channel_id) {
			const message = reaction.message;
			const guild = message.guild;
			const member = await guild.members.fetch(user);
			const role = guild.roles.cache.find(
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
