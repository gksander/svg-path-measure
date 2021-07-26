import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

const App: React.FC = () => {
  const pathRef = React.useRef<SVGPathElement>(null);
  const lengthRef = React.useRef<HTMLInputElement>(null);
  const [d, setD] = React.useState("");
  const [pathLength, setPathLength] = React.useState(0);
  const [hasBeenCopied, setHasBeenCopied] = React.useState(false);

  React.useEffect(() => {
    setPathLength(pathRef?.current?.getTotalLength() || 0);
  }, [d]);

  const copyLength = () => {
    if (!pathLength) return;

    lengthRef?.current?.select();
    lengthRef?.current?.setSelectionRange(0, 1000);
    document.execCommand("copy");
    lengthRef?.current?.blur();

    setHasBeenCopied(true);
  };

  React.useEffect(() => {
    if (hasBeenCopied) {
      const t = setTimeout(() => setHasBeenCopied(false), 3000);

      return () => {
        clearTimeout(t);
      };
    }
  }, [hasBeenCopied]);

  return (
    <div className="w-full h-screen bg-gray-200 font-serif">
      <div className="bg-gradient-to-b from-purple-800 to-purple-500 p-5 pb-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-white text-4xl">Svg Path Length</div>
          <div className="text-white text-lg font-thin font-sans">
            Paste your path, get a length.
          </div>
        </div>
      </div>
      <div className="-my-16 pt-3">
        <div className="max-w-2xl mx-auto bg-white rounded p-4">
          <div className="font-bold text-gray-700 font-serif">Your path:</div>
          <div className="border rounded flex flex-row items-center overflow-hidden">
            <div className="p-2 bg-gray-50 text-gray-700 text-sm">d =</div>
            <div className="flex-grow">
              <input
                className="p-2 w-full font-sans"
                value={d}
                onChange={(e) => setD(e.target.value)}
                placeholder="d="
              />
            </div>
          </div>
          <div className="h-4" />
          <div className="font-bold text-gray-700 font-serif">Path length:</div>
          <div onClick={copyLength}>
            <input
              ref={lengthRef}
              className="bg-gray-50 border p-3 rounded text-xl cursor-pointer w-full"
              value={pathLength || "---"}
              onChange={() => null}
              disabled={!pathLength}
            />
          </div>
          <AnimatePresence>
            {hasBeenCopied && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="h-1" />
                  <div className="text-sm font-sans text-green-700">
                    Copied to clipboard! 👍
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="hidden w-0 h-0">
        <svg>
          <path d={d} ref={pathRef} />
        </svg>
      </div>
    </div>
  );
};

export default App;
