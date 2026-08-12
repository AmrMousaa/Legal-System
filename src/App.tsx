import { useState } from 'react';
import { FluentProvider, Toaster } from '@fluentui/react-components';
import { CaseListPage } from './pages/CaseListPage';
import { CaseDetailPage } from './pages/CaseDetailPage';
import { TOASTER_ID } from './toast';
import { legalTheme, palette } from './theme';
import { useLanguage } from './i18n';

type View = { name: 'list' } | { name: 'detail'; caseId: string };

function App() {
  const [view, setView] = useState<View>({ name: 'list' });
  const { dir } = useLanguage();

  return (
    <FluentProvider
      theme={legalTheme}
      dir={dir}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: palette.pageBg }}
    >
      <Toaster toasterId={TOASTER_ID} position="top-end" />
      {view.name === 'list' ? (
        <CaseListPage key="list" onOpenCase={(caseId) => setView({ name: 'detail', caseId })} />
      ) : (
        <CaseDetailPage key={view.caseId} caseId={view.caseId} onClose={() => setView({ name: 'list' })} />
      )}
    </FluentProvider>
  );
}

export default App;
