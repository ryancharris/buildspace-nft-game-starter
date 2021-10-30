import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";

import finalFantasy from "../../utils/FinalFantasy.json";
import "./SelectCharacter.css";

function SelectCharacter({ setCharacter }) {
  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
      console.log("Ethereum object not found.");
    }
  }, []);

  useEffect(() => {
    const getCharacters = async () => {
      try {
        console.log("Getting contract characters to mint");

        const charactersTxn = await gameContract.getAllDefaultCharacters();
        console.log("charactersTxn:", charactersTxn);

        const characters = charactersTxn.map((characterData) =>
          transformCharacterData(characterData)
        );

        setCharacters(characters);
      } catch (error) {
        console.error("Something went wrong fetching characters:", error);
      }
    };

    const onMint = async (sender, tokenId, characterIndex) => {
      console.log(
        `FFVII character minted -- sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
      );

      if (gameContract) {
        const characterNFT = await gameContract.checkIfUserHasNFT();
        console.log("CharacterNFT: ", characterNFT);
        setCharacter(transformCharacterData(characterNFT));
      }
    };

    if (gameContract) {
      getCharacters();
      gameContract.on("CharacterNFTMinted", onMint);
    }

    return () => {
      if (gameContract) {
        gameContract.off("CharacterNFTMinted", onMint);
      }
    };
  }, [gameContract, setCharacter]);

  const mintCharacterNFTAction = async (characterId) => {
    console.log("characterId", characterId);
    try {
      if (gameContract) {
        console.log("Minting character in progress...");
        setIsLoading(true);

        const mintTxn = await gameContract.mintNFT(characterId);
        await mintTxn.wait();
        console.log("mintTxn:", mintTxn);

        setIsLoading(false);
      }
    } catch (error) {
      console.warn("MintCharacterAction Error:", error);
      setIsLoading(false);
    }
  };

  const renderCharacters = () =>
    characters.map((character, index) => {
      return (
        <div className="character-item" key={character.name}>
          <div className="name-container">
            <p>{character.name}</p>
          </div>
          <img src={character.imageURI} alt={character.name} />
          <button
            type="button"
            className="character-mint-button"
            onClick={() => mintCharacterNFTAction(index)}
          >{`Mint ${character.name}`}</button>
        </div>
      );
    });

  return (
    <div className="select-character-container">
      {!isLoading && (
        <>
          <h2>Mint a character</h2>
          {characters.length && (
            <div className="character-grid">{renderCharacters()}</div>
          )}
        </>
      )}
      {isLoading && <p>Loading...</p>}
    </div>
  );
}

export default SelectCharacter;
