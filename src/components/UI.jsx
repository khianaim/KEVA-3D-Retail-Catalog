import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";

// ------------------ DATA ------------------ //
const pictures = [
  "DSC02013", "DSC00681", "DSC01111", "DSC01112", 
  "DSC00000", "DSC02025", "DSC00933", "DSC01123",
  "DSC01103", "DSC01971", "DSC00966", "DSC02031", 
  "DSC01999", "DSC01040", "DSC01011", "DSC01064",
];

// ------------------ ATOMS ------------------ //
export const pageAtom = atom(0);
export const showFrontAtom = atom(true);

// ------------------ PAGE CONSTRUCTION ------------------ //
export const pages = [
  {
    front: "book-cover",
    back: pictures[0],
  },
];

const productPictures = pictures.slice(1);
for (let i = 0; i < productPictures.length; i += 2) {
  pages.push({
    front: productPictures[i],
    back: productPictures[i + 1] || "book-back",
  });
}

// ------------------ AUDIO PLAYER ------------------ //
const AudioPlayer = ({ muted, toggleMute }) => {
  return (
    <div className="pointer-events-auto mr-4 -mt-3">
      <img
        src={muted ? "/images/muted.png" : "/images/volume.png"}
        alt="Volume Control"
        onClick={toggleMute}
        className="w-4 h-4 cursor-pointer hover:opacity-60"
      />
    </div>
  );
};

