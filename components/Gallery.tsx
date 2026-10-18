import Image from "next/image";
import photo1 from "@/assets/gallery/puc-rio-1.jpg";
import photo2 from "@/assets/gallery/puc-rio-2.jpg";
import photo3 from "@/assets/gallery/puc-rio-3.jpg";
import photo4 from "@/assets/gallery/puc-rio-4.jpg";

const photos = [
  { src: photo1, alt: "Grupo grande de estudantes reunido na rua do campus, com bandeiras do Brasil e sinais de V com as mãos." },
  { src: photo2, alt: "Organizadores sorrindo e acenando de cima do carro de som, alguns com a bandeira do Brasil nos ombros." },
  { src: photo3, alt: "Organizadores no carro de som com os braços erguidos e uma bandeira do Brasil ao vento, diante da multidão." },
  { src: photo4, alt: "Estudantes de costas acompanhando a fala do carro de som, com a bandeira do Brasil ao fundo." },
];

// Photos from the first gathering on campus. The first is wide, the other three share a row.
export function Gallery() {
  return (
    <div className="gallery" data-reveal>
      {photos.map((p, i) => (
        <figure key={i} className={`gallery-item rise${i === 0 ? " gallery-lead" : ""}`} style={{ "--i": i } as React.CSSProperties}>
          <Image
            src={p.src}
            alt={p.alt}
            placeholder="blur"
            sizes={i === 0 ? "(max-width: 1200px) 100vw, 1152px" : "(max-width: 700px) 100vw, (max-width: 1200px) 33vw, 384px"}
          />
        </figure>
      ))}
    </div>
  );
}
