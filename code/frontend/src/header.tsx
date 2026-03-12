import { useState } from 'react'
import './App.css'
import Options from './options'

interface HeaderProps {
  setPage?: (page: string) => void; 
}

function Header({ setPage }: HeaderProps) {
  const [showOptions, setShowOptions] = useState(false)
  return (
    <>
      <div>
        <div className="optionPostion"
          onMouseEnter={() => setShowOptions(true)}
          onMouseLeave={() => setShowOptions(false)}
        >
          <img src="icons/options.png" id="optionIcon" alt="icon"/>
          {showOptions && (
            <div className="optionsDropdown">
              <Options setPage={setPage ?? (() => {})} />
            </div>
          )}
        </div>
        <div id="titleContainer">
          <img src="icons/icon.png" id="titleIcon" alt="icon" />
          <span id="title">ProkrastinatorGPT</span>
        </div>
      </div>
      <hr />
    </>
  )
}
export default Header