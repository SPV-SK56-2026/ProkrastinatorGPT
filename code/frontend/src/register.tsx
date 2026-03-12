import { useState } from 'react'
import './App.css'
import LayoutWrapper from './components/LayoutWrapper'
import PageHeader from './components/PageHeader'
import FormInput from './components/FormInput'
import PrimaryButton from './components/PrimaryButton'

function Register(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const params = new URLSearchParams(window.location.search);
    const noAssignment = params.get("noAssignment");

  return (
    <LayoutWrapper isNoAssignment={!!noAssignment}>
        <PageHeader 
            title="Registracija" 
            iconSrc="icons/register.png" 
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
                    <PrimaryButton>Registracija</PrimaryButton>
                    <a
                    href='#'
                    className='linkToLogin'>
                    Že imaš račun? Prijavi se
                    </a>
                </div>
            </form>
        </div>
    </LayoutWrapper>
  )
}
export default Register