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

function ChangePassword({ setPage }: Props) {
  return (
    <>
      <Header setPage={setPage} />
        <div id="titleContainer">
            <span id="title">Sprememba gesla</span>
            <img src="icons/register.png" id="registerIcon" alt="register" />
        </div>
        <div className='formContainer'>
            <form>
                <div className="registerContainer">
                    <label className="registerLabel">Geslo</label>
                    <input
                    className='registerInput'
                    type='password'
                    />
                </div>
                
                <div className="registerContainer">
                    <button className="btnSubmit">Spremeni</button>
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
export default ChangePassword