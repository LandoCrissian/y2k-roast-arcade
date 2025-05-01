const CRO_TOKEN_ADDRESS = "0xB4Df7d2A736Cc391146bB0dF4277E8F68247Ac6d";
const ROAST_TOKEN_MINT = "A6db9o4y5phC5ncSdM8pQKmWanodxLyXgwxuVCuA4ray";

async function connectMetaMask() {
  if (typeof window.ethereum === 'undefined') {
    alert("MetaMask not found.");
    return;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  const tokenContract = new ethers.Contract(CRO_TOKEN_ADDRESS, [
    "function balanceOf(address) view returns (uint256)"
  ], provider);

  const balance = await tokenContract.balanceOf(address);
  if (parseFloat(ethers.formatUnits(balance, 18)) > 0) {
    document.getElementById("status").innerText = "Access Granted. Redirecting...";
    window.location.href = "/lobby.html";
  } else {
    document.getElementById("status").innerText = "Access Denied. No Y2K in wallet.";
  }
}

async function connectPhantom() {
  if (!window.solana || !window.solana.isPhantom) {
    alert("Phantom Wallet not found.");
    return;
  }

  const resp = await window.solana.connect();
  const walletAddress = resp.publicKey.toString();

  const connection = new solanaWeb3.Connection("https://api.mainnet-beta.solana.com");
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
    new solanaWeb3.PublicKey(walletAddress),
    { programId: new solanaWeb3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") }
  );

  const hasRoast = tokenAccounts.value.some(
    (account) => account.account.data.parsed.info.mint === ROAST_TOKEN_MINT &&
                 parseInt(account.account.data.parsed.info.tokenAmount.amount) > 0
  );

  if (hasRoast) {
    document.getElementById("status").innerText = "Access Granted. Redirecting...";
    window.location.href = "/lobby.html";
  } else {
    document.getElementById("status").innerText = "Access Denied. No ROAST in wallet.";
  }
}
