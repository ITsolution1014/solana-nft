import { makeStyles } from "@material-ui/core/styles";
import backgroundImg from "../../assets/background.jpg";
export const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    width: "auto",
    height: "70px",
    backgroundColor: "#16151a",
    borderBottom: "1px solid #222227",
    zindex: "101",
    padding: "0 50px",
    alignItems: "center",
  },

  header_logo: {
    display: "inline-flex",
    fontFamily: "Press Start 2P",
    flexDirection: "row",
    color: "white",
    justifyContent: "flex-start",
    alignItems: "center",
    fontSize: "larger",
    height: "40px",
  },
  connetBtn: {
    display: "flex",
    background: "none !important",
    boxShadow: "none !important",
  },
  p0: {
    padding: 0,
  },
  m0: {
    margin: 0,
  },
  connectTextUpper: {
    margin: 0,
    lineHeight: "22px",
    fontSize: "14px",
    fontWeight: 500,
  },
  connectTextLower: {
    margin: 0,
    lineHeight: "18px",
    fontSize: "12px",
    color: "#bdbdbd",
  },
  avatarImg: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    margin: "0 6px 0 6px",
  },
  "@media (max-width: 592px)": {
    avatarImg: {
      display: "none",
    },
    header: {
      padding: "0 20px",
    },
  },
  connectText: {
    display: "flex",
    flexDirection: "column",
    marginRight: "6px",
  },
  home: {
    marginTop: "70px",
    background: `url("${backgroundImg}") no-repeat bottom center/cover`,
    minHeight: "400px",
  },
  container: {
    width: "80%",
    margin: "auto",
  },
  bgColor: {
    backgroundColor: "#16151a",
    minHeight: `calc(100vh - 70px)`,
  },
  marginTitle: {
    margin: "5rem 0 3rem 0",
    textAlign: "center",
  },
  topDivider: {
    borderTop: "1px solid #222227",
  },
  gettingTitle: {
    margin: "5rem 0 3rem 0",
    textAlign: "center",
  },
  mb2: {
    marginBottom: "2rem",
  },
  mr1: {
    marginRight: "1rem",
  },
  connectBtn: {
    margin: "auto",
    display: "flex",
    width: "15rem",
    justifyContent: "center",
    fontSize: "1.5rem",
    backgroundColor: "#1935cd",
    color: "#fff",
    
  },
  mintBtn: {
    margin: "auto",
    display: "flex",
    width: "15rem",
    justifyContent: "center",
    fontSize: "1.5rem",
    backgroundColor: "#1935cd",
    color: "#fff",
    "& > :hover": {
        color: "#1935cd",
    },
  },

  remainItems: {
    justifyContent: "center",
    diplay: "flex",
    textAlign: "center",
    margin: "2rem",
  },
  p3: {
    padding: "3rem",
  },
  m3: {
    margin: "3rem",
  },
  mt3: {
    marginTop: "3rem",
  },
  mt2: {
    marginTop: "2rem",
  },
  mt1: {
    marginTop: "1rem",
  },
  item: {
    padding: "10px",
    background: "#27184c",
    borderRadius: "12px",
    marginRight: "1rem",
  },
  footer: {
    backgroundColor: "#222227",
    padding: "3rem",
  },
  p1: {
    padding: "1rem",
  },
  poppins: {
    fontFamily: "Poppins",
    color: "#bdbdbd",
  },
  press: {
    fontFamily: "'Press Start 2P', cursive",
  },
}));
