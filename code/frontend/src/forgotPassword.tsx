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

function ForgotPassword({ setPage }: Props) {
  return (
    <>
        <Header setPage={setPage} />
        <div id="titleContainer">
            <span id="title">Pozabljeno geslo</span>
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
                    <button className="btnSubmit">Pošlji</button>
                </div>
            </form>
        </div>
        <div className="btnWrapper">
            <button
                className="btnClose"
               onClick={() => setPage?.("login")} 
            >
                Nazaj
            </button>
            </div>

    </>
  )
}
export default ForgotPassword