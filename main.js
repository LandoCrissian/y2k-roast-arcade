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

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
}

html, body {
  background-color: #000;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.background {
  position: fixed;
  inset: 0;
  z-index: -1;
  background: linear-gradient(45deg, #000, #1a1a1a);
}

.gradient-sphere {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 600px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle at center,
    rgba(99, 102, 241, 0.15) 0%,
    rgba(99, 102, 241, 0.1) 20%,
    rgba(99, 102, 241, 0.05) 40%,
    transparent 70%);
  filter: blur(40px);
  animation: pulse 15s ease-in-out infinite;
  border-radius: 50%;
}

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.1); }
}

.container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  z-index: 1;
}

.glass-card {
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 32px;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 4px 24px rgba(0,0,0,0.2);
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  font-size: 28px;
  font-weight: 600;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 14px;
  color: rgba(255,255,255,0.6);
  letter-spacing: 2px;
}

.verification-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}

.verification-ring {
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 24px;
}

.progress-ring-circle,
.progress-ring-path {
  transition: stroke-dashoffset 0.35s;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  stroke-dasharray: 326.7256;
  stroke-dashoffset: 326.7256;
}

.progress-ring-circle {
  stroke: #ffffff20;
}

.progress-ring-path {
  stroke: url(#gradient);
  stroke: #6366f1;
}

.verification-status {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 48px;
  height: 48px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translate(-50%, -50%);
}

.lock-icon {
  fill: rgba(255,255,255,0.8);
}

.amount {
  font-size: 32px;
  font-weight: 600;
  background: linear-gradient(135deg, #ffffff, #a5b4fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.token {
  font-size: 14px;
  color: rgba(255,255,255,0.6);
  letter-spacing: 1px;
}

.status-container {
  margin-bottom: 32px;
}

.status-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  margin-right: 12px;
}

.status-item.active {
  background: rgba(99, 102, 241, 0.1);
}

.status-item.active .status-dot {
  background: #6366f1;
  box-shadow: 0 0 12px rgba(99,102,241,0.5);
}

.status-item span {
  font-size: 14px;
  color: rgba(255,255,255,0.8);
}

.connect-button {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}

.connect-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99,102,241,0.3);
}

.button-text {
  margin-right: 8px;
}

.status-message {
  text-align: center;
  min-height: 20px;
  font-size: 14px;
  color: rgba(255,255,255,0.8);
  margin-top: 12px;
}

.loading .verification-status {
  animation: pulse 1.5s infinite;
}
