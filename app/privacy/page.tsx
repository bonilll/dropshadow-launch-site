import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for DropShadow and dropshadow.it."
};

export default function PrivacyPage() {
  return (
    <div className="page">
      <nav className="simple-nav">
        <a className="brand" href="/"><span className="app-icon" aria-hidden="true"><img src="/assets/app-icon.svg" alt="" /></span>DropShadow</a>
        <a className="pill" href="/support">Support</a>
      </nav>
      <main className="privacy-wrap">
        <section className="privacy-mast">
          <span className="num num-rule">01</span>
          <div>
            <p className="simple-eyebrow">Privacy</p>
            <h1 className="simple-display">Privacy Policy</h1>
            <p className="simple-lede" style={{ marginTop: 26 }}>Last updated: June 19, 2026</p>
          </div>
        </section>
        <article className="privacy-article"><h2>Who we are</h2><p>DropShadow<br />Website: dropshadow.it<br />Contact: hello@dropshadow.it</p></article>
        <article className="privacy-article"><h2>Information we collect</h2><p>If you join the launch list, we collect your email address, source parameter, consent version, consent text, and subscription date. If you contact support, we collect the information you choose to send us, such as your email address, device model, iOS version, app version, screenshots, or issue description.</p></article>
        <article className="privacy-article"><h2>Why we use your data</h2><ul><li>send DropShadow launch updates and major game news;</li><li>notify you when the game becomes available;</li><li>record consent for the email launch list;</li><li>respond to support requests;</li><li>understand which launch channels send people to the website.</li></ul></article>
        <article className="privacy-article"><h2>Services we use</h2><ul><li>Vercel hosts this website and provides privacy-friendly web analytics for basic traffic measurement.</li><li>Brevo stores and manages launch-list email subscriptions.</li><li>We do not use Google Analytics, advertising cookies, or marketing pixels in this version of the website.</li></ul></article>
        <article className="privacy-article"><h2>Source tracking</h2><p>Links may include a source parameter, such as src=tiktok, src=instagram, src=youtube, src=reddit, or a creator/source name. We store that source with your email subscription to understand where signups come from.</p></article>
        <article className="privacy-article"><h2>Email launch list</h2><p>You can unsubscribe from the launch list at any time using the unsubscribe link in our emails or by contacting hello@dropshadow.it. We keep launch-list records until you unsubscribe or ask us to delete them.</p></article>
        <article className="privacy-article"><h2>Retention</h2><p>Support emails are kept only as long as needed to investigate and respond. Analytics data is handled by Vercel according to its service terms. Launch-list data is kept in Brevo until unsubscribe, deletion request, or list shutdown.</p></article>
        <article className="privacy-article"><h2>Contact</h2><p>For privacy requests, contact: <a href="mailto:hello@dropshadow.it">hello@dropshadow.it</a></p></article>
      </main>
    </div>
  );
}
