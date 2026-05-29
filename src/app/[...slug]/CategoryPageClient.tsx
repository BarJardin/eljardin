"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import FooterSection from "../social/FooterSection";
import {
  defaultLanguagePreference,
  detectLanguageCodeFromLocale,
  getLanguageOption,
  languageOptions,
  languageStorageKey,
  resolveLanguageCode,
  translations,
  type LanguagePreferenceCode,
} from "../../lib/i18n";
import type { MenuCard, MenuItem, SiteSettings } from "../../lib/supabase-public";

type CategoryPageClientProps = {
  category: MenuCard;
  items: MenuItem[];
  siteSettings: SiteSettings | null;
};

function subscribeToLanguageSelection(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("popstate", onStoreChange);
  window.addEventListener("language-preference-change", onStoreChange);
  return () => {
    window.removeEventListener("popstate", onStoreChange);
    window.removeEventListener("language-preference-change", onStoreChange);
  };
}

function getServerLanguageSnapshot() {
  return defaultLanguagePreference;
}

function getClientLanguageSnapshot(): LanguagePreferenceCode {
  const searchParams = new URLSearchParams(window.location.search);
  const forcedLanguage = searchParams.get("lang") as LanguagePreferenceCode | null;

  if (forcedLanguage) {
    return forcedLanguage;
  }

  const storedLanguage = window.localStorage.getItem(languageStorageKey) as LanguagePreferenceCode | null;
  if (storedLanguage) {
    return storedLanguage;
  }

  return defaultLanguagePreference;
}

function setSelectedLanguageCode(code: LanguagePreferenceCode) {
  const url = new URL(window.location.href);
  url.searchParams.set("lang", code);
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  window.localStorage.setItem(languageStorageKey, code);
  window.dispatchEvent(new Event("language-preference-change"));
}

function withLanguageInHref(href: string, languageCode: LanguagePreferenceCode) {
  const url = new URL(href, "https://local.link");
  url.searchParams.set("lang", languageCode);
  return `${url.pathname}${url.search}${url.hash}`;
}

