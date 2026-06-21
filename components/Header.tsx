"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { media, navItems } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="topbar" aria-label="Primary navigation">
        <Link className="brand" href="/" aria-label="DropShadow home">
          <img src={media.appIcon} alt="" width={34} height={34} />
          <span>DropShadow</span>
        </Link>

        <nav className="desktop-nav" aria-label="Main menu">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link className="cta cta-primary" href="/#signup">
            Get notified
          </Link>
        </nav>

        <button
          className="menu-button"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </header>

      <nav className="mobile-panel" data-open={open ? "true" : "false"} aria-label="Mobile menu">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </Link>
        ))}
        <Link className="cta cta-primary" href="/#signup" onClick={() => setOpen(false)}>
          Get notified
        </Link>
      </nav>

      <div className="sticky-mobile-cta">
        <Link className="cta cta-primary" href="/#signup">
          Get notified
        </Link>
      </div>
    </>
  );
}
