const Y2K_TOKEN = "0xB4Df7d2A736Cc391146bB0dF4277E8F68247Ac6d";
const REQUIRED_TOKENS = 4000000;

const updateStatus = (msg) => {
  document.getElementById("status").innerText = msg;
};
const setStatusActive = (id, active) => {
  document.getElementById(id).classList.toggle("active", active);
};
const updateProgress = (percent) => {
  const circle = document.querySelector(".progress-ring-path");
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  circle.style.strokeDashoffset = circumference - (percent / 100) * circumference;
};
const setLoading = (on) => {
  document.querySelector(".verification-container").classList.toggle("loading", on);
};
const formatNumber = (n) => new Intl.NumberFormat().format(n);

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("connectBtn").addEventListener("click", async () => {
    setLoading(true);
    updateStatus("Connecting to wallet...");
    updateProgress(0);
    setStatusActive("connection-status", true);

    try {
      const modal = new window.Web3Modal.default({
        projectId: "36c402e4989b8426f99d329788a526fc",
        chains: ["eip155:25"],
        themeMode: "dark",
        standaloneChains: ["eip155:25"]
      });

      const provider = await modal.connect();
      const [namespace, , address] = provider.accounts[0].split(":");

      if (namespace !== "eip155") {
        updateStatus("Unsupported chain.");
        return;
      }

      updateProgress(33);
      setStatusActive("verification-status", true);
      updateStatus("Verifying wallet...");

      const ethersProvider = new ethers.JsonRpcProvider("https://evm.cronos.org");
      const token = new ethers.Contract(Y2K_TOKEN, ["function balanceOf(address) view returns (uint256)"], ethersProvider);
      const balance = await token.balanceOf(address);
      const y2k = parseFloat(ethers.formatUnits(balance, 18));

      updateProgress(66);
      setStatusActive("token-status", true);
      updateStatus("Checking Y2K balance...");

      if (y2k >= REQUIRED_TOKENS) {
        updateProgress(100);
        updateStatus("Access granted. Welcome to The Vault.");
        setTimeout(() => window.location.href = "vault.html", 1500);
      } else {
        updateStatus(`Access denied – ${formatNumber(REQUIRED_TOKENS)} Y2K required.`);
        setStatusActive("token-status", false);
        updateProgress(66);
      }
    } catch (err) {
      console.error(err);
      updateStatus("Wallet connection failed.");
      setStatusActive("connection-status", false);
      updateProgress(0);
    } finally {
      setLoading(false);
    }
  });
});
