//import { useState } from 'react'
import './App.css'

function Report(){
  return (
    <div>

      <div id="titleContainer">
        <img src="icons/icon.png" id="titleIcon" alt="icon" />
        <span id="title">ProkrastinatorGPT</span>
      </div>

      <hr />

   
      <div id="titleContainer">
        <span id="title">Prijavi napako</span>
        <img src="icons/bug.png" id="bugIcon" alt="bug" />
      </div>


      <div className="inputContainer">
        <label className="label">Opis napake</label>

        <textarea
          className="textInput"
          placeholder=""
        />
      </div>

      <button className="btnSubmit">
        Prijava
      </button>



      <div className="btnWrapper">
          <button
            className="btnClose"
            onClick={(): void => window.close()}
          >
            Zapri
          </button>
        </div>

    </div>
  )
}

export default Report