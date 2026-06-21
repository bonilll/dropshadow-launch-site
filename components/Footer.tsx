import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <strong>DropShadow</strong>
          <div>A survival maze game for iOS.</div>
        </div>
        <nav className="footer-links" aria-label="Footer links">
          <a href="/support">Support</a>
          <a href="/privacy">Privacy</a>
          <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
        </nav>
        <span>© 2026 DropShadow. All rights reserved.</span>
      </div>
    </footer>
  );
}