export default function CategoryPageClient({ category, items, siteSettings }: CategoryPageClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const languageMenuCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draggedRef = useRef(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const selectedLanguagePreference = useSyncExternalStore(
    subscribeToLanguageSelection,
    getClientLanguageSnapshot,
    getServerLanguageSnapshot,
  );
  const browserLocale = typeof navigator !== "undefined" ? navigator.languages?.[0] ?? navigator.language ?? "es-ES" : "es-ES";
  const effectiveLanguageCode =
    selectedLanguagePreference === "auto" ? detectLanguageCodeFromLocale(browserLocale) : resolveLanguageCode(selectedLanguagePreference);
  const messages = translations[effectiveLanguageCode];
  const selectedLanguage = getLanguageOption(effectiveLanguageCode);
  const selectedFlagImageUrl = `https://flagcdn.com/w40/${selectedLanguage.countryCode}.png`;
  const homeHref = withLanguageInHref("/", selectedLanguagePreference);

  const total = items.length;
  const currentIndex = total > 0 ? activeIndex % total : 0;

  const goTo = (index: number) => {
    if (total === 0) {
      return;
    }

    setActiveIndex((index + total) % total);
  };

  const goPrev = () => {
    goTo(activeIndex - 1);
  };

  const goNext = () => {
    goTo(activeIndex + 1);
  };

  const circularDelta = (index: number) => {
    if (total === 0) {
      return 0;
    }

    let delta = index - currentIndex;
    const half = Math.floor(total / 2);
    if (delta > half) {
      delta -= total;
    }
    if (delta < -half) {
      delta += total;
    }
    return delta;
  };

  const getCardMotion = (delta: number) => {
    if (delta === 0) {
      return {
        x: 0,
        y: -14,
        scale: 1.03,
        rotateY: 0,
        opacity: 1,
        zIndex: 50,
        filter: "blur(0px) brightness(1)",
      };
    }

    if (delta === -1) {
      return {
        x: -240,
        y: 30,
        scale: 0.9,
        rotateY: 34,
        opacity: 0.82,
        zIndex: 20,
        filter: "blur(1.8px) brightness(0.9)",
      };
    }

    if (delta === 1) {
      return {
        x: 240,
        y: 30,
        scale: 0.9,
        rotateY: -34,
        opacity: 0.82,
        zIndex: 20,
        filter: "blur(1.8px) brightness(0.9)",
      };
    }

    return {
      x: delta < 0 ? -320 : 320,
      y: 18,
      scale: 0.82,
      rotateY: delta < 0 ? 42 : -42,
      opacity: 0,
      zIndex: 10,
      filter: "blur(2.2px) brightness(0.82)",
    };
  };

  const openLanguageMenu = () => {
    if (languageMenuCloseTimeoutRef.current) {
      clearTimeout(languageMenuCloseTimeoutRef.current);
      languageMenuCloseTimeoutRef.current = null;
    }
    setIsLanguageMenuOpen(true);
  };

  const closeLanguageMenuWithDelay = () => {
    if (languageMenuCloseTimeoutRef.current) {
      clearTimeout(languageMenuCloseTimeoutRef.current);
    }

    languageMenuCloseTimeoutRef.current = setTimeout(() => {
      setIsLanguageMenuOpen(false);
      languageMenuCloseTimeoutRef.current = null;
    }, 140);
  };

  useEffect(() => {
    return () => {
      if (languageMenuCloseTimeoutRef.current) {
        clearTimeout(languageMenuCloseTimeoutRef.current);
      }
    };
  }, []);

  const localeBadge = (
    <aside className="fixed right-3 top-3 z-[90] sm:right-4 sm:top-4" aria-label="Selector de idioma">
      <div className="relative" onMouseEnter={openLanguageMenu} onMouseLeave={closeLanguageMenuWithDelay}>
        <button
          type="button"
          onClick={() => setIsLanguageMenuOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-full border border-white/20 bg-black/45 px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-100 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md"
        >
          <Image
            src={selectedFlagImageUrl}
            alt={`Bandera para ${selectedLanguage.locale}`}
            className="h-4 w-6 rounded-[2px] object-cover"
            width={24}
            height={16}
            priority
          />
          <span>{selectedLanguagePreference === "auto" ? messages.languageAuto : selectedLanguage.label}</span>
        </button>

        <div
          className={`absolute right-0 top-full w-40 rounded-xl border border-white/15 bg-black/85 p-2 shadow-[0_18px_42px_rgba(0,0,0,0.45)] transition ${
            isLanguageMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
          onMouseEnter={openLanguageMenu}
          onMouseLeave={closeLanguageMenuWithDelay}
        >
          <button
            type="button"
            onClick={() => {
              setSelectedLanguageCode("auto");
              setIsLanguageMenuOpen(false);
            }}
            className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-semibold uppercase tracking-[0.1em] transition ${
              selectedLanguagePreference === "auto" ? "bg-emerald-500/20 text-emerald-100" : "text-zinc-100 hover:bg-white/10"
            }`}
          >
            <span className="inline-flex h-4 w-6 items-center justify-center rounded-[2px] border border-white/20 text-[10px]">A</span>
            <span>{messages.languageAuto}</span>
          </button>

          {languageOptions.map((option) => {
            const optionFlagUrl = `https://flagcdn.com/w40/${option.countryCode}.png`;
            const isActive = option.code === selectedLanguagePreference;

            return (
              <button
                key={option.code}
                type="button"
                onClick={() => {
                  setSelectedLanguageCode(option.code);
                  setIsLanguageMenuOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-semibold uppercase tracking-[0.1em] transition ${
                  isActive ? "bg-emerald-500/20 text-emerald-100" : "text-zinc-100 hover:bg-white/10"
                }`}
              >
                <Image
                  src={optionFlagUrl}
                  alt={`Bandera ${option.label}`}
                  className="h-4 w-6 rounded-[2px] object-cover"
                  width={24}
                  height={16}
                />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );

  return (
    <main className="min-h-screen overflow-x-hidden overscroll-x-none bg-[radial-gradient(circle_at_top_left,#4a180f_0,transparent_28%),radial-gradient(circle_at_80%_10%,#1f3c2a_0,transparent_26%),linear-gradient(180deg,#090909_0%,#141414_58%,#0a0a0a_100%)] px-4 pt-10 pb-6 text-zinc-50 md:px-8 md:pt-14 md:pb-10">
      {localeBadge}
      <section className="mx-auto w-full max-w-6xl">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={homeHref}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:bg-white/10"
          >
            <span aria-hidden="true">←</span>
            <span>{messages.backToHome}</span>
          </Link>
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
            {category.title}
          </div>
        </div>

        <section className="mt-10 overflow-x-hidden md:mt-12">
          {items.length === 0 ? (
            <div className="rounded-[1.6rem] border border-white/10 bg-white/5 px-6 py-10 text-center text-zinc-200">
              <p>{messages.categoryEmpty}</p>
            </div>
          ) : (
            <div className="w-full max-w-[960px] px-1 md:px-8" style={{ perspective: "1500px" }}>
              <div className="overflow-x-hidden pt-4 md:pt-5">
                <div className="relative mx-auto h-[520px] w-full max-w-[560px] md:h-[660px]" style={{ transformStyle: "preserve-3d" }}>
                {items.map((item, index) => {
                  const delta = circularDelta(index);
                  const isActive = delta === 0;
                  const isVisible = Math.abs(delta) <= 1;

                  const cardContent = (
                    <>
                      <div className="aspect-[4/5] overflow-hidden rounded-t-[1.6rem] bg-black">
                        <video
                          src={item.video_url}
                          className="h-full w-full rounded-t-[1.6rem] object-cover"
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          style={{ touchAction: "pan-y" }}
                        />
                      </div>

                      <div className="p-4 md:p-5">
                        <p className="text-[1.08rem] font-semibold leading-[1.25] text-[#fbfbfb] md:text-[1.15rem]">{item.title}</p>
                        <p className="mt-1 break-words text-[0.88rem] leading-5 text-[#d2d2d2] md:text-[0.9rem]">{item.description}</p>
                      </div>
                    </>
                  );

                  return (
                    <motion.article
                      key={item.id}
                      animate={getCardMotion(delta)}
                      transition={{ type: "spring", stiffness: 165, damping: 26, mass: 1 }}
                      drag={isVisible ? "x" : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.14}
                      onDragStart={() => {
                        draggedRef.current = false;
                      }}
                      onDragEnd={(_, info) => {
                        draggedRef.current = Math.abs(info.offset.x) > 8;
                        if (info.offset.x < -70) {
                          goNext();
                          setTimeout(() => {
                            draggedRef.current = false;
                          }, 0);
                          return;
                        }
                        if (info.offset.x > 70) {
                          goPrev();
                          setTimeout(() => {
                            draggedRef.current = false;
                          }, 0);
                        }
                      }}
                      onClick={() => {
                        if (draggedRef.current) {
                          return;
                        }
                        if (delta === -1) {
                          goPrev();
                        }
                        if (delta === 1) {
                          goNext();
                        }
                      }}
                      className={`absolute left-1/2 top-0 w-full max-w-[300px] -translate-x-1/2 overflow-hidden rounded-[1.6rem] border bg-[#1f1f1f] sm:max-w-[330px] md:max-w-[360px] ${
                        isVisible ? "cursor-grab active:cursor-grabbing " : ""
                      }${
                        isActive
                          ? "border-white/20 shadow-[0_34px_56px_rgba(0,0,0,0.55)]"
                          : "border-white/10 shadow-[0_16px_34px_rgba(0,0,0,0.35)]"
                      }`}
                      style={{
                        pointerEvents: isVisible ? "auto" : "none",
                        transformStyle: "preserve-3d",
                        touchAction: "pan-y",
                        zIndex: isActive ? 50 : Math.abs(delta) === 1 ? 20 : 10,
                      }}
                      aria-hidden={!isVisible}
                    >
                      <div className="block h-full w-full">{cardContent}</div>
                    </motion.article>
                  );
                })}
                </div>
              </div>
            </div>
          )}
        </section>

        <div className="mt-20 flex justify-center md:mt-24">
          <FooterSection
            businessName={siteSettings?.business_name ?? "Bar Restaurante El Jardín"}
            addressLine1={siteSettings?.address_line_1 ?? "C. Fernando Díaz de Mendoza, 67"}
            addressLine2={siteSettings?.address_line_2 ?? "Carabanchel, 28019 Madrid"}
            phone={siteSettings?.phone ?? "+34 646 75 00 31"}
            rightsText={translations[resolveLanguageCode(selectedLanguagePreference === "auto" ? detectLanguageCodeFromLocale(browserLocale) : selectedLanguagePreference)].footerRights}
          />
        </div>
      </section>
    </main>
  );
}
