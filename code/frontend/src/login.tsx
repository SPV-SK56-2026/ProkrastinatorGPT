import { useState } from 'react'
import './App.css'
import Header from './header'

const observer = new ResizeObserver(() => {
  window.parent.postMessage({ 
    type: "RESIZE_IFRAME", 
    height: document.body.scrollHeight 
  }, "*");
});
observer.observe(document.body);

interface Props {
  setPage?: (page: string) => void;
  setUser?: (user: any) => void;
}

function Login({ setPage, setUser }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://prokrastinatorgpt.ddns.net:5050/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        if (setUser) setUser(data.user);
        
        setLoginSuccess(true);

        setTimeout(() => {
          setPage?.("home");
          window.location.reload();
        }, 2000);

      } else {
        alert('Napačni podatki za prijavo.');
      }
    } catch (error) {
      console.error(error);
      alert('Strežnik ni dosegljiv.');
    } finally {
      setLoading(false);
    }
  };

  if (loginSuccess) {
    return (
      <div className="successOverlay">
        <div className="successContent">
          <img src="icons/check.png" alt="Success" className="successIcon" />
          <h2>Uspešna prijava!</h2>
          <p>Preusmerjanje na glavno stran...</p>
        </div>
      </div>
    );
  }

  return (
    <>
        <Header setPage={setPage} />
        <div id="titleContainer">
            <span id="title">Prijava</span>
            <img src="icons/login.png" id="registerIcon" alt="register" />
        </div>
        <div className='formContainer'>
            <form onSubmit={handleLogin}>
                <div className="registerContainer">
                    <label className="registerLabel">Email</label>
                    <input
                      className='registerInput'
                      type='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                </div>

                <div className="registerContainer">
                    <label className="registerLabel">Geslo</label>
                    <input
                      className='registerInput'
                      type='password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                </div>
                
                <div className="registerContainer">
                    <button type="submit" className="btnSubmit" disabled={loading}>
                      {loading ? 'Prijavljanje...' : 'Prijava'}
                    </button>
                    <div className="linksContainer">
                        <a href='#' className='linkToRegister' onClick={() => setPage?.("register")}>
                          Še nimaš računa? Registriraj se
                        </a>
                    </div>
                </div>
            </form>
        </div>
        <div className="btnWrapper">
            <button
                className="btnClose"
                onClick={() => window.parent.postMessage({ type: "CLOSE_IFRAME" }, "*")}
            >
                Zapri
            </button>
        </div>
    </>
  )
}
export default Login
