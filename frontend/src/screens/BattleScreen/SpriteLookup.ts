function SpriteLookup(sameTeam: boolean, troopType: string): string {
  const imageDirectory = "/battle_images/";
  const PlayerSpriteMap: { [key: string]: string } = {
    SpearmanOne: "blue-spearman.png",
    SpearmanTwo: "blue-spearman.png",
    SpearmanThree: "blue-spearman.png",
    ArcherOne: "blue-archer.png",
    ArcherTwo: "blue-archer.png",
    ArcherThree: "blue-archer.png",
    CavalryOne: "blue-cavalry.png",
    CavalryTwo: "blue-cavalry.png",
    CavalryThree: "blue-cavalry.png",
    KingTower: "blue-castle.png",
    Castle: "blue-castle.png",
  };
  const EndemySpriteMap: { [key: string]: string } = {
    SpearmanOne: "red-spearman.png",
    SpearmanTwo: "red-spearman.png",
    SpearmanThree: "red-spearman.png",
    ArcherOne: "red-archer.png",
    ArcherTwo: "red-archer.png",
    ArcherThree: "red-archer.png",
    CavalryOne: "red-cavalry.png",
    CavalryTwo: "red-cavalry.png",
    CavalryThree: "red-cavalry.png",
    KingTower: "red-castle.png",
    Castle: "red-castle.png",
  };
  var spriteMap;
  if (sameTeam) {
    spriteMap = PlayerSpriteMap;
  } else {
    spriteMap = EndemySpriteMap;
  }

  if (!(troopType in spriteMap)) {
    throw new Error(`SpriteLookup: Unknown troop type ${troopType}`);
  }
  return imageDirectory + spriteMap[troopType];
}

export default SpriteLookup;