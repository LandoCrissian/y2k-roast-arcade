const Y2K_TOKEN = "0xB4Df7d2A736Cc391146bB0dF4277E8F68247Ac6d";
const ROAST_MINT = "A6db9o4y5phC5ncSdM8pQKmWanodxLyXgwxuVCuA4ray";
const SOLANA_RPC = "https://thrilling-old-sailboat.solana-mainnet.quiknode.pro/7eeaf93b8ff0a17a6172d1a57f8bf43c81d164a0";

window.addEventListener("DOMContentLoaded", () => {
  const connectButton = document.getElementById("connectBtn");

  if (!connectButton) {
    console.error("Connect button not found!");
    return;
  }

  connectButton.addEventListener("click", async () => {
    try {
      const modal = new window.Web3Modal.default({
        projectId: "36c402e4989b8426f99d329788a526fc",
        chains: ["eip155:25", "solana:mainnet"],
        themeMode: "dark",
        explorerExcluded: true,
        standaloneChains: ["solana:mainnet"],
      });

      const provider = await modal.connect();

      if (provider.accounts && provider.accounts.length > 0) {
        const [namespace, , account] = provider.accounts[0].split(":");

        if (namespace === "eip155") {
          checkY2KBalance(account);
        } else if (namespace === "solana") {
          checkROASTBalance(account);
        } else {
          setStatus("Unsupported chain.");
        }
      } else {
        setStatus("No wallet selected.");
      }
    } catch (error) {
      console.error("Modal connection failed:", error);
      setStatus("WalletConnect error.");
    }
  });
});

function setStatus(msg) {
  const status = document.getElementById("status");
  if (status) status.innerText = msg;
}

async function checkY2KBalance(address) {
  try {
    const provider = new ethers.JsonRpcProvider("https://evm.cronos.org");
    const token = new ethers.Contract(Y2K_TOKEN, [
      "function balanceOf(address) view returns (uint256)"
    ], provider);

    const balance = await token.balanceOf(address);
    const readable = parseFloat(ethers.formatUnits(balance, 18));
    readable > 0 ? grantAccess("Y2K") : denyAccess();
  } catch (err) {
    console.error(err);
    setStatus("Error checking Y2K balance.");
  }
}

async function checkROASTBalance(pubKey) {
  try {
    const conn = new solanaWeb3.Connection(SOLANA_RPC);
    const tokenAccounts = await conn.getParsedTokenAccountsByOwner(
      new solanaWeb3.PublicKey(pubKey),
      {
        programId: new solanaWeb3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      }
    );

    const hasToken = tokenAccounts.value.some(
      (acc) =>
        acc.account.data.parsed.info.mint === ROAST_MINT &&
        parseInt(acc.account.data.parsed.info.tokenAmount.amount) > 0
    );

    hasToken ? grantAccess("ROAST") : denyAccess();
  } catch (err) {
    console.error(err);
    setStatus("Error checking ROAST balance.");
  }
}

function grantAccess(token) {
  setStatus(`Access Granted (${token}). Redirecting...`);
  setTimeout(() => {
    window.location.href = "/lobby.html";
  }, 1500);
}

function denyAccess() {
  setStatus("ACCESS DENIED. No Y2K or ROAST found.");
}
