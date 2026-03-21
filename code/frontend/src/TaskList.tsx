import { useState, useEffect } from 'react';
import './App.css';
import LayoutWrapper from './components/LayoutWrapper';
import PageHeader from './components/PageHeader';
import { useIcon } from './useTheme';
import { type Bug } from './types';

interface TaskListProps {
  setPage: (page: string) => void;
}

function TaskList({ setPage }: TaskListProps) {
  const icon = useIcon();
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBugs = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('https://www.goprokrastinator.org/bug', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setBugs(data.data || []);
        } else {
          // Fallback na mock podatke, če strežnik ne odgovori pravilno
          setBugs([
            { id: 101, description: "Težava pri prijavi v Moodle", status: "Resolved", createdAt: new Date().toISOString() },
            { id: 102, description: "Gumb za oddajo ne deluje", status: "Pending", createdAt: new Date().toISOString() }
          ]);
        }
      } catch (error) {
        console.error('Napaka pri pridobivanju bugov:', error);
        // Fallback na mock podatke ob napaki
        setBugs([
          { id: 101, description: "Težava pri prijavi v Moodle", status: "Resolved", createdAt: new Date().toISOString() },
          { id: 102, description: "Gumb za oddajo ne deluje", status: "Pending", createdAt: new Date().toISOString() }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBugs();
  }, []);

  return (
    <LayoutWrapper setPage={setPage}>
      <PageHeader title="Pripravljene naloge in poročila" iconSrc={icon("bug")} iconId="bugIcon" />
      <div className="taskListContainer">
        {loading ? (
          <div className="loaderWrapper"><div className="throbber" /></div>
        ) : (
          <>
            <h3 className="sectionTitle">Poročila o napakah</h3>
            {bugs.length === 0 ? (
              <p className="emptyMessage">Ni oddanih poročil.</p>
            ) : (
              <div className="listGrid">
                {bugs.map((bug) => (
                  <div key={bug.id} className="taskCard">
                    <div className="cardHeader">
                      <span className="cardId">#{bug.id}</span>
                      <span className={`cardStatus ${bug.status?.toLowerCase() === 'resolved' ? 'resolved' : 'pending'}`}>
                        {bug.status === 'Resolved' ? 'Rešeno' : 'V obdelavi'}
                      </span>
                    </div>
                    <p className="cardDescription">{bug.description}</p>
                    {bug.createdAt && (
                      <span className="cardDate">{new Date(bug.createdAt).toLocaleDateString()}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </LayoutWrapper>
  );
}

export default TaskList;
