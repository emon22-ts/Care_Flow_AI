import { Linkedin, ExternalLink, Activity } from "lucide-react";

const team = [
  { name: "Farhan",  href: "https://www.farhanbin.dev",                                icon: "portfolio" },
  { name: "Shaheer", href: "https://www.linkedin.com/in/shaheer-tahir-8b2ba739a/",     icon: "linkedin"  },
  { name: "Emon",    href: "https://www.linkedin.com/in/mahfuzur-rahman-emon-a06a91328/", icon: "linkedin" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/60 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-primary" />
          <span>© 2026 CareFlow AI · NHS Innovation</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="hidden sm:inline mr-2">Made by</span>
          {team.map((m, i) => (
            <span key={m.name} className="flex items-center gap-1">
              {i > 0 && <span className="text-border mx-1">·</span>}
              <a
                href={m.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-foreground/70 transition-colors hover:text-primary"
              >
                {m.icon === "linkedin" ? (
                  <Linkedin className="h-3 w-3" />
                ) : (
                  <ExternalLink className="h-3 w-3" />
                )}
                {m.name}
              </a>
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
