import { useState } from 'react'
import './App.css'
import LayoutWrapper from './components/LayoutWrapper'
import PageHeader from './components/PageHeader'
import FormInput from './components/FormInput'
import PrimaryButton from './components/PrimaryButton'

interface Props {
  setPage?: (page: string) => void;
}

function Login({ setPage }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const params = new URLSearchParams(window.location.search);
  const noAssignment = params.get("noAssignment");

  return (
    <LayoutWrapper isNoAssignment={!!noAssignment} setPage={setPage}>
      <PageHeader 
        title="Prijava" 
        iconSrc="icons/login.png" 
        iconId="registerIcon" 
      />
      <div className='formContainer'>
        <form onSubmit={(e) => e.preventDefault()}>
          <FormInput 
            label="Email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <FormInput 
            label="Geslo" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <div className="registerContainer">
            <PrimaryButton>Prijava</PrimaryButton>
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