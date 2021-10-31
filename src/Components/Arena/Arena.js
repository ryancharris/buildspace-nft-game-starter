import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import finalFantasy from "../../utils/FinalFantasy.json";
import "./Arena.css";

/*
 * We pass in our characterNFT metadata so we can a cool card in our UI
 */
const Arena = ({ characterNFT, setCharacter }) => {
  // State
  const [gameContract, setGameContract] = useState(null);
  const [boss, setBoss] = useState(null);
  const [attackState, setAttackState] = useState(null);
  const [spellState, setSpellState] = useState(null);

  // UseEffects
  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        finalFantasy.abi,
        signer
      );

      setGameContract(gameContract);
    } else {
      console.log("Ethereum object not found");
    }
  }, []);

  useEffect(() => {
    const fetchBoss = async () => {
      const bossTxn = await gameContract.getBoss();
      console.log("Boss:", bossTxn);
      setBoss(transformCharacterData(bossTxn));
    };

    const onAttackComplete = (newBossHp, newPlayerHp) => {
      const bossHp = newBossHp.toNumber();
      const playerHp = newPlayerHp.toNumber();

      console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

      /*
       * Update both player and boss Hp
       */
      setBoss((prevState) => {
        return { ...prevState, hp: bossHp };
      });

      setCharacter((prevState) => {
        return { ...prevState, hp: playerHp };
      });
    };

    const onSpellComplete = (newBossHp, newPlayerHp) => {
      const bossHp = newBossHp.toNumber();
      const playerHp = newPlayerHp.toNumber();

      console.log(`SpellComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

      /*
       * Update both player and boss Hp
       */
      setBoss((prevState) => {
        return { ...prevState, hp: bossHp };
      });

      setCharacter((prevState) => {
        return { ...prevState, hp: playerHp };
      });
    };

    if (gameContract) {
      fetchBoss();
      gameContract.on("AttackCompleted", onAttackComplete);
      gameContract.on("SpellCompleted", onSpellComplete);
    }

    return () => {
      if (gameContract) {
        gameContract.off("AttackCompleted", onAttackComplete);
        gameContract.off("SpellCompleted", onSpellComplete);
      }
    };
  }, [gameContract, setCharacter]);

  const attackAction = async () => {
    try {
      if (gameContract) {
        setAttackState("attacking");
        console.log("Attacking boss...");
        const attackTxn = await gameContract.attackBoss();
        await attackTxn.wait();
        console.log("attackTxn:", attackTxn);
        setAttackState("hit");
      }
    } catch (error) {
      console.error("Error attacking boss:", error);
      setAttackState("miss");
    }
  };

  const spellAction = async () => {
    try {
      if (gameContract) {
        setSpellState("attacking");
        console.log("Casting a spell on the boss...");
        const spellTxn = await gameContract.castSpellOnBoss();
        await spellTxn.wait();
        console.log("spellTxn:", spellTxn);
        setSpellState("hit");
      }
    } catch (error) {
      console.error("Error attacking boss:", error);
      setSpellState("miss");
    }
  };

  return (
    <div className="arena-container">
      {boss && (
        <div className="boss-container">
          <div className={`boss-content ${attackState} ${spellState}`}>
            <h2>{boss.name}</h2>
            <div className="image-content">
              <img
                src={`https://cloudflare-ipfs.com/ipfs/${boss.imageURI}`}
                alt={`Boss ${boss.name}`}
              />
              <div className="health-bar">
                <progress value={boss.hp} max={boss.maxHp} />
                <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
              </div>
            </div>
          </div>
          <div className="attack-container">
            <button
              className="cta-button"
              onClick={attackAction}
            >{`💥 Attack ${boss.name}`}</button>
            <button
              className="cta-button"
              onClick={spellAction}
            >{`🪄 Cast a spell on ${boss.name}`}</button>
          </div>
        </div>
      )}

      {characterNFT && (
        <div className="players-container">
          <div className="player-container">
            <h2>Your Character</h2>
            <div className="player">
              <div className="image-content">
                <h2>{characterNFT.name}</h2>
                <img
                  src={`https://cloudflare-ipfs.com/ipfs/${characterNFT.imageURI}`}
                  alt={`Character ${characterNFT.name}`}
                />
                <div className="health-bar">
                  <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                  <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
                </div>
              </div>
              <div className="stats">
                <h4>{`⚔️ Attack Damage: ${characterNFT.attackDamage}`}</h4>
                <h4>{`🔮 Spell Damage: ${characterNFT.spellDamage}`}</h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Arena;
