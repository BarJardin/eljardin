import type { Testimonial } from "../../lib/supabase-public";

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
  copy: {
    kicker: string;
    title: string;
    noTestimonials: string;
    ratingLabel: string;
  };
};

const renderStars = (rating: number) => {
  const totalStars = 5;
  return Array.from({ length: totalStars }, (_, index) => {
    const filled = index < rating;
    return (
      <span key={`${rating}-${index}`} className={filled ? "text-amber-300" : "text-zinc-600"}>
        ★
      </span>
    );
  });
};

export default function TestimonialsSection({ testimonials, copy }: TestimonialsSectionProps) {
  return (
    <section className="w-full max-w-[960px] rounded-2xl border border-white/10 bg-black/20 px-5 py-6 text-center backdrop-blur-sm md:px-8 md:py-8">
      <p className="text-sm uppercase tracking-[0.12em] text-zinc-300">{copy.kicker}</p>
      <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">{copy.title}</h2>

      <div className="mt-5 grid gap-4 text-left md:grid-cols-3">
        {testimonials.length > 0 ? (
          testimonials.map((testimonial) => (
            <article key={testimonial.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-1 text-sm" aria-label={`${copy.ratingLabel} ${testimonial.rating} de 5`}>
                {renderStars(testimonial.rating)}
                <span className="ml-2 text-zinc-300">{testimonial.rating}.0/5</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-100">&quot;{testimonial.quote}&quot;</p>
              <p className="mt-3 text-sm font-semibold text-zinc-300">{testimonial.author}</p>
            </article>
          ))
        ) : (
          <p className="text-sm text-zinc-300">{copy.noTestimonials}</p>
        )}
      </div>
    </section>
  );
}
