import type { Dictionary } from '..'
import { products } from './products'

export const ru: Dictionary = {
  chatgame: {
    welcomeMessage: `Добро пожаловать в ChatGame! 🥳

Выбери игру или действие 👇`,
    playingOnTwitch: '👾 Играем на Twitch',
  },
  woodland: {
    welcomeMessage: `Добро пожаловать в Woodlands! 🥳

Одна из задач - сопровождать Машину из точки А в точку Б. По пути могут встречаться препятствия. Тапай их! 👆💪

Участвуй в событиях, приглашай друзей, добывай Монеты и разблокируй вручную созданных персонажей. 🤴🎅🐶`,
    title: '🌲 Woodlands: Онлайн-игра',
    play: '🎮 Играть',
    developingGameOnTwitch: '👾 Улучшаем игру на Twitch',
    website: '👨‍💻 Веб-сайт проекта',
  },
  subscribeToChannel: '📢 Подпишись на канал',
  defaultBotReply: 'Я пока не умею отвечать на сообщения. Свяжись с @hmbanan666, если есть вопросы.',
  products,
}
