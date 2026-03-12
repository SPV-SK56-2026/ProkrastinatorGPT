import { useState } from 'react'
import './App.css'
import LayoutWrapper from './components/LayoutWrapper'
import PageHeader from './components/PageHeader'
import PrimaryButton from './components/PrimaryButton'

function Report(){
  const [report, setReport] = useState('')

  return (
    <LayoutWrapper>
      <PageHeader 
        title="Prijavi napako" 
        iconSrc="icons/bug.png" 
        iconId="bugIcon" 
      />

      <div className="inputContainer">
        <label className="label">Opis napake</label>
        <textarea
          className="textInput"
          placeholder=""
          value={report}
          onChange={(e) => setReport(e.target.value)}
        />
      </div>

      <PrimaryButton onClick={() => console.log('Report submitted:', report)}>
        Prijava
      </PrimaryButton>
    </LayoutWrapper>
  )
}

export default Report