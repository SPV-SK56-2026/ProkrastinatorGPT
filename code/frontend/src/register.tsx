import { useState } from 'react'
import './App.css'
import LayoutWrapper from './components/LayoutWrapper'
import PageHeader from './components/PageHeader'
import FormInput from './components/FormInput'
import PrimaryButton from './components/PrimaryButton'
import { useIcon } from './useTheme';

interface Props {
  setPage?: (page: string) => void;
}

function Register({ setPage }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const icon = useIcon();
  const params = new URLSearchParams(window.location.search);
  const noAssignment = params.get("noAssignment");

  const isPasswordValid = (pwd: string) => {
    return (
      pwd.length >= 8 &&
      /[A-Z]/.test(pwd) &&
      /[0-9]/.test(pwd) &&
      /[.,?!#%=@]/.test(pwd)
    );
  };

  const isFormValid = email.trim() !== '' && isPasswordValid(password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('https://www.goprokrastinator.org/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        alert('Registracija uspešna! Zdaj se lahko prijaviš.');
        setPage?.("login");
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
    <LayoutWrapper isNoAssignment={!!noAssignment} setPage={setPage}>
      <PageHeader title="Registracija" iconSrc={icon("register")} iconId="registerIcon" />
      <div className='formContainer'>
        <form onSubmit={handleRegister}>
          <FormInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <FormInput 
          label="Geslo"
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          style={password && !isPasswordValid(password) ? { border: '2px solid red', color: 'red' } : {}}
          />
          {password && !isPasswordValid(password) && (
            <div style={{ color: 'red', fontSize: '0.8rem', margin: '4px 0 8px 0' }}>
              <strong>Geslo ni veljavno:</strong>
              <ul style={{ paddingLeft: '1.2rem', margin: '4px 0' }}>
                {password.length < 8 && <li>Vsaj 8 znakov</li>}
                {!/[A-Z]/.test(password) && <li>Vsaj ena velika črka</li>}
                {!/[0-9]/.test(password) && <li>Vsaj ena številka</li>}
                {!/[.,?!#%=@]/.test(password) && <li>Vsaj en poseben znak (. , ? ! # % =)</li>}
              </ul>
            </div>
          )}
          <div className="registerContainer">
            <PrimaryButton disabled={loading || !isFormValid}>
              {loading ? 'Ustvarjanje...' : 'Registracija'}
            </PrimaryButton>
            <a href='#' className='linkToLogin' onClick={() => setPage?.("login")}>
              Že imaš račun? Prijavi se
            </a>
          </div>
        </form>
      </div>
    </LayoutWrapper>
  )
}
export default Register