import { useEffect, useState } from "react";
import styled from "styled-components";
import Countdown from "react-countdown";
import {
  Button,
  CircularProgress,
  Snackbar,
  Box,
  Grid,
  Typography,
  Divider,
} from "@material-ui/core";
import clsx from "clsx";
import Alert from "@material-ui/lab/Alert";

import * as anchor from "@project-serum/anchor";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";
import { useStyles } from "./styles";
import avatarImg from "../../assets/avatar.jpg";
import {
  CandyMachine,
  awaitTransactionSignatureConfirmation,
  getCandyMachineState,
  mintOneToken,
  shortenAddress,
} from "./candy-machine";

const CounterText = styled.span``; // add your styles here

const MintContainer = styled.div``; // add your styles here

const MintButton = styled(Button)``; // add your styles here

export interface HomeProps {
  candyMachineId: anchor.web3.PublicKey;
  config: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  startDate: number;
  treasury: anchor.web3.PublicKey;
  txTimeout: number;
}

const Home = (props: HomeProps) => {
  const classes = useStyles();
  const [balance, setBalance] = useState<number>();
  const [isActive, setIsActive] = useState(false); // true when countdown completes
  const [isSoldOut, setIsSoldOut] = useState(false); // true when items remaining is zero
  const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const [startDate, setStartDate] = useState(new Date(props.startDate));

  const wallet = useAnchorWallet();
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();
  const [itemRemaining, setItemRemaining] = useState(0);
  const onMint = async () => {
    try {
      setIsMinting(true);
      if (wallet && candyMachine?.program) {
        const mintTxId = await mintOneToken(
          candyMachine,
          props.config,
          wallet.publicKey,
          props.treasury
        );

        const status = await awaitTransactionSignatureConfirmation(
          mintTxId,
          props.txTimeout,
          props.connection,
          "singleGossip",
          false
        );

        if (!status?.err) {
          setAlertState({
            open: true,
            message: "Congratulations! Mint succeeded!",
            severity: "success",
          });
        } else {
          setAlertState({
            open: true,
            message: "Mint failed! Please try again!",
            severity: "error",
          });
        }
      }
    } catch (error: any) {
      // TODO: blech:
      let message = error.msg || "Minting failed! Please try again!";
      if (!error.msg) {
        if (error.message.indexOf("0x138")) {
        } else if (error.message.indexOf("0x137")) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf("0x135")) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          setIsSoldOut(true);
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      if (wallet) {
        const balance = await props.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
      setIsMinting(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (wallet) {
        const balance = await props.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    })();
  }, [wallet, props.connection]);

  useEffect(() => {
    (async () => {
      if (!wallet) return;

      const { candyMachine, goLiveDate, itemsRemaining } =
        await getCandyMachineState(
          wallet as anchor.Wallet,
          props.candyMachineId,
          props.connection
        );

      setIsSoldOut(itemsRemaining === 0);
      setStartDate(goLiveDate);
      setCandyMachine(candyMachine);
      setItemRemaining(itemsRemaining);
    })();
  }, [wallet, props.candyMachineId, props.connection]);

  return (
    <main className={classes.bgColor}>
      <Box className={classes.header}>
        <Box className={clsx(classes.header_logo,classes.press)}>DegenPunks</Box>
        <Box>
          {!wallet ? (
            <WalletDialogButton className={classes.connetBtn}>
              <img
                className={classes.avatarImg}
                src={avatarImg}
                alt="avatar"
              ></img>
              <Box className={classes.connectText}>
                <p className={classes.connectTextUpper}>Not connected</p>
                <p className={classes.connectTextLower}>Click to Connect</p>
              </Box>
            </WalletDialogButton>
          ) : (
            <Box className={classes.connetBtn}>
              <img
                className={classes.avatarImg}
                src={avatarImg}
                alt="avatar"
              ></img>
              <Box className={classes.connectText}>
                <p className={classes.connectTextUpper}>Connected</p>
                <p className={classes.connectTextLower}>
                  {(balance || 0).toLocaleString()} SOL
                </p>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      <Box className={classes.home}>
        <Box display="flex" justifyContent="center" padding="4rem">

        <Typography variant="h4" className={classes.press}>DegenTrunks</Typography>
        </Box>
      </Box>
      <Box className={classes.container}>
        <Grid container>
          {/* <Grid xs={12} className={classes.marginTitle}>
            <Typography variant="h3">Buy NFT</Typography>
          </Grid> */}
          <Grid xs={12} item className={classes.marginTitle}>
            <Typography variant="h4">
              These are generative NFTs that use oracles to create a specialized
              NFT just for you.
            </Typography>
          </Grid>
          <Grid xs={12} item>
            <MintContainer>
              {!wallet ? (
                <WalletDialogButton className={classes.connectBtn}>
                  Connect Wallet
                </WalletDialogButton>
              ) : (
                <MintButton
                  className={classes.mintBtn}
                  disabled={isSoldOut || isMinting || !isActive}
                  onClick={onMint}
                  variant="contained"
                >
                  {isSoldOut ? (
                    "SOLD OUT"
                  ) : isActive ? (
                    isMinting ? (
                      <CircularProgress />
                    ) : (
                      "MINT"
                    )
                  ) : (
                    <Countdown
                      date={startDate}
                      onMount={({ completed }) =>
                        completed && setIsActive(true)
                      }
                      onComplete={() => setIsActive(true)}
                      renderer={renderCounter}
                    />
                  )}
                </MintButton>
              )}
            </MintContainer>
          </Grid>
          <Grid xs={12} item className={classes.remainItems}>
            {wallet && (
              <Typography variant="h4">
                Remaining items: {itemRemaining} / 31{" "}
              </Typography>
            )}
          </Grid>
        </Grid>
        <Grid container className={classes.topDivider}>
          <Grid item xs={12} className={classes.gettingTitle}>
            <Typography variant="h4">Getting your NFTs</Typography>
          </Grid>
          <Grid item md={6} className={classes.p3}>
            <Box display="flex" alignItems="center">
              <Box width="30px" height="30px" className={classes.item}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    fill="#6164ff"
                    d="M19,7H18V6a3,3,0,0,0-3-3H5A3,3,0,0,0,2,6H2V18a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V10A3,3,0,0,0,19,7ZM5,5H15a1,1,0,0,1,1,1V7H5A1,1,0,0,1,5,5ZM20,15H19a1,1,0,0,1,0-2h1Zm0-4H19a3,3,0,0,0,0,6h1v1a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V8.83A3,3,0,0,0,5,9H19a1,1,0,0,1,1,1Z"
                  ></path>
                </svg>
              </Box>
              <Typography variant="h5">Set up your wallet</Typography>
            </Box>
            <Box className={clsx(classes.mt2, classes.poppins)}>
              <Typography variant="h6">
                Once you’ve set up your wallet of choice, connect it to NFT
                platform by clicking NOT CONNECTED in the header.
              </Typography>
            </Box>
          </Grid>
          <Grid item md={6} className={classes.p3}>
            <Box display="flex" alignItems="center">
              <Box width="30px" height="30px" className={classes.item}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    fill="#6164ff"
                    d="M22.71,6.29a1,1,0,0,0-1.42,0L20,7.59V2a1,1,0,0,0-2,0V7.59l-1.29-1.3a1,1,0,0,0-1.42,1.42l3,3a1,1,0,0,0,.33.21.94.94,0,0,0,.76,0,1,1,0,0,0,.33-.21l3-3A1,1,0,0,0,22.71,6.29ZM19,13a1,1,0,0,0-1,1v.38L16.52,12.9a2.79,2.79,0,0,0-3.93,0l-.7.7L9.41,11.12a2.85,2.85,0,0,0-3.93,0L4,12.6V7A1,1,0,0,1,5,6h8a1,1,0,0,0,0-2H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V14A1,1,0,0,0,19,13ZM5,20a1,1,0,0,1-1-1V15.43l2.9-2.9a.79.79,0,0,1,1.09,0l3.17,3.17,0,0L15.46,20Zm13-1a.89.89,0,0,1-.18.53L13.31,15l.7-.7a.77.77,0,0,1,1.1,0L18,17.21Z"
                  ></path>
                </svg>
              </Box>
              <Typography variant="h5">Mint your NFTs</Typography>
            </Box>
            <Box className={clsx(classes.mt2, classes.poppins)}>
              <Typography variant="h6">
                Click on Connected in the header and select Mint. Click your
                NFT.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box className={classes.footer}>
        <Grid container>
          <Grid md={4}>
            <img
              className={classes.avatarImg}
              src={avatarImg}
              alt="avatar"
            ></img>
            <Typography
              variant="body1"
              className={clsx(classes.p1, classes.poppins)}
            >
              NFT Marketplace for buying and selling all NFT tokens. DegenPunks
              is in no way affiliated with Larva Labs and/or CryptoPunks,
              PolyPunks, CryptoPhunks, CovidPunks, ShitPunks, SolPunks,
              ThetaPunks.
            </Typography>
          </Grid>
          <Grid md={4}></Grid>
          <Grid md={4}></Grid>
        </Grid>
      </Box>
      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={() => setAlertState({ ...alertState, open: false })}
      >
        <Alert
          onClose={() => setAlertState({ ...alertState, open: false })}
          severity={alertState.severity}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </main>
  );
};

interface AlertState {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error" | undefined;
}

const renderCounter = ({ days, hours, minutes, seconds, completed }: any) => {
  return (
    <CounterText>
      {hours} hours, {minutes} minutes, {seconds} seconds
    </CounterText>
  );
};

export default Home;
