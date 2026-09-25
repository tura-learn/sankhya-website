import { Route, Routes } from 'react-router';

import '@/index.css';
import { AccountFooter, AccountHeader } from '@/account/AccountChrome';
import { AccountPage } from '@/pages/AccountPage';
import { PrivacyPage } from '@/pages/PrivacyPage';

/** The account half, as it was: sign-in, billing, desktop hand-off and the privacy policy. */
export function AccountApp() {
  return (
    <div className="min-h-screen bg-cream">
      <AccountHeader />
      <Routes>
        <Route path="/account/*" element={<AccountPage />} />
        <Route path="/privacy" element={<><PrivacyPage /><AccountFooter /></>} />
      </Routes>
    </div>
  );
}
