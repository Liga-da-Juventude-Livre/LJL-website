import type { PublicBook } from "@/modules/books/public";
import { BookCover } from "./BookCover";

// Five covers rise stacked and open into a fan; hovering lifts one above the rest. The fan is the resting pose,
// so without motion (or before the animation) the page still shows it.
const PICK = ["as-seis-licoes", "a-lei", "o-caminho-da-servidao", "livre-para-escolher", "segundo-tratado-sobre-o-governo"];
const POSE: [x: number, y: number, r: number][] = [
  [-62, 26, -18],
  [-31, 6, -9],
  [0, -4, 0],
  [31, 6, 9],
  [62, 26, 18],
];

export function CoverFan({ books }: { books: PublicBook[] }) {
  // The usual five, then whatever else is published if one of them is missing; with fewer than three there is no fan.
  const picked = PICK.map((slug) => books.find((b) => b.slug === slug)).filter((b): b is PublicBook => !!b);
  const fan = [...picked, ...books.filter((b) => !picked.includes(b))].slice(0, 5);
  if (fan.length < 3) return null;
  const pose = POSE.slice(Math.floor((POSE.length - fan.length) / 2), Math.floor((POSE.length - fan.length) / 2) + fan.length);
  const mid = (fan.length - 1) / 2;
  return (
    <div className="fan" aria-hidden="true">
      {fan.map((b, i) => (
        <div
          key={b.slug}
          className="fan-card"
          style={
            {
              "--i": i,
              "--x": `${pose[i][0]}%`,
              "--y": `${pose[i][1]}px`,
              "--r": `${pose[i][2]}deg`,
              zIndex: 5 - Math.round(Math.abs(i - mid)),
            } as React.CSSProperties
          }
        >
          <BookCover book={b} size="lg" />
        </div>
      ))}
    </div>
  );
}
