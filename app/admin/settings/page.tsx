import { redirect } from "next/navigation";
import AdminNav from "@/components/admin-nav";
import { changeOwnerPassword, getAdminSession, hasAdminSession } from "@/app/admin/actions";
import { getStoreSettings } from "@/lib/store-settings";
import { commerceBackendConfigured } from "@/lib/supabase/admin";
import { updateStoreSettings } from "./actions";

export default async function AdminSettingsPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string; password?: string }> }) {
  if (!(await hasAdminSession())) redirect("/admin");
  const { error, success, password } = await searchParams;
  const backend = commerceBackendConfigured();
  const settings = await getStoreSettings();
  const session = await getAdminSession();

  return (
    <main className="adminShell">
      <AdminNav active="settings"/>
      <section className="adminMain">
        <div className="adminTop"><div><span className="kicker">STORE SETTINGS</span><h1>Public business details</h1></div><a className="secondaryAction" href="/contact">View contact page</a></div>
        {!backend && <div className="adminNotice warning">Supabase is not connected. The form shows environment fallbacks but cannot save database settings yet.</div>}
        {error && <div className="adminNotice error">Could not save settings: {error}</div>}
        {success && <div className="adminNotice success">Store settings updated.</div>}

        <section className="adminCard settingsCard">
          <span className="kicker">EDITABLE WITHOUT CODE</span>
          <h2>Customer-facing settings</h2>
          <p className="adminMuted">These values appear in announcements, WhatsApp actions, contact information and delivery messaging. Keep them accurate because customers use them to make purchase decisions.</p>
          <form className="adminForm" action={updateStoreSettings}>
            <label>Announcement bar<input name="announcementText" defaultValue={settings.announcementText} maxLength={120}/></label>
            <div className="fieldGrid"><label>Support email<input name="supportEmail" type="email" defaultValue={settings.supportEmail}/></label><label>WhatsApp number<input name="whatsappNumber" inputMode="tel" defaultValue={settings.whatsappNumber} placeholder="2348012345678"/></label></div><label>Public location<input name="locationLabel" defaultValue={settings.locationLabel} placeholder="12 Techman Close, Lekki Phase 1, Lagos, Nigeria"/></label><div className="fieldGrid"><label>Footer credit label<input name="footerCreditLabel" defaultValue={settings.footerCreditLabel}/></label><label>Footer credit URL<input name="footerCreditUrl" type="url" defaultValue={settings.footerCreditUrl}/></label></div>
            <label>Free delivery threshold in ₦<input name="freeDeliveryThreshold" type="number" min="0" step="1" defaultValue={settings.freeDeliveryThreshold ?? ""} placeholder="Leave blank if not running this offer"/></label>
            <button className="primaryAction" type="submit" disabled={!backend}>Save public settings</button>
          </form>
        </section>

        {session?.role === "owner" && (
          <section className="adminCard settingsCard adminSecurityCard">
            <span className="kicker">ADMIN SECURITY</span>
            <h2>Change owner password</h2>
            <p className="adminMuted">Only the signed-in owner can change the admin password. Once changed, the previous password stops working for future logins.</p>
            {password === "changed" && <div className="adminNotice success">Admin password changed successfully.</div>}
            {password === "current" && <div className="adminNotice error">Current password is incorrect.</div>}
            {password === "length" && <div className="adminNotice error">New password must be between 10 and 128 characters.</div>}
            {password === "match" && <div className="adminNotice error">New password and confirmation do not match.</div>}
            {password === "save" && <div className="adminNotice error">Could not save the new password.</div>}
            {password === "backend" && <div className="adminNotice warning">The database must be connected before the password can be changed.</div>}
            <form className="adminForm" action={changeOwnerPassword}>
              <label>Current password<input name="currentPassword" type="password" required autoComplete="current-password"/></label>
              <div className="fieldGrid">
                <label>New password<input name="newPassword" type="password" required minLength={10} maxLength={128} autoComplete="new-password"/></label>
                <label>Confirm new password<input name="confirmPassword" type="password" required minLength={10} maxLength={128} autoComplete="new-password"/></label>
              </div>
              <button className="primaryAction" type="submit" disabled={!backend}>Change admin password</button>
            </form>
          </section>
        )}
      </section>
    </main>
  );
}
