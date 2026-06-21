import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for DropShadow and dropshadow.it."
};

const controllerAddress =
  siteConfig.legalControllerAddress === "To be completed"
    ? ""
    : ` Legal address: ${siteConfig.legalControllerAddress}.`;

export default function PrivacyPage() {
  return (
    <div className="page">
      <nav className="simple-nav">
        <a className="brand" href="/">
          <span className="app-icon" aria-hidden="true"><img src="/assets/app-icon.svg" alt="" /></span>
          DropShadow
        </a>
        <a className="pill" href="/support">Support</a>
      </nav>
      <main className="privacy-wrap">
        <section className="privacy-mast">
          <span className="num num-rule">01</span>
          <div>
            <p className="simple-eyebrow">Privacy</p>
            <h1 className="simple-display">Privacy Policy</h1>
            <p className="simple-lede" style={{ marginTop: 26 }}>
              Last updated: {siteConfig.privacyUpdatedAt}. Version: {siteConfig.privacyVersion}.
            </p>
          </div>
        </section>

        <article className="privacy-article">
          <h2>Data controller</h2>
          <div>
            <p>
              The data controller for this website is {siteConfig.legalController}. Website: dropshadow.it.
              Country: {siteConfig.legalControllerCountry}.{controllerAddress}
            </p>
            <p>
              For privacy requests, contact <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
              Certified email: <a href={`mailto:${siteConfig.legalPec}`}>{siteConfig.legalPec}</a>.
              Data Protection Officer: {siteConfig.legalDpo}.
            </p>
          </div>
        </article>

        <article className="privacy-article">
          <h2>Data we collect</h2>
          <div>
            <p>
              If you join the DropShadow launch list, we collect your email address, the signup source
              when available, the consent text, consent version, and subscription date.
            </p>
            <p>
              If you contact support, we collect the information you choose to send us, such as your
              email address, device model, iOS version, app version, screenshots, screen recordings,
              and issue description.
            </p>
          </div>
        </article>

        <article className="privacy-article">
          <h2>Purposes and legal bases</h2>
          <div>
            <ul>
              <li>Launch list and major game updates: consent.</li>
              <li>Consent records and unsubscribe handling: legal obligation and legitimate interest.</li>
              <li>Support requests: pre-contractual steps, contract performance, and legitimate interest.</li>
              <li>Basic website security and hosting: legitimate interest.</li>
              <li>Privacy-friendly traffic measurement with Vercel Web Analytics: legitimate interest.</li>
            </ul>
          </div>
        </article>

        <article className="privacy-article">
          <h2>Newsletter consent</h2>
          <div>
            <p>
              The launch list is optional. The signup checkbox is not pre-selected. You can withdraw
              consent at any time through the unsubscribe link in our emails or by contacting us.
            </p>
            <p>
              We use Brevo to manage email subscriptions. After signup, your address is added to the
              launch list without a separate confirmation email. Every marketing email will include
              an unsubscribe link.
            </p>
          </div>
        </article>

        <article className="privacy-article">
          <h2>Analytics, cookies, and tracking</h2>
          <div>
            <p>
              We use Vercel Web Analytics to understand aggregated visits and campaign performance.
              Vercel Web Analytics does not use cookies and does not give us data that identifies a
              specific visitor.
            </p>
            <p>
              We do not use Google Analytics, advertising cookies, profiling cookies, Meta Pixel,
              TikTok Pixel, or similar marketing pixels in this version of the website. If we add
              advertising or profiling tools later, we will update this policy and add the required
              cookie consent controls before activating them.
            </p>
          </div>
        </article>

        <article className="privacy-article">
          <h2>Processors</h2>
          <div>
            <p>
              We use Vercel to host the website and provide privacy-friendly web analytics. We use
              Brevo to store and manage launch-list subscriptions and email delivery.
            </p>
            <p>
              These providers process data on our behalf under their applicable data processing terms.
            </p>
          </div>
        </article>

        <article className="privacy-article">
          <h2>International transfers</h2>
          <div>
            <p>
              Our providers may process data in countries outside the European Economic Area. Where
              required, transfers are covered by appropriate safeguards such as adequacy decisions,
              standard contractual clauses, or equivalent data protection measures.
            </p>
          </div>
        </article>

        <article className="privacy-article">
          <h2>Retention</h2>
          <div>
            <ul>
              <li>Launch-list data is kept until you unsubscribe, request deletion, or the list is shut down.</li>
              <li>Consent records may be kept as long as needed to demonstrate lawful consent.</li>
              <li>Support emails are kept only as long as needed to investigate and respond.</li>
              <li>Vercel Web Analytics provides aggregated analytics according to Vercel&apos;s product terms.</li>
            </ul>
          </div>
        </article>

        <article className="privacy-article">
          <h2>Your rights</h2>
          <div>
            <p>
              Under the GDPR, you can ask to access, correct, delete, restrict, or receive a copy of
              your personal data. You can also object to processing based on legitimate interest and
              withdraw consent for the launch list at any time.
            </p>
            <p>
              You also have the right to lodge a complaint with your local data protection authority.
              In Italy, this is the Garante per la protezione dei dati personali.
            </p>
          </div>
        </article>

        <article className="privacy-article">
          <h2>Children</h2>
          <div>
            <p>
              The launch list is intended for people who can lawfully provide consent to receive email
              updates in their country. If you believe a child has joined the list without valid
              consent, contact us and we will remove the address.
            </p>
          </div>
        </article>

        <article className="privacy-article">
          <h2>Contact</h2>
          <div>
            <p>
              For privacy requests, unsubscribe help, or questions about this policy, contact
              {" "}<a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
