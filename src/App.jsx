import { appKit } from './reown';
import './styles/App.css';

function App() {
  const connect = appKit.connect;
  const account = appKit.getAccount();
  const cro = account?.address?.toLowerCase();
  const sol = account?.solanaAddress;

  const checkAccess = () => {
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
            <button onClick={() => connect()}>Connect Wallet</button>
          )}
        </div>
        <p id="status">
          {access
            ? ''
            : cro || sol
            ? 'ACCESS DENIED: No Y2K or ROAST detected.'
            : 'No wallet connected. Please tap Connect Wallet above.'}
        </p>

        <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#0ff' }}>
          <p><strong>Debug:</strong></p>
          <p>CRO: {cro || '—'}</p>
          <p>SOL: {sol || '—'}</p>
        </div>
      </div>
    </div>
  );
}

export default appKit.withProvider(App);
