const TelegramBot = require('node-telegram-bot-api')
const options = require('./options')

const token = '5944153435:AAHqJzOGMuVHFImMeSbVl60Kr7GUbYL_0ik'

const bot = new TelegramBot(token, { polling: true })

// bot.setMyCommands([
//     { command: '/start', description: 'Приветствие' },
//     { command: '/game', description: 'Угадай число' }
// ])

const chats = {}

bot.on('message', msg => {
    // console.log(msg)
    const chatId = msg.chat.id

    if(msg?.text === '/start') {
        // bot.sendSticker(chatId, 'https://images.unsplash.com/photo-1532506422681-c6a5388db2fe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60')
        return bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/a0a/62d/a0a62da8-6f3d-3b63-b7b2-2d73facaa474/256/27.webp')
    }

    if(msg?.text === '/game') {
        bot.sendMessage(chatId, 'Угадаешь число от 0 до 9?')

        const random = Math.floor(Math.random() * 10)
        chats[chatId] = random

        return bot.sendMessage(chatId, `Давай (${chats[chatId]})`, options)
    }

    bot.sendMessage(chatId, 'Message receved')
})

const messagesToDelete = []

bot.on('callback_query', async msg => {
    const chatId = msg.message.chat.id

    if(msg.data === String(chats[chatId])) {
        bot.editMessageText('Congrats! Right!', {
            chat_id: chatId,
            message_id: msg.message.message_id
        })
        messagesToDelete.forEach(id => {
            bot.deleteMessage(chatId, id)
        })
    } else {
        const sentMessage = await bot.sendMessage(chatId, 'Sorry, nope')
        // console.log(sentMessage)
        messagesToDelete.push(sentMessage.message_id)
    }
})
