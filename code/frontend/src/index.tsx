//import { useState } from 'react'
import './App.css'
import Header from './header'

function Index(){

  return (
    <>
      <Header />

      <div className="holder description">
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

      <hr />

      <div>
        <div className="bottomHolder">
          <div className="infoBlock">
            <div className="infoTitle">
              <img src="icons/barbell.png" className="barbellIcon" alt="barbell" />
              <span>Težavnost</span>
            </div>
            <div className="infoValue">4/10</div>
          </div>

          <div className="infoBlock">
            <div className="infoTitle">
              <img src="icons/wall-clock.png" className="clockIcon" alt="clock" />
              <span>Predviden čas</span>
            </div>
            <div className="infoValue">2-3 ure</div>
          </div>
        </div>

        <div className="btnWrapper">
          <button
            className="btnClose"
            onClick={(): void => window.close()}
          >
            Zapri
          </button>
        </div>
      </div>
    </>
  )
}

export default Index