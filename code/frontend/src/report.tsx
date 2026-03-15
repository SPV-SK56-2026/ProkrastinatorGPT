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
  const [loading, setLoading] = useState(false)
  const icon = useIcon();
  const isFormValid = report.trim() !== '';

  const handleSubmit = async () => {
    if (!report.trim()) {
      alert("Prosim, vpiši opis napake.");
      return;
    }
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://www.goprokrastinator.org/bugs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ description: report })
      });
      if (response.ok) {
        alert("Napaka je bila uspešno prijavljena. Hvala!");
        setReport('');
        setPage?.("home");
      } else if (response.status === 401) {

        alert("Seja je potekla. Prosimo, prijavi se ponovno.");
        setPage?.("login");
      } else {
        throw new Error("Prišlo je do napake na strežniku.");
      }
    } catch (error) {
      console.error('Bugs API error:', error);
      alert("Napake ni bilo mogoče poslati. Poskusi kasneje.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LayoutWrapper setPage={setPage}>
      <PageHeader title="Prijavi napako" iconSrc={icon("bug")} iconId="bugIcon" />
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
      <PrimaryButton onClick={handleSubmit} disabled={loading || !isFormValid}>
        {loading ? 'Pošiljanje...' : 'Prijava'}
      </PrimaryButton>
    </LayoutWrapper>
  )
}

export default Report