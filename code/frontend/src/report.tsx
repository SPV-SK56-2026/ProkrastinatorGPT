import { useState } from 'react'
import './App.css'
import LayoutWrapper from './components/LayoutWrapper'
import PageHeader from './components/PageHeader'
import PrimaryButton from './components/PrimaryButton'
import { useIcon } from './useTheme';

interface Props {
  setPage?: (page: string) => void;
}

function Report({ setPage }: Props) {
  const [report, setReport] = useState('')
  const icon = useIcon();

  return (
    <LayoutWrapper setPage={setPage}>
      <PageHeader title="Prijavi napako" iconSrc={icon("bug")} iconId="bugIcon" />
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