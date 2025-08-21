import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGears, faChartSimple, faCircleNotch } from "@fortawesome/free-solid-svg-icons";

export default async function HomePage() {
  return (
    <main className="bg-white font-poppins h-screen flex flex-col">
      {/* Título */}
      <section
        id="home-title"
        className="home-title flex-none mt-20 mb-10"
      >
        <h1 className="text-6xl text-royalblue-500 font-bold text-center mb-6">
          HiddenWords
        </h1>
        <h3 className="text-2xl text-neutral-600 text-center font-bold">
          ¡Descubre la palabra oculta!
        </h3>
      </section>

      {/* Main */}
      <section
        id="home-main"
        className="home-main flex-1 flex items-center justify-center gap-10"
      >
        {/* Card Wordle */}
        <Link
          href="/wordle"
          className="home-link group hover:shadow-xl duration-200 h-60 w-60 border border-white/30 rounded-lg overflow-hidden bg-white/20 backdrop-blur-sm shadow-lg flex flex-col items-center justify-center"
        >
          <div className="flex w-full py-3 items-center justify-center bg-royalblue-500 group-hover:bg-royalblue-700 transition-colors">
            <h1 className="text-2xl tracking-wide font-bold text-white">
              Wordle
            </h1>
          </div>
          <div className="flex flex-col items-center justify-between py-3 flex-1">
            <div className="grid grid-cols-4 gap-2 px-3 justify-center">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square h-7 rounded-sm bg-neutral-200"
                />
              ))}
            </div>
            <span className="font-bold text-neutral-600">
              ¡Adivina la palabra!
            </span>
          </div>
        </Link>

        {/* Card Próximamente */}
        <div className="home-link pointer-events-none h-60 w-60 border border-white/30 rounded-lg overflow-hidden bg-white/20 backdrop-blur-sm shadow-lg flex flex-col items-center justify-center">
          <div className="flex w-full py-3 items-center justify-center bg-neutral-300">
            <h1 className="text-2xl tracking-wide font-bold text-neutral-600">
              Próximamente
            </h1>
          </div>
          <div className="flex flex-col items-center justify-between py-3 flex-1">
            <div className="text-neutral-300 flex items-center justify-center flex-1 text-7xl">
              <FontAwesomeIcon icon={faCircleNotch} spin />
            </div>
            <span className="font-bold text-neutral-600">
              ¡Nuevo juego en camino!
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section
        id="home-footer"
        className="home-footer h-[196px] mt-10 flex-none flex items-center justify-center gap-10 p-4 text-neutral-600"
      >
        <a
          href="#"
          className="pointer-events-none flex items-center gap-1 font-bold"
        >
          <FontAwesomeIcon icon={faGears} className="text-xl" /> Configuración
        </a>
        <a
          href="#"
          className="pointer-events-none flex items-center gap-1 font-bold"
        >
          <FontAwesomeIcon icon={faChartSimple} className="text-xl" /> Estadísticas
        </a>
      </section>
    </main>
  );
}
