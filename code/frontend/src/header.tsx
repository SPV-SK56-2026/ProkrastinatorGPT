import { useState } from 'react'
import './App.css'
import Options from './options'

function Header(){
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
                    <Options />
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