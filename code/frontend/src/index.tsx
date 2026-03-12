import './App.css'
import { useApp } from './AppContext.tsx'
import LayoutWrapper from './components/LayoutWrapper'

function Index(){
  const { currentAssignment } = useApp();
  const params = new URLSearchParams(window.location.search);
  const noAssignment = params.get("noAssignment");

  return (
    <LayoutWrapper isNoAssignment={!!noAssignment || !currentAssignment}>
      <div 
        className="holder description" 
        dangerouslySetInnerHTML={{ __html: currentAssignment?.description || '' }}
      />

      <div className="holder">
        <div id="blueHolder">
          <div id="blueTextHolder">
            <p className="blueTitle">Potek reševanja</p>
            <ul>
              {currentAssignment?.steps.map((step) => (
                <li key={step.id}>
                  <span className="blueText">{step.description}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <hr />

      <div className="bottomHolder">
        <div className="infoBlock">
          <div className="infoTitle">
            <img src="icons/barbell.png" className="barbellIcon" alt="barbell" />
            <span>Težavnost</span>
          </div>
          <div className="infoValue">{currentAssignment?.difficulty}</div>
        </div>

        <div className="infoBlock">
          <div className="infoTitle">
            <img src="icons/wall-clock.png" className="clockIcon" alt="clock" />
            <span>Predviden čas</span>
          </div>
          <div className="infoValue">{currentAssignment?.estimatedTime}</div>
        </div>
      </div>
    </LayoutWrapper>
  )
}

export default Index