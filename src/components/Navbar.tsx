import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

const Navbar = () => {
  const [active, setActive] = useState<string>("home");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const elems = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];

    if (!elems.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        // Choose the most-visible intersecting entry to avoid multiple simultaneous updates
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          visible.sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));
          setActive(visible[0].target.id);
          return;
        }

        // Fallback: pick the section whose top is closest to the viewport top
        try {
          const closest = elems
            .map((el) => ({ id: el.id, top: Math.abs(el.getBoundingClientRect().top) }))
            .sort((a, b) => a.top - b.top)[0];
          if (closest) setActive(closest.id);
        } catch (e) {
          // ignore
        }
      },
      { root: null, rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );

    elems.forEach((el) => obs.observe(el));
    return () => elems.forEach((el) => obs.unobserve(el));
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const nav = document.querySelector("nav");
    const navHeight = nav ? (nav as HTMLElement).getBoundingClientRect().height + 12 : 12;
    const y = el.getBoundingClientRect().top + window.pageYOffset - navHeight;
    window.scrollTo({ top: y, behavior: "smooth" });
    // close mobile menu after navigation
    setOpen(false);
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-7xl px-6">
      <div className="glass backdrop-blur-md rounded-full px-4 py-2 flex items-center justify-between shadow-elegant">
        <div
          className="font-bold text-lg cursor-pointer select-none text-foreground"
          onClick={() => scrollTo("home")}
          aria-label="Go to home"
        >
          Aashutosh
        </div>

        <div className="hidden md:flex items-center gap-3">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`text-sm font-medium py-2 px-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary/40
                ${active === s.id ? "text-primary-foreground bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-card/30"}`}
              aria-current={active === s.id ? "true" : undefined}
            >
              {s.label}
            </button>
          ))}

          {/* Admin Login redirect button */}
          <button
            onClick={() => navigate('/admin/login')}
            className="text-sm font-semibold py-2 px-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition"
            aria-label="Admin login"
          >
            Admin Login
          </button>
        </div>
        <div className="md:hidden relative">
          {/* Hamburger toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="p-2 rounded-full glass flex items-center justify-center"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Backdrop to close menu when clicking outside */}
          {open && (
            <div
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/20"
              aria-hidden
            />
          )}

          {/* Mobile menu panel */}
          {open && (
            <div className="absolute right-0 mt-3 w-56 z-50 bg-card rounded-lg shadow-elegant p-3 flex flex-col gap-2">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`w-full text-left text-sm font-medium py-2 px-3 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-primary/40
                    ${active === s.id ? "text-primary-foreground bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-card/30"}`}
                >
                  {s.label}
                </button>
              ))}

              <button
                onClick={() => {
                  navigate('/admin/login');
                  setOpen(false);
                }}
                className="w-full text-left text-sm font-semibold py-2 px-3 rounded-md bg-primary text-primary-foreground hover:opacity-95 transition"
              >
                Admin Login
              </button>

              <button
                onClick={() => {
                  scrollTo('contact');
                }}
                className="w-full text-left text-sm font-medium py-2 px-3 rounded-md glass"
              >
                Contact
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
