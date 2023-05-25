const telegramApi = require('node-telegram-bot-api');
const { gameOptions, againGameOptions } = require('./options');

const token = '6144136256:AAHgsScJkCEoURP_5WaXTvUwF0EX_ArrFL4';

const bot = new telegramApi(token, { polling: true });

const chatsData = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Try to guess number from 1 to 10');
    const rndNumber = Math.floor(Math.random() * 10);
    chatsData[chatId] = rndNumber;
    await bot.sendMessage(chatId, 'Guess!', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Hello and Welcome' },
        { command: '/info', description: 'Get some info' },
        { command: '/game', description: 'start game' },
    ]);

    bot.on('message', async (msg) => {
        const { text, from: { id: chatId, first_name: firstName } } = msg;
        console.log('text', text);
        if (text === '/start') {
            return bot.sendMessage(chatId, 'Hello and Welcome');
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Your name is ${firstName}`)
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, `Sorry, I don't understand you.`)
    });

    bot.on('callback_query', async msg => {
        const { text, from: { id: chatId }, data } = msg;

        // console.log('data', data);
        if (data == chatsData[chatId]) {
            await bot.sendMessage(chatId, `You choose number ${data}`);
            return bot.sendMessage(chatId, 'You guessed right!', againGameOptions)
        }
        if (data === '/again') {
            return startGame(chatId);
        }
        else {
            await bot.sendMessage(chatId, `You choose number ${data}`);
            return bot.sendMessage(chatId, `Sorry (: Try one more time. Bot choose number ${chatsData[chatId]}`, againGameOptions)
        }
    })
};

start();