import { useState } from 'react'
import './App.css'
import LayoutWrapper from './components/LayoutWrapper'
import PageHeader from './components/PageHeader'
import FormInput from './components/FormInput'
import PrimaryButton from './components/PrimaryButton'
import { useIcon } from './useTheme';
import type { User } from './types';

const observer = new ResizeObserver(() => {
  window.parent.postMessage({ 
    type: "RESIZE_IFRAME", 
    height: document.body.scrollHeight 
  }, "*");
});
observer.observe(document.body);

interface Props {
  setPage?: (page: string) => void;
  setUser?: (user: User | null) => void;
}

function Login({ setPage, setUser }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const icon = useIcon();
  const params = new URLSearchParams(window.location.search);
  const noAssignment = params.get("noAssignment");

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('https://www.goprokrastinator.org/users/login', {
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
        alert('Napaka pri prijavi. Preveri podatke.');
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
    <LayoutWrapper isNoAssignment={!!noAssignment} setPage={setPage}>
      <PageHeader title="Prijava" iconSrc={icon("login")} iconId="registerIcon" />
      <div className='formContainer'>
        <form onSubmit={handleLogin}>
          <FormInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <FormInput label="Geslo" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="registerContainer">
            <PrimaryButton disabled={loading || !isFormValid}>
              {loading ? 'Prijavljanje...' : 'Prijava'}
            </PrimaryButton>
            <div className="linksContainer">
              <a href='#' className='linkToRegister' onClick={() => setPage?.("register")}>
                Še nimaš računa? Registriraj se
              </a>
              <a href='#' className='linkToPassChange' onClick={() => setPage?.("forgot")}>
                Pozabljeno geslo?
              </a>
            </div>
          </div>
        </form>
      </div>
    </LayoutWrapper>
  )
}

export default Login