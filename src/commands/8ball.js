const answers = [
	"It is certain",
	"Reply hazy, try again",
	"Don’t count on it",
	"It is decidedly so",
	"Ask again later",
	"My reply is no",
	"Without a doubt",
	"Better not tell you now",
	"My sources say no",
	"Yes – definitely",
	"Cannot predict now",
	"Outlook not so good",
	"You may rely on it",
	"Concentrate and ask again",
	"Very doubtful",
	"As I see it, yes",
	"Most likely",
	"Outlook good",
	"Yes",
	"Signs point to yes",
];

module.exports = {
	name: "8ball",
	description: "Get your questions answered",
	execute(message, args) {
		if (args.length === 0) {
			message.reply("You didn't ask a question");
			return;
		}
		const i = Math.floor(Math.random() * answers.length);
		message.reply(answers[i]);
	},
};
