const { Client, GatewayIntentBits, Events } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

require('dotenv').config();

const { MessageContent, GuildMessages, Guilds } = GatewayIntentBits;

const client = new Client({intents: [MessageContent, GuildMessages, Guilds]});

const configuration = new Configuration({
    apiKey: process.env.API_KEY
});

const openai = new OpenAIApi(configuration);


client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
})

client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;
    if (message.channelId === '1090689695261929493') {
        
        const GPT4 = await openai.createChatCompletion({
            model: "gpt-4",
            messages: [ { content: message.content, role: 'user' } ],
        });

        const GPT4Message = GPT4.data.choices[0].message;

        // Discord API has a limit of 2000 Characters per message
        if (GPT4Message.content.length >= 2000) {
            splitMessage(GPT4Message.content).forEach(async (msg) => {
                await message.channel.send(msg);
            });
            return;
        }
        return message.channel.send(GPT4Message);
    }
});

function splitMessage(message) {
    const result = [];

    for (let i = 0; i < message.length; i += 2000) {
        result.push(message.slice(i, i + 2000));
    }
    return result;
}

client.login(process.env.TOKEN);

