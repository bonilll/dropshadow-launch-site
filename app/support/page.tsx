import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with DropShadow, report bugs, or contact support."
};

export default function SupportPage() {
  return (
    <div className="page">
      <nav className="simple-nav">
        <a className="brand" href="/"><span className="app-icon" aria-hidden="true"><img src="/assets/app-icon.svg" alt="" /></span>DropShadow</a>
        <a className="pill primary" href="/#signup">Get notified</a>
      </nav>
      <main className="simple-wrap">
        <section>
          <p className="simple-eyebrow"><span className="num num-rule">01</span> Support</p>
          <h1 className="simple-display">Need help with DropShadow?</h1>
        </section>
        <section className="support-faq">
          <div className="proto-card">
            <p>Contact us at <a href="mailto:hello@dropshadow.it">hello@dropshadow.it</a> and include:</p>
            <ul>
              <li>your device model</li>
              <li>iOS version</li>
              <li>app version</li>
              <li>a short description of the issue</li>
              <li>screenshots or screen recording, if useful</li>
            </ul>
            <p>We’ll use this information only to investigate and respond to your support request.</p>
          </div>
          <div className="proto-card"><p><strong>When is DropShadow launching?</strong>DropShadow is coming soon to the App Store. Join the launch list to get notified when it becomes available.</p></div>
          <div className="proto-card"><p><strong>Which devices are supported?</strong>DropShadow is designed for iPhone and iPad. Final device requirements will be available on the App Store page.</p></div>
          <div className="proto-card"><p><strong>How do I report a bug?</strong>Send details to hello@dropshadow.it with your device model, iOS version, app version, and what happened before the issue.</p></div>
        </section>
      </main>
    </div>
  );
}
