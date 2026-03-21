import { useState } from 'react'
import './App.css'
import Report from './report'
import TaskList from './TaskList'
import Register from './register'
import Login from './login.tsx'
import ForgotPassword from './forgotPassword.tsx'
import ChangePassword from './changePassword.tsx'
import Profile from './profile.tsx'
import LayoutWrapper from './components/LayoutWrapper.tsx'
import { useApp } from './AppContext.tsx'
import { useIcon } from './useTheme'

const observer = new ResizeObserver(() => {
  window.parent.postMessage({ 
    type: "RESIZE_IFRAME", 
    height: document.body.scrollHeight 
  }, "*");
});
observer.observe(document.body);

function Index() {
  const { currentAssignment, isLoading, error, toggleStep } = useApp();
  const [page, setPage] = useState("home");
  const icon = useIcon();
  const params = new URLSearchParams(window.location.search);
  const noAssignment = params.get("noAssignment");

  if (isLoading) return (
    <div className="loaderWrapper">
      <div className="throbber" />
    </div>
  );

  if (page === "report") return <Report setPage={setPage} />;
  if (page === "tasks") return <TaskList setPage={setPage} />;
  if (page === "register") return <Register setPage={setPage} />;
  if (page === "login" || error === "login") return <Login setPage={setPage} />;
  if (error) return (
    <div className="errorContainer">
      <p className="errorMessage">{error === "login" ? "Za dostop se morate prijaviti." : error}</p>
      {error !== "login" && (
        <button className="btnSubmit" onClick={() => window.location.reload()}>
          Poskusi ponovno
        </button>
      )}
    </div>
  );
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
            <ul className="interactiveSteps">
              {currentAssignment?.steps.map((step) => (
                <li key={step.id} className={step.isCompleted ? 'completed' : ''} onClick={() => toggleStep(step.id)}>
                  <div className="stepContent">
                    <input 
                      type="checkbox" 
                      checked={step.isCompleted} 
                      onChange={() => {}} // Handle via li onClick
                      className="stepCheckbox"
                    />
                    <span dangerouslySetInnerHTML={{ __html: step.description }} />
                  </div>
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
            <img src={icon("barbell")} className="barbellIcon" alt="barbell" />
            <span>Težavnost</span>
          </div>
          <div className={`infoValue difficulty-${currentAssignment?.difficulty.split('/')[0]}`}>
            {currentAssignment?.difficulty}
          </div>
        </div>
        <div className="infoBlock">
          <div className="infoTitle">
            <img src={icon("wall-clock")} className="clockIcon" alt="clock" />
            <span>Predviden čas</span>
          </div>
          <div className="infoValue">{currentAssignment?.estimatedTime}</div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
export default Index