const Y2K_TOKEN = "0xB4Df7d2A736Cc391146bB0dF4277E8F68247Ac6d";
const ROAST_MINT = "A6db9o4y5phC5ncSdM8pQKmWanodxLyXgwxuVCuA4ray";
const SOLANA_RPC = "https://thrilling-old-sailboat.solana-mainnet.quiknode.pro/7eeaf93b8ff0a17a6172d1a57f8bf43c81d164a0";

async function showConnectModal() {
  const modal = new window.WalletConnectModal.default({
    projectId: "y2k-arcade", // You can set a real WalletConnect v2 project ID later
    chains: ["eip155:25", "solana:mainnet"],
    themeMode: "dark",
    explorerExcluded: true,
    standaloneChains: ["solana:mainnet"],
  });

  const provider = await modal.connect();

  if (provider.accounts && provider.accounts.length > 0) {
    const account = provider.accounts[0].split(":")[2];
    const chain = provider.accounts[0].split(":")[0];

    if (chain === "eip155") {
      checkY2KBalance(account);
    } else if (chain === "solana") {
      checkROASTBalance(account);
    } else {
      document.getElementById("status").innerText = "Unsupported chain.";
    }
  } else {
    document.getElementById("status").innerText = "No wallet selected.";
  }
}

async function checkY2KBalance(address) {
  const provider = new ethers.JsonRpcProvider("https://evm.cronos.org");

  const token = new ethers.Contract(Y2K_TOKEN, [
    "function balanceOf(address) view returns (uint256)"
  ], provider);

  const balance = await token.balanceOf(address);
  const readable = parseFloat(ethers.formatUnits(balance, 18));

  if (readable > 0) {
    grantAccess("Y2K");
  } else {
    denyAccess();
  }
}

async function checkROASTBalance(pubKey) {
  const conn = new solanaWeb3.Connection(SOLANA_RPC);
  const tokenAccounts = await conn.getParsedTokenAccountsByOwner(
    new solanaWeb3.PublicKey(pubKey),
    { programId: new solanaWeb3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") }
  );

  const hasToken = tokenAccounts.value.some(
    (acc) =>
      acc.account.data.parsed.info.mint === ROAST_MINT &&
      parseInt(acc.account.data.parsed.info.tokenAmount.amount) > 0
  );

  if (hasToken) {
    grantAccess("ROAST");
  } else {
    denyAccess();
  }
}

function grantAccess(token) {
  document.getElementById("status").innerText = `Access Granted (${token}). Redirecting...`;
  setTimeout(() => {
    window.location.href = "/lobby.html";
  }, 1500);
}

function denyAccess() {
  document.getElementById("status").innerText = "ACCESS DENIED. No Y2K or ROAST found.";
}
