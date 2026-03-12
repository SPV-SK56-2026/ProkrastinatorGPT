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

function Login({ setPage }: Props) {
  return (
    <>
        <Header setPage={setPage} />
        <div id="titleContainer">
            <span id="title">Prijava</span>
            <img src="icons/login.png" id="registerIcon" alt="register" />
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
                    <button className="btnSubmit">Prijava</button>
                    <div className="linksContainer">
                        <a
                        href='#'
                        className='linkToRegister'
                          onClick={() => setPage?.("register")} >
                          
                        Še nimaš računa? Registriraj se
                        </a>
                        <a
                        href='#'
                        className='linkToPassChange'
                         onClick={() => setPage?.("forgot")} >
                        Pozabljeno geslo?
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