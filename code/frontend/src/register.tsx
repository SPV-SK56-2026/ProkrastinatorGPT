//import { useState } from 'react'
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
  return (
    <>
      <Header setPage={setPage} />
        <div id="titleContainer">
            <span id="title">Registracija</span>
            <img src="icons/register.png" id="registerIcon" alt="register" />
        </div>
        <div className='formContainer'>
            <form>
                <div className="registerContainer">
                    <label className="registerLabel">Email</label>
                    <input
                    className='registerInput'
                    type='email'
                    />
                </div>

                <div className="registerContainer">
                    <label className="registerLabel">Geslo</label>
                    <input
                    className='registerInput'
                    type='password'
                    />
                </div>
                
                <div className="registerContainer">
                    <button className="btnSubmit">Registracija</button>
                    <a
                    href='#' onClick={() => setPage?.("login")} 
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