const CONTRACT_ADDRESS = "0x96D050dC2c40Dc105856147E812fa4Ff653A7638";

const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    mp: characterData.mp.toNumber(),
    maxMp: characterData.maxMp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
    spellDamage: characterData.spellDamage.toNumber(),
  };
};

export { CONTRACT_ADDRESS, transformCharacterData };
