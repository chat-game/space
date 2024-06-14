import { createId } from '@paralleldrive/cuid2'
import {
  type GameSceneType,
  type IGameEvent,
  getDatePlusSeconds,
} from '../../../../../packages/api-sdk/src'
import { sendMessage } from '../../websocket/websocket.server'

interface IEventOptions {
  title: IGameEvent['title']
  description: IGameEvent['description']
  type: IGameEvent['type']
  secondsToEnd: number
  scene?: GameSceneType
  poll: IGameEvent['poll']
  quest: IGameEvent['quest']
  offers: IGameEvent['offers']
}

export class Event implements IGameEvent {
  public id: string
  public title: IGameEvent['title']
  public description: IGameEvent['description']
  public type: IGameEvent['type']
  public status: IGameEvent['status']
  public scene?: GameSceneType
  public endsAt!: Date
  public deletesAt!: Date
  public poll?: IGameEvent['poll']
  public quest?: IGameEvent['quest']
  public offers?: IGameEvent['offers']

  constructor({
    title,
    description,
    type,
    secondsToEnd,
    scene,
    poll,
    quest,
    offers,
  }: IEventOptions) {
    this.id = createId()
    this.title = title
    this.description = description
    this.type = type
    this.scene = scene
    this.poll = poll
    this.quest = quest
    this.offers = offers
    this.status = 'STARTED'

    this.setEndsAtPlusSeconds(secondsToEnd)

    sendMessage(type)
  }

  public checkStatus() {
    if (this.endsAt.getTime() <= new Date().getTime()) {
      this.status = 'STOPPED'
    }
    if (this.deletesAt.getTime() <= new Date().getTime()) {
      this.status = 'STOPPED'
    }

    return this.status
  }

  public setEndsAtPlusSeconds(seconds: number) {
    this.endsAt = getDatePlusSeconds(seconds)
    this.deletesAt = getDatePlusSeconds(seconds + 30)
  }
}
