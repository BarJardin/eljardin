type FooterSectionProps = {
  businessName: string;
  addressLine1: string;
  addressLine2: string;
  phone: string;
  rightsText: string;
};

export default function FooterSection({ businessName, addressLine1, addressLine2, phone, rightsText }: FooterSectionProps) {
  return (
    <footer className="w-full max-w-[960px] rounded-2xl border border-white/10 bg-black/30 px-5 py-6 text-center backdrop-blur-sm md:px-8 md:py-8">
      <p className="text-lg font-semibold text-zinc-100 md:text-xl">{businessName}</p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-300 md:text-base">{addressLine1}</p>
      <p className="text-sm leading-relaxed text-zinc-300 md:text-base">{addressLine2}</p>

      <p className="mt-4 text-sm font-medium text-zinc-200 md:text-base">{phone}</p>

      <div className="mx-auto mt-5 h-px w-full max-w-[740px] bg-white/15" aria-hidden="true" />

      <p className="mt-4 text-xs text-zinc-400 md:text-sm">
        © 2026 Bar Restaurante El Jardín. {rightsText}
      </p>
    </footer>
  );
}
