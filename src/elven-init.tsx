import {
  ElvenJS,
  Transaction,
  Address,
  TransactionPayload,
  TokenPayment,
  ContractCallPayloadBuilder,
  ContractFunction,
  U32Value,
  LoginMethodsEnum,
} from 'elven.js';
import { useEffect, useState, useRef, LegacyRef } from 'react';

export const ElvenInit = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [pending, setPending] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [egldPrice, setEgldPrice] = useState();

  const qrContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {

    const initElven = async () => {
      const isInitialized = await ElvenJS.init({
        apiUrl: 'https://devnet-api.elrond.com',
        chainType: 'devnet',
        apiTimeout: 10000,
        onLoginPending: () => {
          setPending(true);
        },
        onLoggedIn: () => {
          setLoggedIn(true);
          setPending(false);
        },
        onLogout: () => {
          setLoggedIn(false);
          setPending(false);
        },
      });

      setLoggedIn(Boolean(isInitialized));
    };

    initElven();
    prices();
    return () => ElvenJS.destroy();
  }, []);

  const prices = async() => {
    try{
    setPending(true);
    const result = await fetch('https://devnet-api.elrond.com/economics?fields=price');
    const jsonResult = await result.json();
    setEgldPrice(await jsonResult["price"]);
    } catch (e: any) {
      throw new Error(e?.message);
    } finally {
      setPending(false);
    }
  }

  const loginWithExtension = async () => {
    try {
      await ElvenJS.login(LoginMethodsEnum.maiarBrowserExtension);
    } catch (e: any) {
      console.log('Login: Something went wrong, try again!', e?.message);
    }
  };

  const loginWithMobile = async () => {
    if (qrContainer.current) {
      try {
        await ElvenJS.login(LoginMethodsEnum.maiarMobile, {
          qrCodeContainer: qrContainer.current,
        });
      } catch (e: any) {
        console.log('Login: Something went wrong, try again!', e?.message);
      }
    }
  };

  const logout = async () => {
    try {
      await ElvenJS.logout();
    } catch (e: any) {
      console.error(e.message);
    }
  };

  const makeTransaction = async () => {
    // Simple transaction, you can build different transaction types and payload structures
    const egldTransferAddress =
      'erd17a4wydhhd6t3hhssvcp9g23ppn7lgkk4g2tww3eqzx4mlq95dukss0g50f';
    setTxHash('');
    const demoMessage = 'Transaction demo from Elven.js!';

    const tx = new Transaction({
      nonce: ElvenJS.storage.get('nonce'),
      receiver: new Address(egldTransferAddress),
      gasLimit: 50000 + 1500 * demoMessage.length,
      chainID: 'D',
      data: new TransactionPayload(demoMessage),
      value: TokenPayment.egldFromAmount(0.001),
      sender: new Address(ElvenJS.storage.get('address')),
    });

    try {
      setPending(true);
      const transaction = await ElvenJS.signAndSendTransaction(tx);
      setTxHash(transaction.hash.toString());
    } catch (e: any) {
      throw new Error(e?.message);
    } finally {
      setPending(false);
    }
  };

  const mintNft = async () => {
    // It mints on the smart contract from: https://dapp-demo.elven.tools/
    const nftMinterSmartContract =
      'erd1qqqqqqqqqqqqqpgq5za2pty2tlfqhj20z9qmrrpjmyt6advcgtkscm7xep';
    setTxHash('');
    const data = new ContractCallPayloadBuilder()
      .setFunction(new ContractFunction('mint'))
      .setArgs([new U32Value(1)])
      .build();

    const tx = new Transaction({
      data,
      gasLimit: 14000000,
      value: TokenPayment.egldFromAmount(0.01),
      chainID: 'D',
      receiver: new Address(nftMinterSmartContract),
      sender: new Address(ElvenJS.storage.get('address')),
    });

    try {
      setPending(true);
      const transaction = await ElvenJS.signAndSendTransaction(tx);
      setTxHash(transaction.hash.toString());
    } catch (e: any) {
      throw new Error(e?.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <div>
      

      <div className="header" id="header">
        <div
          id="qr-code-container"
          className="qr-code-container"
          ref={qrContainer}
        ></div>

        <div className="buttons">
          {loggedIn && (
            <button className="button" id="button-tx" onClick={makeTransaction}>
              Send predefined transaction
            </button>
          )}
          {loggedIn && (
            <button className="button" id="button-create-alert" onClick={makeTransaction}>
              Create Alert
            </button>
          )}
          {loggedIn && (
            <button className="button" id="button-mint" onClick={mintNft}>
              Mint NFT
            </button>
          )}
          {!loggedIn && (
            <button
              className="button button-primary button-wide-mobile button-sm"
              id="button-login-extension"
              onClick={loginWithExtension}
            >
              Login with Extension
            </button>
          )}
          {!loggedIn && (
            <button
              className="button button-primary button-wide-mobile button-sm"
              id="button-login-mobile"
              onClick={loginWithMobile}
            >
              Login with Maiar mobile
            </button>
          )}
          {loggedIn && (
            <button className="button" id="button-logout" onClick={logout}>
              Logout
            </button>
          )}
        </div>
      </div>

      <div id="tx-hash" className="tx-hash">
        {txHash && (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://devnet-explorer.elrond.com/transactions/${txHash}`}
          >{`https://devnet-explorer.elrond.com/transactions/${txHash}`}</a>
        )}
      </div>

      <h1 className="mt-0 mb-16 reveal-from-bottom" data-reveal-delay="200">
              Create price alerts for <span className="text-color-primary">Elrond</span>
            </h1>
      <p className='text-color-primary'>
          
        Current price: {egldPrice}
      </p>

      {/* <p>
        Login with{' '}
        <a
          href="https://chrome.google.com/webstore/detail/maiar-defi-wallet/dngmlblcodfobpdpecaadgfbcggfjfnm"
          target="_blank"
          rel="noopener noreferrer"
        >
          Maiar browser extension
        </a>{' '}
        or{' '}
        <a
          href="https://get.maiar.com/referral/rdmfba3md2"
          target="_blank"
          rel="noopener noreferrer"
        >
          Maiar Mobile app
        </a>{' '}
        and mint the NFT! (max 10 per one address). You can also send a standard
        EGLD transaction on the devnet.{' '}
        <strong>In the end you will get the url to the Elrond explorer.</strong>
      </p> */}
      <p>
        Remember to fund your newly created devnet wallet. You can do this using{' '}
        <a
          href="https://devnet-wallet.elrond.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          devnet web wallet
        </a>{' '}
        and built-in faucet.
      </p>

      <p>
        To compare the functionality, please check a standalone demo hosted on
        Netlify (check the source code):
        <a
          href="https://elvenjs.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://elvenjs.netlify.app/
        </a>
      </p>

      {pending && (
        <div className="centerflex fixed">
          <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}

      <div className="website-link">
        No Elrond wallet?{' '}
        <a
          href="https://get.maiar.com/referral/ci41cl7w64"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sign up to Maiar
        </a>
      </div>

      <div className="footer">
        Made for the Elrond Community by{' '}
        <a href="https://twitter.com/LucianMasca"
        target="_blank"
        rel="noopener noreferrer">@LucianMasca</a>
      </div>
    </div>
  );
};
