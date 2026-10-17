import Image from "next/image";
import { bookCovers } from "@/assets/books/covers";

export type CoverBook = { slug: string; title: string; author: string; year: number; front?: string; /** Uploaded cover (public address); wins over the file in assets/books/covers. */ coverUrl?: string | null };

// The real cover when assets/books/covers has one for this slug; otherwise a typeset cover in the brand colours,
// toned by front, with the logo's bracket in the corner. Covers are decorative here: the title is always next to them.
const TONE: Record<string, string> = {
  Economia: "green",
  Instituições: "ink",
  Educação: "yellow",
  Direito: "deep",
  Filosofia: "paper",
  Empreendedorismo: "leaf",
};

const SIZES = { sm: "72px", md: "(max-width: 600px) 45vw, 240px", lg: "(max-width: 960px) 40vw, 320px" } as const;

export function BookCover({ book, size = "md" }: { book: CoverBook; size?: "sm" | "md" | "lg" }) {
  if (book.coverUrl) {
    return (
      <div className={`cover cover-img cover-${size}`} style={{ aspectRatio: "2 / 3" }} aria-hidden="true">
        <Image src={book.coverUrl} alt="" fill sizes={SIZES[size]} />
      </div>
    );
  }
  const image = bookCovers[book.slug];
  if (image) {
    return (
      <div className={`cover cover-img cover-${size}`} style={{ aspectRatio: `${image.width} / ${image.height}` }} aria-hidden="true">
        <Image src={image} alt="" fill sizes={SIZES[size]} placeholder="blur" />
      </div>
    );
  }

  // Size the title so its longest word fits the cover's width without breaking.
  const longest = Math.max(...book.title.split(" ").map((w) => w.length));
  const titleSize = Math.min(13.5, 78 / (longest * 0.52));
  return (
    <div className={`cover cover-${TONE[book.front ?? ""] ?? "green"} cover-${size}`} aria-hidden="true">
      <span className="cover-bracket" />
      <span className="cover-in">
        <span className="cover-author">{book.author}</span>
        <span className="cover-title" style={{ fontSize: `max(11px, ${titleSize.toFixed(2)}cqw)` }}>
          {book.title}
        </span>
        <span className="cover-year">{book.year}</span>
      </span>
    </div>
  );
}
