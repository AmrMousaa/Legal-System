import { useState } from 'react';
import { Toaster } from '@fluentui/react-components';
import { CaseListPage } from './pages/CaseListPage';
import { CaseDetailPage } from './pages/CaseDetailPage';
import { TOASTER_ID } from './toast';

type View = { name: 'list' } | { name: 'detail'; caseId: string };

function App() {
  const [view, setView] = useState<View>({ name: 'list' });

  return (
    <>
      <Toaster toasterId={TOASTER_ID} position="top-end" />
      {view.name === 'list' ? (
        <CaseListPage onOpenCase={(caseId) => setView({ name: 'detail', caseId })} />
      ) : (
        <CaseDetailPage caseId={view.caseId} onClose={() => setView({ name: 'list' })} />
      )}
    </>
  );
}

export default App;
