import { useState } from 'react'
import './App.css'
import Report from './report'
import Register from './register'
import Login from './login.tsx'
import ForgotPassword from './forgotPassword.tsx'
import ChangePassword from './changePassword.tsx'
import Profile from './profile.tsx'
import LayoutWrapper from './components/LayoutWrapper.tsx'
import { useApp } from './AppContext.tsx'

const observer = new ResizeObserver(() => {
  window.parent.postMessage({ 
    type: "RESIZE_IFRAME", 
    height: document.body.scrollHeight 
  }, "*");
});
observer.observe(document.body);

function Index() {
  const { currentAssignment } = useApp();
  const [page, setPage] = useState("home");
  const params = new URLSearchParams(window.location.search);
  const noAssignment = params.get("noAssignment");

  if (page === "report") return <Report setPage={setPage} />;
  if (page === "register") return <Register setPage={setPage} />;
  if (page === "login") return <Login setPage={setPage} />;
  if (page === "forgot") return <ForgotPassword setPage={setPage} />;
  if (page === "change") return <ChangePassword setPage={setPage} />;
  if (page === "profile") return <Profile setPage={setPage} />;

  return (
    <LayoutWrapper isNoAssignment={!!noAssignment || !currentAssignment} setPage={setPage}>
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