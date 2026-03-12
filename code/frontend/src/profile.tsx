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

function Profile({ setPage }: Props) {
  return (
    <>
      <Header setPage={setPage} />
        <div id="titleContainer">
            <span id="title">Moj profil</span>
            <img src="icons/user.png" id="registerIcon" alt="register" />
        </div>
        <div className='formContainer'>
            <form>
             <div className="registerContainer">
                <label className="registerLabel">Email</label>
                <div className="inputWrapper">
                  <input
                    readOnly
                    value="example@gmail.com"
                    className='registerInput'
                    type='email'
                  />
                  <img src="icons/padlock.png" className="inputIcon" alt="lock" />
                </div>
              </div>

                <div className="registerContainer">
                    <label className="registerLabel">Novo geslo*</label>
                    <input
                    className='registerInput'
                    type='password'
                    />
                </div>
                   <div className="registerContainer">
                    <label className="registerLabel">Ponovitev gesla*</label>
                    <input
                    className='registerInput'
                    type='password'
                    />
                </div>
                <div className="registerContainer">
                    <button className="btnSubmit">Spremeni geslo</button>
                </div>
            </form>
        </div>
        <div className="btnWrapper">
            <button className="btnClose" onClick={() => setPage?.("home")}>
          Nazaj
        </button>
            </div>

    </>
  )
}
export default Profile