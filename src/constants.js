const CONTRACT_ADDRESS = "0xdb79b9551f0e42fEbFc90bd6f039bB24F8d2Cc71";

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
