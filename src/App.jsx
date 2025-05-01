import { useAccount, useConnectModal } from '@reown/appkit/react';
import { appKit } from './reown';
import './styles/App.css';

function App() {
  const { connect } = useConnectModal();
  const { address, solanaAddress } = useAccount();

  const checkAccess = () => {
    const cro = address?.toLowerCase();
    const sol = solanaAddress;

    if (cro === '0x99fd6daaa57ebe7f10ee94e6c1b7522fa2b0d100') return 'Y2K';
    if (sol === 'HQcgVnNacvvjK4ToX8Pcq2bKmD5s32XR6AarQ2EVrrpq') return 'ROAST';
    return null;
  };

  const access = checkAccess();

  return (
    <div className="crt">
      <div className="glitch-overlay"></div>
      <div className="screen">
        <h1>INSERT TOKEN TO ENTER THE ARCADE</h1>
        <div className="buttons">
          {access ? (
            <a href="/lobby.html" className="granted">Access Granted: Enter Arcade</a>
          ) : (
            <button onClick={connect}>Connect Wallet</button>
          )}
        </div>
        <p id="status">
          {access ? '' : (address || solanaAddress) ? 'ACCESS DENIED: No Y2K or ROAST detected.' : ''}
        </p>
      </div>
    </div>
  );
}

export default appKit.withProvider(App);
