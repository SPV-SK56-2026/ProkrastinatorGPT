//import { useState } from 'react'
import './App.css'
import Header from './header'
import { useApp } from './AppContext.tsx'

const observer = new ResizeObserver(() => {
  window.parent.postMessage({ 
    type: "RESIZE_IFRAME", 
    height: document.body.scrollHeight 
  }, "*");
});
observer.observe(document.body);

function Index(){
  const { currentAssignment } = useApp();
  const params = new URLSearchParams(window.location.search);
    const noAssignment = params.get("noAssignment");

    if (noAssignment || !currentAssignment) {
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

      <div 
        className="holder description" 
        dangerouslySetInnerHTML={{ __html: currentAssignment.description }}
      />

      <div className="holder">
        <div id="blueHolder">
          <div id="blueTextHolder">
            <p className="blueTitle">Potek reševanja</p>
            <ul>
              {currentAssignment.steps.map((step) => (
                <li key={step.id}>
                  <span className="blueText">{step.description}</span>
                </li>
              ))}
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
            <div className="infoValue">{currentAssignment.difficulty}</div>
          </div>

          <div className="infoBlock">
            <div className="infoTitle">
              <img src="icons/wall-clock.png" className="clockIcon" alt="clock" />
              <span>Predviden čas</span>
            </div>
            <div className="infoValue">{currentAssignment.estimatedTime}</div>
          </div>
        </div>

        <div className="btnWrapper">
          <button
            className="btnClose"
            onClick={() => {
              window.parent.postMessage({ type: "CLOSE_IFRAME" }, "*");
            }}
          >
            Zapri
          </button>
        </div>
      </div>
    </>
  )
}

export default Index