// ------------------ MAIN UI COMPONENT ------------------ //
export const UI = () => {
  const [page, setPage] = useAtom(pageAtom);
  const [showFront, setShowFront] = useAtom(showFrontAtom);
  const [muted, setMuted] = useState(false);
  const [audio] = useState(() => new Audio("/audios/le_mans.mp3"));
  const [showTutorial, setShowTutorial] = useState(true);

  // Play audio immediately when the component mounts or when music is unmuted
  useEffect(() => {
    audio.loop = true;
    audio.muted = muted;
    audio.play()
      .then(() => {
        console.log("Audio is playing and should loop.");
      })
      .catch((err) => {
        console.error("Audio play error:", err);
      });

    return () => {
      audio.pause();
      console.log("Audio stopped.");
    };
  }, [audio, muted]);

  useEffect(() => {
    audio.muted = muted;
  }, [muted]);

  const toggleMute = () => setMuted((prev) => !prev);

  // Play audio when an arrow key is pressed or when a button is clicked
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Play audio on first key press
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        if (audio.paused) {
          audio.play(); // Start audio on key press
        }
        if (e.key === "ArrowLeft") {
          setPage((prev) => Math.max(prev - 1, 0));
        } else if (e.key === "ArrowRight") {
          setPage((prev) => Math.min(prev + 1, pages.length));
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [audio, setPage]);

  // Trigger audio on button click (whether mouse or keyboard)
  const handleButtonClick = (index) => {
    if (audio.paused) {
      audio.play(); // Start audio on button click
    }
    setPage(index); // Update page when button is clicked
  };

  // Function to handle first interaction (hide tutorial)
  const closeTutorial = () => {
    setShowTutorial(false); // Hide tutorial once user interacts
    audio.play(); // Ensure audio plays when the tutorial closes
  };

  return (
    <>
        {showTutorial && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-30 p-4 backdrop-blur-lg">
            <div className="flex flex-col items-center">
              {/* Logo */}
              <img
                className="w-16 h-16 object-contain mb-6"
                src="/images/keva_logo.png"
                alt="Logo"
              />

              {/* Tutorial Box */}
              <div className="relative bg-[#d0edf3c3] p-6 sm:p-8 rounded-xl w-full max-w-[90%] sm:max-w-sm opacity-95 shadow-lg">
                <button
                  onClick={closeTutorial}
                  className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-40 h-10 px-4 py-2 flex items-center justify-center text-white text-base sm:text-lg font-light rounded-full bg-[#471515] hover:bg-[#692021] transition-all whitespace-nowrap"
                >
                  <span>Explore looks</span>
                </button>
                <div className="text-black font-semibold">
                  <p className="text-base sm:text-lg text-center mt-2 mb-4">
                    Discover KEVA’s latest arrivals coming soon – use your keyboard to glide through styles effortlessly.
                  </p>
                  <div className="flex justify-center mb-4">
                    <img
                      src="/images/keynav.png"
                      alt="Keyboard Navigation"
                      className="w-32 sm:w-48 h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


          <main className="pointer-events-none select-none z-10 fixed inset-0 flex flex-col justify-between w-full h-full">
        
            {/* Top Navigation Bar */}
          <div className="flex justify-center w-full pt-6 pointer-events-auto">
          <div className="flex items-center gap-10 px-5 py-1 rounded-full bg-[#d8d6d8]/10 shadow-[inset_8px_8px_8px_#47151584,inset_-5px_-5px_5px_#d8d6d8d2] backdrop-blur-sm">
    
          {/* Logo */}
          <div className="flex items-center">
            <img className="w-16 h-16 object-contain -mt-1" src="/images/keva_logo.png" alt="Logo" />
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            <div className="font-light text-[#471515] text-base sm:text-lg hover:font-semibold cursor-pointer">LOG IN</div>
            <div className="font-light text-[#471515] text-base sm:text-lg hover:font-semibold cursor-pointer">SUBSCRIBE</div>
            <div className="font-light text-[#471515] text-base sm:text-lg hover:font-semibold cursor-pointer">HELP</div>
          </div>

          {/* Audio Player */}
          <div className="flex items-center mt-3 opacity-50">
            <AudioPlayer muted={muted} toggleMute={toggleMute} />
          </div>

        </div>
      </div>

  
        {/* Bottom Buttons */}
        <div className="flex justify-center w-full pb-6 pointer-events-auto">
          <div className="flex items-center gap-4 max-w-full p-5 rounded-full bg-[#d8d6d8]/10 shadow-[inset_8px_8px_8px_#47151584,inset_-5px_-5px_5px_#d8d6d8d2] backdrop-blur-sm overflow-auto">
            
            {[...Array(pages.length)].map((_, index) => (
              <button
                key={index}
                className={`transition-all duration-300 px-2 py-1 rounded-full text-sm uppercase shrink-0 
                  ${index === page
                    ? "text-[#471515] text-base sm:text-lg font-semibold shadow-[inset_4px_4px_8px_#47151584,inset_-4px_-4px_6px_#aaaaaa]"
                    : "text-[#471515] text-base sm:text-lg shadow-[inset_3px_3px_6px_#47151584,inset_-3px_-3px_6px_#aaaaaa]"}
                  hover:font-semibold active:shadow-[inset_6px_6px_12px_#d8d6d8d2,inset_-4px_-4px_6px_#d8d6d8d2]`}
                  onClick={() => {
                    handleButtonClick(index); // Trigger audio and page change on button click
                    closeTutorial(); // Hide tutorial message after first interaction
                  }}
                >
                  {index === 0 ? "<" : `${index}`}
                </button>
            ))}
  
            {/* The More button */}
            <button
              className={`transition-all duration-300 px-2 py-1 rounded-full text-sm uppercase shrink-0 
                ${page === pages.length
                  ? "text-[#471515] text-base sm:text-lg font-semibold shadow-[inset_4px_4px_8px_#47151584,inset_-4px_-4px_6px_#aaaaaa]"
                  : "text-[#471515] text-base sm:text-lg shadow-[inset_3px_3px_6px_#47151584,inset_-3px_-3px_6px_#aaaaaa]"}
                hover:font-semibold active:shadow-[inset_6px_6px_12px_#d8d6d8d2,inset_-4px_-4px_6px_#d8d6d8d2]`}
              onClick={() => setPage(pages.length - 1)}
            >
              >
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
