import React, {useEffect} from 'react';
import * as anchor from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID} from '@solana/spl-token';
import './CandyMachine.css';
import { useLocalStorage } from './../useLocalStorage';
import idl from '../idl/cow_nft.json'
import cowsigner from "cowsigner";
import confetti from "canvas-confetti";


import {
  TOKEN_METADATA_PROGRAM_ID,
} from './helpers';



const opts = {
  preflightCommitment: 'processed',
};

const CandyMachine = ({ walletAddress }) => {

  const [minted] = useLocalStorage("minted", "");


    function throwConfetti() {
        confetti({
            particleCount: 400,
            spread: 70,
            origin: {y: 0.6},
        });
    }

    const reloadWindow = () => {
        const itemsRedeemed = localStorage.getItem('minted')
        const redeemed = parseInt(itemsRedeemed)
        const NFTminted = parseInt(minted)
        if (redeemed < NFTminted) {
              setTimeout(function () {
        window.location.reload(true);
    }, 3000);
        }
    }

    useEffect(() => {
      reloadWindow()
    }, [minted])

    const getProvider = () => {
      const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST
      const connection = new anchor.web3.Connection(rpcHost)
      const provider = new anchor.AnchorProvider(connection, window.solana, opts.preflightCommitment)
      return provider
    }

  const mintToken = async () => {
    const provider = getProvider()
      const wallet = walletAddress
    const program = new anchor.Program(idl, process.env.REACT_APP_CANDY_MACHINE_ID, provider)


    let mint = anchor.web3.Keypair.generate();
    let [metadata, ] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from("metadata"), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.publicKey.toBuffer()], TOKEN_METADATA_PROGRAM_ID);
    let [tokenAccount, ] = await anchor.web3.PublicKey.findProgramAddress([wallet.publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.publicKey.toBuffer()], ASSOCIATED_TOKEN_PROGRAM_ID);
    let [masterEdition, ] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from("metadata"), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.publicKey.toBuffer(), Buffer.from("edition")], TOKEN_METADATA_PROGRAM_ID);

    const testNftTitle = "CowNft";
    const testNftSymbol = "COW";
    const testNftUri = "https://raw.githubusercontent.com/alebuffoli/CowNFT/main/assets/nft-metadata.json";

    const contractId = process.env.REACT_APP_COWSIGNER_CONTRACT_ID
    let appWallet = new anchor.web3.PublicKey(process.env.REACT_APP_COWSIGNER_APP_WALLET);

    const additionalComputeBudgetInstruction =
        anchor.web3.ComputeBudgetProgram.requestUnits({
          units: 800000,
          additionalFee: 0,
        });

    console.log(program)
    let method = await program.methods.mint(
        testNftTitle,
        testNftSymbol,
        testNftUri,
        {
          accounts: {
            metadata: metadata,
            masterEdition: masterEdition,
            mint: mint.publicKey,
            tokenAccount: tokenAccount,
            payer: appWallet,
            mintAuthority: wallet.publicKey,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID
          },
          signers: [mint],
          preInstructions: additionalComputeBudgetInstruction
        });


    try {
        const res = await cowsigner.sendInstruction(method, appWallet, contractId)

        throwConfetti();
        return ( res
      )
    } catch (e) {
      console.log(e);
    }

    return [];
  };



  return (
   <div>
      {/* <p>Drop Date: {candyMachine.state.goLiveDateTimeString}</p>
      <p>Items Minted:{candyMachine.state.itemsRedeemed}/{candyMachine.state.itemsAvailable}</p> */}
      <button className="cta-button mint-button transition-all duration-300 hover:-translate-y-[1px]" onClick={mintToken}>
        Mint NFT
      </button>
    </div>
  );
};

export default CandyMachine;
