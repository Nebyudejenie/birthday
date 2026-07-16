import Reveal from "./Reveal";

/** Consistent chapter header: eyebrow + gilded display title + hairline. */
export default function SectionTitle({
  eyebrow,
  title,
  script,
}: {
  eyebrow?: string;
  title: string;
  script?: string;
}) {
  return (
    <Reveal className="mb-12 text-center">
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      {script && (
        <p className="font-script text-3xl text-rose sm:text-4xl">{script}</p>
      )}
      <h2 className="font-display text-4xl font-semibold leading-tight text-gilded sm:text-5xl md:text-6xl">
        {title}
      </h2>
      <div className="hairline mx-auto mt-6 w-40" />
    </Reveal>
  );
}
