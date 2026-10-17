// Vector redraw of public/brand/logo.png, traced from the original at 1:1 (viewBox = its 320×300 artwork box).
export const BRAND = { green: "#006332", yellow: "#FCB431", ink: "#191617" };

// Each piece is one path so overlapping rounded rects leave no anti-aliasing seam.
export const L_PATH = "M7 0H66A7 7 0 0 1 73 7V242H216A7 7 0 0 1 223 249V293A7 7 0 0 1 216 300H7A7 7 0 0 1 0 293V7A7 7 0 0 1 7 0Z";
export const BRACKET_PATH = "M111 0H313A7 7 0 0 1 320 7V293A7 7 0 0 1 313 300H254A7 7 0 0 1 247 293V57H111A7 7 0 0 1 104 50V7A7 7 0 0 1 111 0Z";
export const J_PATH = "M156 71H218V172A66.5 58 0 0 1 85 172V147H127V166A14.5 14 0 0 0 156 166Z";

type Props = { size?: number; className?: string; title?: string };

export function LogoMark({ size = 32, className, title }: Props) {
  return (
    <svg
      viewBox="0 0 320 300"
      width={size}
      height={(size * 300) / 320}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path d={L_PATH} fill={BRAND.green} />
      <path d={BRACKET_PATH} fill={BRAND.yellow} />
      <path d={J_PATH} fill={BRAND.ink} />
    </svg>
  );
}
