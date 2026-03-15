import { useState } from 'react'
import './App.css'
import LayoutWrapper from './components/LayoutWrapper'
import PageHeader from './components/PageHeader'
import PrimaryButton from './components/PrimaryButton'

interface Props {
  setPage?: (page: string) => void;
}

function Report({ setPage }: Props) {
  const [report, setReport] = useState('')
  const [loading, setLoading] = useState(false)

  // Issue report + error handling
  const handleSubmit = async () => {
    if (!report.trim()) {
      alert("Prosim, vpiši opis napake.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token'); // get JWT token

    try {
      // BugRepo.
      const response = await fetch('http://prokrastinatorgpt.ddns.net:5050/api/bugs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // tokenSending
        },
        body: JSON.stringify({ description: report })
      });

      if (response.ok) {
        alert("Napaka je bila uspešno prijavljena. Hvala!");
        setReport('');
        setPage?.("home"); // return na home page
      } else if (response.status === 401) {
        // Če žeton ni več veljaven (redirect na login)
        alert("Seja je potekla. Prosimo, prijavi se ponovno.");
        setPage?.("login");
      } else {
        throw new Error("Prišlo je do napake na strežniku.");
      }
    } catch (error) {
      console.error('Bugs API error:', error); // error loging
      alert("Napake ni bilo mogoče poslati. Poskusi kasneje.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LayoutWrapper setPage={setPage}>
      <PageHeader 
        title="Prijavi napako" 
        iconSrc="icons/bug.png" 
        iconId="bugIcon" 
      />
      <div className="inputContainer">
        <label className="label">Opis napake</label>
        <textarea
          className="textInput"
          placeholder="Opiši, kaj ne deluje..."
          value={report}
          onChange={(e) => setReport(e.target.value)}
          disabled={loading}
        />
      </div>
      {/* Povezava gumba s funkcijo */}
      <PrimaryButton onClick={handleSubmit} disabled={loading}>
        {loading ? 'Pošiljanje...' : 'Prijava'}
      </PrimaryButton>
    </LayoutWrapper>
  )
}

export default Report
