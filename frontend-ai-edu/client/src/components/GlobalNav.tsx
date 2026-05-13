import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User, Globe } from "lucide-react";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

export default function GlobalNav() {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const navItems = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.courses"), href: "/courses" },
    { label: t("nav.community"), href: "/community" },
    { label: t("nav.projects"), href: "/projects" },
    { label: t("nav.marketplace"), href: "/marketplace" },
    { label: t("nav.prompts") || "프롬프트", href: "/prompts" },
    { label: t("nav.saas"), href: "/chat" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-900 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
            AI
          </div>
          <span className="hidden sm:inline text-busan-primary">GlobalBusan</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent/10 transition-colors">
                {item.label}
              </a>
            </Link>
          ))}
        </div>

        {/* Desktop Auth & Language */}
        <div className="hidden md:flex items-center gap-2">
          {/* Language Switcher */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setLangMenuOpen(!langMenuOpen);
                setProfileMenuOpen(false);
              }}
              className="gap-2"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase text-xs font-semibold">{language}</span>
            </Button>
            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-background border border-border rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setLanguage("ko");
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-accent/10 ${
                    language === "ko" ? "bg-accent/20 font-semibold" : ""
                  }`}
                >
                  한국어 (KO)
                </button>
                <button
                  onClick={() => {
                    setLanguage("en");
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-accent/10 ${
                    language === "en" ? "bg-accent/20 font-semibold" : ""
                  }`}
                >
                  English (EN)
                </button>
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setProfileMenuOpen(!profileMenuOpen);
                  setLangMenuOpen(false);
                }}
                className="gap-2 font-medium"
              >
                <User className="w-4 h-4" />
                {user?.name || t("nav.profile")}
              </Button>
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-10 py-1">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium">{user?.name || "사용자"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
                  </div>
                  <div className="py-1">
                    <Link href="/profile">
                      <a 
                        className="block px-4 py-2 text-sm hover:bg-accent/10 w-full text-left"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        {t("nav.profile")} 설정
                      </a>
                    </Link>
                    {/* Add links to dashboards later */}
                    <Link href="/profile?tab=courses">
                      <a 
                        className="block px-4 py-2 text-sm hover:bg-accent/10 w-full text-left"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        내 학습 대시보드
                      </a>
                    </Link>
                  </div>
                  <div className="border-t border-border py-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      {t("nav.logout")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button asChild size="sm" className="bg-accent hover:bg-accent/90">
              <a href={getLoginUrl()}>{t("nav.login")}</a>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          {/* Mobile Language Switcher */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="gap-1"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs">{language.toUpperCase()}</span>
            </Button>
            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-28 bg-background border border-border rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setLanguage("ko");
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-accent/10 ${
                    language === "ko" ? "bg-accent/20 font-semibold" : ""
                  }`}
                >
                  한국어
                </button>
                <button
                  onClick={() => {
                    setLanguage("en");
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-accent/10 ${
                    language === "en" ? "bg-accent/20 font-semibold" : ""
                  }`}
                >
                  English
                </button>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur">
          <div className="container py-4 space-y-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-accent/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              </Link>
            ))}

            <div className="border-t border-border pt-4 mt-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link href="/profile">
                    <a
                      className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-accent/10 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {user?.name || t("nav.profile")}
                    </a>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-start gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    {t("nav.logout")}
                  </Button>
                </>
              ) : (
                <Button asChild size="sm" className="w-full bg-accent hover:bg-accent/90">
                  <a href={getLoginUrl()}>{t("nav.login")}</a>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
