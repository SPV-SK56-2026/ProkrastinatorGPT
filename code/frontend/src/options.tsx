import './App.css'
import { useIcon } from './useTheme';

interface OptionsProps {
  setPage: (page: string) => void;
}

function Options({ setPage }: OptionsProps) {
  const icon = useIcon();
  return (
    <div>
      <ul className='optionList'>
        <li className='optionItem' onClick={() => setPage("profile")} style={{ cursor: "pointer" }}>
          <img src={icon("user")} className="optionsIcons" alt="icon" />
          <p className='optionInfo'>Moj profil</p>
        </li>
        <hr />
        <li className='optionItem' onClick={() => setPage("report")} style={{ cursor: "pointer" }}>
          <img src={icon("bug")} className="optionsIcons" alt="icon" />
          <p className='optionInfo'>Prijavi napako</p>
        </li>
        <hr />
        <li className='optionItem' onClick={() => setPage("register")} style={{ cursor: "pointer" }}>
          <img src={icon("logout")} className="optionsIcons" alt="icon" />
          <p className='optionInfo'>Odjava</p>
        </li>
      </ul>
    </div>
  )
}
export default Options