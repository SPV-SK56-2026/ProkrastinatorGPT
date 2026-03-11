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

function Register(){
    const params = new URLSearchParams(window.location.search);
    const noAssignment = params.get("noAssignment");

    if (noAssignment) {
      return (
        <>
          <Header />
          <div className="titleContainer">
            Odpri katero koli nalogo na Moodle, da vidiš podrobnosti.
          </div>
          <div className="btnWrapper">
            <button className="btnClose" onClick={() => window.parent.postMessage({ type: "CLOSE_IFRAME" }, "*")}>
              Zapri
            </button>
          </div>
        </>
      );
  }
  return (
    <>
        <Header />
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
                    href='#'
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