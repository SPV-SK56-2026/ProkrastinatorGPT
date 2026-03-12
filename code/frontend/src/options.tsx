import './App.css'

interface OptionsProps {
  setPage: (page: string) => void;
}

function Options({ setPage }: OptionsProps) {
  return (
    <div>
      <ul className='optionList'>
        <li className='optionItem' onClick={() => setPage("profile")} style={{ cursor: "pointer" }}>
          <img src="icons/user.png" className="optionsIcons" alt="icon" />
          <p className='optionInfo'>Moj profil</p>
        </li>
        <hr />
        <li className='optionItem' onClick={() => setPage("report")} style={{ cursor: "pointer" }}>
          <img src="icons/bug.png" className="optionsIcons" alt="icon" />
          <p className='optionInfo'>Prijavi napako</p>
        </li>
        <hr />
        <li className='optionItem' onClick={() => setPage("register")} style={{ cursor: "pointer" }}>
          <img src="icons/logout.png" className="optionsIcons" alt="icon" />
          <p className='optionInfo'>Odjava</p>
        </li>
      </ul>
    </div>
  )
}

export default Options