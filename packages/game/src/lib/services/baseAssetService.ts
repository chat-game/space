import type { AssetService, GameAddon } from '../types'
import { Assets, Sprite } from 'pixi.js'
import tree1Blue from '../assets/images/objects/tree/1/blue.png'
import tree1Green from '../assets/images/objects/tree/1/green.png'
import tree1Stone from '../assets/images/objects/tree/1/stone.png'
import tree1Teal from '../assets/images/objects/tree/1/teal.png'
import tree1Toxic from '../assets/images/objects/tree/1/toxic.png'
import tree1Violet from '../assets/images/objects/tree/1/violet.png'
import tree2Blue from '../assets/images/objects/tree/2/blue.png'
import tree2Green from '../assets/images/objects/tree/2/green.png'
import tree2Stone from '../assets/images/objects/tree/2/stone.png'
import tree2Teal from '../assets/images/objects/tree/2/teal.png'
import tree2Toxic from '../assets/images/objects/tree/2/toxic.png'
import tree2Violet from '../assets/images/objects/tree/2/violet.png'
import tree3Blue from '../assets/images/objects/tree/3/blue.png'
import tree3Green from '../assets/images/objects/tree/3/green.png'
import tree3Stone from '../assets/images/objects/tree/3/stone.png'
import tree3Teal from '../assets/images/objects/tree/3/teal.png'
import tree3Toxic from '../assets/images/objects/tree/3/toxic.png'
import tree3Violet from '../assets/images/objects/tree/3/violet.png'
import tree4Blue from '../assets/images/objects/tree/4/blue.png'
import tree4Green from '../assets/images/objects/tree/4/green.png'
import tree4Stone from '../assets/images/objects/tree/4/stone.png'
import tree4Teal from '../assets/images/objects/tree/4/teal.png'
import tree4Toxic from '../assets/images/objects/tree/4/toxic.png'
import tree4Violet from '../assets/images/objects/tree/4/violet.png'
import tree5Blue from '../assets/images/objects/tree/5/blue.png'
import tree5Green from '../assets/images/objects/tree/5/green.png'
import tree5Stone from '../assets/images/objects/tree/5/stone.png'
import tree5Teal from '../assets/images/objects/tree/5/teal.png'
import tree5Toxic from '../assets/images/objects/tree/5/toxic.png'
import tree5Violet from '../assets/images/objects/tree/5/violet.png'
import wagonEngineCloud1 from '../assets/images/objects/wagon/clouds/1.png'
import wagonEngineCloud2 from '../assets/images/objects/wagon/clouds/2.png'
import wagonEngineCloud3 from '../assets/images/objects/wagon/clouds/3.png'
import wagonEngineCloud4 from '../assets/images/objects/wagon/clouds/4.png'
import wagonEngine from '../assets/images/objects/wagon/engine-1.png'
import wagonBase1 from '../assets/images/objects/wagon/wagon-1.png'
import wagonBase2 from '../assets/images/objects/wagon/wagon-2.png'
import wagonWheel from '../assets/images/objects/wagon/wheel-1.png'

export class BaseAssetService implements AssetService {
  #trees = [
    { alias: 'TREE_1_GREEN', src: tree1Green },
    { alias: 'TREE_2_GREEN', src: tree2Green },
    { alias: 'TREE_3_GREEN', src: tree3Green },
    { alias: 'TREE_4_GREEN', src: tree4Green },
    { alias: 'TREE_5_GREEN', src: tree5Green },
    { alias: 'TREE_1_BLUE', src: tree1Blue },
    { alias: 'TREE_2_BLUE', src: tree2Blue },
    { alias: 'TREE_3_BLUE', src: tree3Blue },
    { alias: 'TREE_4_BLUE', src: tree4Blue },
    { alias: 'TREE_5_BLUE', src: tree5Blue },
    { alias: 'TREE_1_STONE', src: tree1Stone },
    { alias: 'TREE_2_STONE', src: tree2Stone },
    { alias: 'TREE_3_STONE', src: tree3Stone },
    { alias: 'TREE_4_STONE', src: tree4Stone },
    { alias: 'TREE_5_STONE', src: tree5Stone },
    { alias: 'TREE_1_TEAL', src: tree1Teal },
    { alias: 'TREE_2_TEAL', src: tree2Teal },
    { alias: 'TREE_3_TEAL', src: tree3Teal },
    { alias: 'TREE_4_TEAL', src: tree4Teal },
    { alias: 'TREE_5_TEAL', src: tree5Teal },
    { alias: 'TREE_1_TOXIC', src: tree1Toxic },
    { alias: 'TREE_2_TOXIC', src: tree2Toxic },
    { alias: 'TREE_3_TOXIC', src: tree3Toxic },
    { alias: 'TREE_4_TOXIC', src: tree4Toxic },
    { alias: 'TREE_5_TOXIC', src: tree5Toxic },
    { alias: 'TREE_1_VIOLET', src: tree1Violet },
    { alias: 'TREE_2_VIOLET', src: tree2Violet },
    { alias: 'TREE_3_VIOLET', src: tree3Violet },
    { alias: 'TREE_4_VIOLET', src: tree4Violet },
    { alias: 'TREE_5_VIOLET', src: tree5Violet },
  ]

  #wagon = [
    { alias: 'WAGON_BASE_1', src: wagonBase1 },
    { alias: 'WAGON_BASE_2', src: wagonBase2 },
    { alias: 'WAGON_ENGINE', src: wagonEngine },
    { alias: 'WAGON_WHEEL', src: wagonWheel },
    { alias: 'WAGON_ENGINE_CLOUD_1', src: wagonEngineCloud1 },
    { alias: 'WAGON_ENGINE_CLOUD_2', src: wagonEngineCloud2 },
    { alias: 'WAGON_ENGINE_CLOUD_3', src: wagonEngineCloud3 },
    { alias: 'WAGON_ENGINE_CLOUD_4', src: wagonEngineCloud4 },
  ]

  constructor(protected addon: GameAddon) {}

  sprite(alias: string) {
    return Sprite.from(alias)
  }

  async load() {
    await Assets.load(this.#trees)
    await Assets.load(this.#wagon)
  }
}
