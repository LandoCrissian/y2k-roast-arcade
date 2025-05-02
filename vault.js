// CONFIG
const Y2K_TOKEN = "0xB4Df7d2A736Cc391146bB0dF4277E8F68247Ac6d";
const CRO_BOOST_COST = 40;
const Y2K_SQUARE_COST = 100_000;
const Y2K_DECIMALS = 18;
const providerUrl = "https://evm.cronos.org";

let userAddress = "";
let nickname = "";

// Wallet Connect
window.onload = async () => {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    userAddress = accounts[0];
  } else {
    alert("Wallet not found. Use a Web3-enabled browser.");
  }

  document.getElementById("buySquare").onclick = buySquare;
  document.getElementById("buyBoost").onclick = buyBoost;
  document.getElementById("shareVault").onclick = shareVault;
  nickname = document.getElementById("nicknameInput").value;
};

// Simulate Firebase interaction placeholders
let potY2K = 0;
let potCRO = 0;
let squareCount = 0;
const players = {}; // mock leaderboard data

function buySquare() {
  potY2K += Y2K_SQUARE_COST;
  squareCount++;
  updatePot();
  updateBoard();
  updateLeaderboard(userAddress, "Y2K");
}

function buyBoost() {
  potCRO += CRO_BOOST_COST;
  updatePot();
  updateLeaderboard(userAddress, "CRO");
}

function updatePot() {
  document.getElementById("potY2K").innerText = potY2K.toLocaleString() + " Y2K";
  document.getElementById("potCRO").innerText = "+ " + potCRO.toLocaleString() + " CRO Boosts";
}

function updateBoard() {
  const board = document.getElementById("squaresBoard");
  const square = document.createElement("div");
  square.className = "square";
  square.innerText = nickname || shorten(userAddress);
  board.appendChild(square);
}

function updateLeaderboard(address, type) {
  if (!players[address]) {
    players[address] = {
      name: nickname || shorten(address),
      y2k: 0,
      cro: 0
    };
  }

  if (type === "Y2K") players[address].y2k += Y2K_SQUARE_COST;
  if (type === "CRO") players[address].cro += CRO_BOOST_COST;

  const leaderList = document.getElementById("leaderList");
  leaderList.innerHTML = "";

  const sorted = Object.entries(players).sort(([, a], [, b]) => {
    return (b.y2k + b.cro) - (a.y2k + a.cro);
  });

  sorted.forEach(([addr, data]) => {
    const item = document.createElement("li");
    item.innerText = `${data.name} — ${data.y2k.toLocaleString()} Y2K | ${data.cro} CRO`;
    leaderList.appendChild(item);
  });
}

function shareVault() {
  const tweetText = `The Vault is open. Current pot: ${potY2K.toLocaleString()} Y2K + ${potCRO} CRO\n` +
                    `Buy a square. Boost your odds. Win it all.\n` +
                    `https://vault.y2kcoin.org\n\n` +
                    `#Y2KCoin #Y2KxRoast #Crofam #RoastFam #Cronos #Web3Gambling`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
  window.open(twitterUrl, '_blank');
}

function shorten(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}
