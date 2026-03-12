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
}

function Register({ setPage }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // register z api
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Prepreči osveževanje strani
    setLoading(true);

    try {
      const response = await fetch('http://prokrastinatorgpt.ddns.net:5050/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        alert('Registracija uspešna! Zdaj se lahko prijaviš.');
        setPage?.("login"); // Preusmeritev na login
      } else {
        const errorData = await response.json();
        alert(`Napaka: ${errorData.message || 'Registracija ni uspela'}`);
      }
    } catch (error) {
      console.error('Napaka pri registraciji:', error);
      alert('Strežnik ni dosegljiv.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header setPage={setPage} />
      <div id="titleContainer">
          <span id="title">Registracija</span>
          <img src="icons/register.png" id="registerIcon" alt="register" />
      </div>
      <div className='formContainer'>
          {/* Povezava obrazca s funkcijo handleRegister */}
          <form onSubmit={handleRegister}>
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
                    {loading ? 'Ustvarjanje...' : 'Registracija'}
                  </button>
                  <a
                    href='#' 
                    onClick={() => setPage?.("login")} 
                    className='linkToLogin'>
                    Že imaš račun? Prijavi se
                  </a>
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
export default Register
