//import { useState } from 'react'
import './App.css'

function App() {
  return (
    <>
      <div>
        <div id="titleContainer"><img src="icons/icon.png" id="titleIcon" alt="icon"/> <span id="title">ProkrastinatorGPT</span></div>
	    </div>
      <hr/>
      <div className="holder">
        Naloga zahteva izdelavo <span className="orangeText">organizacijskega diagrama podjeta</span>, ki prikazuje strukturo in naloge posameznikov ali oddelkov. <span className="orangeText">Priložiti je treba log chata</span>, ki dokazuje, da so vsi člani ekipe sodelovali in oddali isto datoteko.
      </div>
      <div className="holder">
        <div id="blueHolder">
          <div id="blueTextHolder">
            <p className="blueTitle">Potek reševanja</p>
            <ul>
              <li><span className="blueText">Zbrati informacije</span> o strukturi podjeta in nalogah posameznikov/oddelkov.</li>
              <li><span className="blueText">Izdelati organizacijskih diagram</span>, ki prikazuje hierarhijo in odgovornosti.</li>
              <li><span className="blueText">Sodelovati v ekipi</span> in se dogovoriti o vsebini ter oblikovanju diagrama.</li>
              <li><span className="blueText">Zabeležiti log chata</span> kot dokaz aktivnega sodelovanja vseh članov.</li>
              <li><span className="blueText">Oddati diagram in log chata v skupni datoteki.</span></li>
            </ul>
          </div>
        </div>
      </div>
      <hr/>
    </>
  )
}

export default App
