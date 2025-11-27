// At the top of your module
const enemySpriteMap: { [key: string]: HTMLImageElement } = {};
const playerSpriteMap: { [key: string]: HTMLImageElement } = {};

// Call this once at startup to preload all sprites
export function preloadSprites(): Promise<void> {
  const imageDirectory = "/battle_images/";

  const PlayerURIs: { [key: string]: string } = {
    SwordsmanOne: "blue-swordsman.png",
    SwordsmanTwo: "blue-swordsman.png",
    SwordsmanThree: "blue-swordsman.png",
    SwordsmanFour: "blue-swordsman.png",
    SpearmanOne: "blue-spearman.png",
    SpearmanTwo: "blue-spearman.png",
    SpearmanThree: "blue-spearman.png",
    SpearmanFour: "blue-spearman.png",
    ArcherOne: "blue-archer.png",
    ArcherTwo: "blue-archer.png",
    ArcherThree: "blue-archer.png",
    ArcherFour: "blue-archer.png",
    CavalryOne: "blue-cavalry.png",
    CavalryTwo: "blue-cavalry.png",
    CavalryThree: "blue-cavalry.png",
    CavalryFour: "blue-cavalry.png",
    KingTower: "blue-castle.png",
    Castle: "blue-castle.png",
  };

  const EnemyURIs: { [key: string]: string } = {
    SwordsmanOne: "red-swordsman.png",
    SwordsmanTwo: "red-swordsman.png",
    SwordsmanThree: "red-swordsman.png",
    SwordsmanFour: "red-swordsman.png",
    SpearmanOne: "red-spearman.png",
    SpearmanTwo: "red-spearman.png",
    SpearmanThree: "red-spearman.png",
    SpearmanFour: "red-spearman.png",
    ArcherOne: "red-archer.png",
    ArcherTwo: "red-archer.png",
    ArcherThree: "red-archer.png",
    ArcherFour: "red-archer.png",
    CavalryOne: "red-cavalry.png",
    CavalryTwo: "red-cavalry.png",
    CavalryThree: "red-cavalry.png",
    CavalryFour: "red-cavalry.png",
    KingTower: "red-castle.png",
    Castle: "red-castle.png",
  };

  const promises: Promise<void>[] = [];

  const loadMap = (
    map: { [key: string]: string },
    outputMap: { [key: string]: HTMLImageElement },
  ) => {
    for (const key in map) {
      const img = new Image();
      img.src = imageDirectory + map[key];
      const p = new Promise<void>((resolve) => {
        img.onload = () => {
          outputMap[key] = img;
          resolve();
        };
      });
      promises.push(p);
    }
  };

  loadMap(PlayerURIs, playerSpriteMap);
  loadMap(EnemyURIs, enemySpriteMap);

  return Promise.all(promises).then(() => undefined);
}

// Then your lookup function becomes simple:
export function SpriteLookup(
  sameTeam: boolean,
  troopType: string,
): HTMLImageElement {
  const spriteMap = sameTeam ? playerSpriteMap : enemySpriteMap;
  if (!(troopType in spriteMap)) {
    throw new Error(`SpriteLookup: Unknown troop type ${troopType}`);
  }
  return spriteMap[troopType];
}
