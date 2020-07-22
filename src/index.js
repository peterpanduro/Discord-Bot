"use strict";

const Discord = require("discord.js");
const { prefix, token } = require("../config.json");
const commands = require("./commands");

// Create an instance of a Discord client
const client = new Discord.Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {
  if (message.content.charAt(0) === prefix) {
    commands(message);
  }
});

try {
  client.login(token);
} catch (e) {
  console.log(e);
}
