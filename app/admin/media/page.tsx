import { redirect } from "next/navigation";
import AdminNav from "@/components/admin-nav";
import { hasAdminSession } from "@/app/admin/actions";
import { commerceBackendConfigured } from "@/lib/supabase/admin";
import { getSiteMedia, mediaFields } from "@/lib/site-media";
import { saveSiteMedia } from "./actions";

export default async function AdminMediaPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  if (!(await hasAdminSession())) redirect("/admin");
  const { error, success } = await searchParams;
  const backend = commerceBackendConfigured();
  const media = await getSiteMedia();

  return (
    <main className="adminShell">
      <AdminNav active="media"/>
      <section className="adminMain">
        <div className="adminTop">
          <div><span className="kicker">MEDIA CMS</span><h1>Homepage images</h1><p className="adminMuted">Replace category and creator-section visuals without touching code. Uploaded files use the same optimized storage as product images.</p></div>
          <a className="secondaryAction" href="/">View storefront</a>
        </div>
        {!backend && <div className="adminNotice warning">Connect Supabase and apply the site-pages migration before media changes can be saved.</div>}
        {error && <div className="adminNotice error">Could not save media: {error}</div>}
        {success && <div className="adminNotice success">Homepage media updated.</div>}
        <section className="adminCard settingsCard">
          <form className="adminForm" action={saveSiteMedia}>
            {mediaFields.map((field) => (
              <div className="adminMediaField" key={field.key}>
                <div>
                  <strong>{field.label}</strong>
                  {media[field.key] ? <img src={media[field.key]} alt="" loading="lazy"/> : <span className="adminMediaEmpty">Using the built-in visual</span>}
                </div>
                <label>Upload replacement<input name={`${String(field.key)}File`} type="file" accept="image/jpeg,image/png,image/webp,image/avif"/></label>
                <label>Or image URL<input name={String(field.key)} type="url" defaultValue={media[field.key] || ""} placeholder="https://..."/></label>
                <label className="checkLabel"><input name={`${String(field.key)}Clear`} type="checkbox"/> Clear custom image</label>
              </div>
            ))}
            <button className="primaryAction" type="submit" disabled={!backend}>Save homepage images</button>
          </form>
        </section>
      </section>
    </main>
  );
}
