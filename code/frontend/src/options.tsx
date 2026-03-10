//import { useState } from 'react'
import './App.css'

function Options(){
    return (
        <div>
            <ul className='optionList'>
                <li className='optionItem'>
                    <img src="icons/user.png" className="optionsIcons" alt="icon" />
                    <p className='optionInfo'>Moj profil</p>
                </li>
                <hr />
                <li className='optionItem'>
                    <img src="icons/bug.png" className="optionsIcons" alt="icon" />
                    <p className='optionInfo'>Prijavi napako</p>
                </li>
                <hr />
                <li className='optionItem'>
                    <img src="icons/logout.png" className="optionsIcons" alt="icon" />
                    <p className='optionInfo'>Odjava</p>
                </li>
            </ul>
        </div>
    )
}

export default Options