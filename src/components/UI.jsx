import { atom, useAtom } from "jotai";
import { useEffect } from "react";

// ------------------ DATA ------------------ //
const pictures = [
  "DSC00933", // book cover
  "DSC00680",
  "DSC01971",
  "DSC01103",
  "DSC02026",
  "DSC02025",
  "DSC01071",
  "DSC00000",
  "DSC00966",
  "DSC02031",
  "DSC01999",
  "DSC01040",
  "DSC02013",
  "DSC00983",
  "DSC01011",
  "DSC01064",
];

const descriptions = [
  "Blue Spike Sunnies",
  "Wrap Denim Dress",
  "Shoulder Slink",
  "Halterneck Slink",
  "Pearlbead Earrings",
  "Spiked Jacket",
  "Oversized Blazer",
  "Vintage Halter Maxi",
  "Boho Overthrow",
  "Silk Two Piece",
  "Corset Ruffle Dress",
  "Ruffle Sleeve",
  "Puffer Hoodie",
  "Speckle Fanny",
  "Forrest Set",
  "Blazer Set",
];

const prices = [
  "$9.99",
  "$39.99",
  "$29.99",
  "$29.99",
  "$9.99",
  "$69.99",
  "$19.99",
  "$89.99",
  "$19.99",
  "$39.99",
  "$69.99",
  "$29.99",
  "$39.99",
  "$12.99",
  "$25.99",
  "$39.99",
];

// ------------------ ATOMS ------------------ //
export const pageAtom = atom(0);
export const showFrontAtom = atom(true);

// ------------------ PAGE CONSTRUCTION ------------------ //
export const pages = [
  {
    front: "book-cover", // cover page
    back: pictures[0],   // use first picture for the back of cover
  },
];

// Skip the first image used as cover
const productPictures = pictures.slice(1);

for (let i = 0; i < productPictures.length; i += 2) {
  pages.push({
    front: productPictures[i],
    back: productPictures[i + 1] || "book-back",
    frontDescription: descriptions[i] || "",
    frontPrice: prices[i] || "",
    backDescription: descriptions[i + 1] || "",
    backPrice: prices[i + 1] || "",
  });
}

// ------------------ COMPONENT ------------------ //
export const UI = () => {
  const [page, setPage] = useAtom(pageAtom);
  const [showFront, setShowFront] = useAtom(showFrontAtom);

  useEffect(() => {
    const audio = new Audio("/audios/page-flip-01a.mp3");
    audio.play();
  }, [page]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setPage((prevPage) => Math.max(prevPage - 1, 0));
      } else if (e.key === "ArrowRight") {
        setPage((prevPage) => Math.min(prevPage + 1, pages.length));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <main className="pointer-events-none select-none z-10 fixed inset-0 flex flex-col flex-grow justify-between">
        <a className="pointer-events-auto mt-10 ml-10">
          <img className="w-20 h-20 relative top-[-50px]" src="/images/keva_logo.png" />
          <img className="w-6 h-6 relative top-[-100px] right-[-1150px]" src="/images/cart.png" />
        </a>

        <div className="w-full overflow-auto pointer-events-auto flex flex-col items-center">
  <div className="flex flex-col items-center gap-4 pointer-events-auto w-full max-w-md">
    {page > 0 && page < pages.length && (
      <div className="group relative w-[60%] overflow-hidden transition-all duration-500 ease-in-out bg-[#c6b5c6]/80 rounded-xl shadow-lg">
        <div className="flex justify-between items-center px-3 py-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFront(!showFront)}
              className="flex text-center justify-center items-center text-xl text-[#000000ce]"
            >
              {showFront ? "+" : "+"}
            </button>
            {/* Front Description and Price */}
            {showFront ? (
              <>
                <p className="text-[#000000ce] font-light text-sm">
                  {pages[page]?.frontDescription}
                </p>
              </>
            ) : (
              <>
                {/* Back Description and Price */}
                <p className="text-[#000000ce] font-light text-sm">
                  {pages[page]?.backDescription}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Always Visible Button with Hover Effect */}
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 transition-all duration-500 ease-in-out">
            <button type="button" className="add-btn">
              {/* Visible price (initial state) */}
              <span className="add-btn__visible">
                {showFront ? pages[page]?.frontPrice : pages[page]?.backPrice}
              </span>
              
              {/* Hidden "Add to Cart" (slides in on hover) */}
              <span className="add-btn__invisible">
               BUY
              </span>
            </button>
          </div>
      </div>
    )}
  </div>

        {/* Buttons Row */}
        <div className="overflow-auto flex items-center gap-4 max-w-full p-10 mt-auto">
          {[...Array(pages.length)].map((_, index) => (
            <button
              key={index}
              className={`transition-all duration-300 px-2 py-1 rounded-full text-sm uppercase shrink-0 
              ${index === page
                  ? "bg-[#d8d6d825] text-[#000000ce] font-semibold shadow-[6px_6px_6px_#47151584]"
                  : "bg-[#867986]/30 text-[#000000ce] shadow-[4px_4px_5px_#47151584]"
                } 
              active:shadow-[inset_6px_6px_12px_#d8d6d8d2,inset_-4px_-4px_10px_#d8d6d8d2]`}
              onClick={() => setPage(index)}
            >
              {index === 0 ? "Explore" : `${index}`}
            </button>
          ))}

          {/* The More button */}
          <button
            className={`transition-all duration-300 px-2 py-1 rounded-full text-sm uppercase shrink-0 
            ${page === pages.length // Check if the current page is "More"
                ? "bg-[#d8d6d825] text-[#000000ce] font-semibold shadow-[6px_6px_6px_#47151584]"
                : "bg-[#867986]/30 text-[#000000ce] shadow-[4px_4px_5px_#47151584]"
              } 
            active:shadow-[inset_6px_6px_12px_#d8d6d8d2,inset_-4px_-4px_10px_#d8d6d8d2]`}
            onClick={() => setPage(pages.length - 1)}  // Navigate to the "More" page
          >
            More
          </button>
        </div>
    </div>
  </main>

      <div className="fixed inset-0 flex items-center -rotate-2 select-none">
        <div className="relative">
          <div className="bg-white/0  animate-horizontal-scroll flex items-center gap-8 w-max px-8">
            <h2 className="shrink-0 text-[#471515ce] text-13xl font-bold italic">
            Shop
            </h2>
            <h2 className="shrink-0 text-[#471515ce] text-13xl font-bold italic">
            New Arrivals
            </h2>
            <h2 className="shrink-0 text-[#471515ce] text-13xl font-bold italic">
            New Arrivals
            </h2>
          </div>
          <div className="absolute top-0 left-0 bg-white/0 animate-horizontal-scroll-2 flex items-center gap-8 px-8 w-max">
          <h2 className="shrink-0 text-[#471515ce] text-13xl font-bold italic">
            Shop
            </h2>
            <h2 className="shrink-0 text-[#471515ce] text-13xl font-bold italic">
            New Arrivals
            </h2>
            <h2 className="shrink-0 text-[#471515ce] text-13xl font-bold italic">
            New Arrivals
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};
