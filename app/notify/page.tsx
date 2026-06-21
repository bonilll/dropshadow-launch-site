import type { Metadata } from "next";
import { NotifyPrototypeForm } from "@/components/NotifyPrototypeForm";

export const metadata: Metadata = {
  title: "Get notified",
  description: "Join the DropShadow launch list and get notified when the first run opens on the App Store."
};

export default function NotifyPage() {
  return (
    <div className="page">
      <nav className="simple-nav">
        <a className="brand" href="/"><span className="app-icon" aria-hidden="true"><img src="/assets/app-icon.svg" alt="" /></span>DropShadow</a>
        <a className="pill" href="/">Home</a>
      </nav>
      <main className="simple-wrap notify-wrap">
        <section>
          <p className="simple-eyebrow"><span className="num">01</span> Launch list</p>
          <h1 className="simple-display">Be there when the Shadow starts moving.</h1>
          <p className="simple-lede" style={{ marginTop: 28 }}>
            DropShadow is coming to the App Store. Join the launch list and get notified when the first run opens.
          </p>
          <div className="reasons">
            <div className="reason">Launch notification.</div>
            <div className="reason">First Daily Run.</div>
            <div className="reason">Major updates only.</div>
          </div>
        </section>
        <aside className="proto-card">
          <div className="notify-maze" aria-label="Gameplay loop placeholder" />
          <NotifyPrototypeForm />
        </aside>
      </main>
    </div>
  );
}
