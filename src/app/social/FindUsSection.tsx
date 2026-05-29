import type { BusinessHour } from "../../lib/supabase-public";

type FindUsSectionProps = {
  addressLine1: string;
  addressLine2: string;
  phone: string;
  mapsLink: string | null;
  mapsEmbedUrl: string | null;
  businessHours: BusinessHour[];
  copy: {
    kicker: string;
    title: string;
    address: string;
    phone: string;
    schedule: string;
    scheduleNotConfigured: string;
    openNavigation: string;
    mapTitle: string;
  };
};

export default function FindUsSection({
  addressLine1,
  addressLine2,
  phone,
  mapsLink,
  mapsEmbedUrl,
  businessHours,
  copy,
}: FindUsSectionProps) {
  return (
    <section className="w-full max-w-[960px] rounded-2xl border border-white/10 bg-white/5 px-5 py-6 text-center backdrop-blur-sm md:px-8 md:py-8">
      <p className="text-sm uppercase tracking-[0.12em] text-zinc-300">{copy.kicker}</p>
      <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">{copy.title}</h2>

      <div className="mt-5 grid gap-5 text-zinc-200 md:grid-cols-3 md:gap-6">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-100">{copy.address}</h3>
          <p className="mt-2 text-sm leading-relaxed md:text-base">{addressLine1}</p>
          <p className="text-sm leading-relaxed md:text-base">{addressLine2}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-100">{copy.phone}</h3>
          <p className="mt-2 text-sm leading-relaxed md:text-base">{phone}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-100">{copy.schedule}</h3>
          {businessHours.length > 0 ? (
            businessHours.map((schedule) => (
              <p key={schedule.id} className="mt-2 text-sm leading-relaxed md:text-base">
                {schedule.day_label}: {schedule.hours_text}
              </p>
            ))
          ) : (
            <p className="mt-2 text-sm leading-relaxed md:text-base">{copy.scheduleNotConfigured}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {mapsLink ? (
          <a
            href={mapsLink}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/20 bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            {copy.openNavigation}
          </a>
        ) : null}
      </div>
      {mapsEmbedUrl ? (
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
          <iframe
            title={copy.mapTitle}
            src={mapsEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[260px] w-full md:h-[320px]"
          />
        </div>
      ) : null}

    </section>
  );
}
