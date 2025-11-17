import React, { useState, useRef, useEffect } from "react";

function formatTime(s) {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

function stringify(v) {
  try {
    return typeof v === "string" ? `${v}` : JSON.stringify(v);
  } catch (e) {
    return String(v);
  }
}

function createRunnerWorker() {
  // Use a dedicated worker file for compatibility with esbuild and Vite
  return new Worker(new URL("./RunnerWorker.js", import.meta.url));
}

// Challenges array — small, approachable puzzles.
const challenges = [
  {
    title: "Sum of Array",
    description: "Return the sum of numbers in the array.",
    signature: "function solve(nums: number[]): number",
    examples: ["solve([1,2,3]) -> 6", "solve([]) -> 0"],
    hint: "Use Array.prototype.reduce or a simple loop.",
    starter: `// Return the sum of numbers in the array\n\nfunction solve(nums) {\n// your code here\n return 0;\n}\n\nreturn solve;`,
    tests: [
      { name: "empty array", args: [[]], expected: 0 },
      { name: "small array", args: [[1, 2, 3]], expected: 6 },
      { name: "negatives", args: [[-1, 5, -4]], expected: 0 },
    ],
  },
  {
    title: "Reverse String",
    description: "Return the reversed string.",
    signature: "function solve(s: string): string",
    examples: ["solve('abc') -> 'cba'"],
    hint: "Strings can be split into arrays, reversed, and joined back.",
    starter: `function solve(s) {\n // implement me\n return '';\n}\n\nreturn solve;`,
    tests: [
      { name: "empty", args: [""], expected: "" },
      { name: "word", args: ["hello"], expected: "olleh" },
    ],
  },
  {
    title: "FizzBuzz Label",
    description:
      "Given n, return an array of length n where multiples of 3 are 'Fizz', multiples of 5 are 'Buzz', multiples of both 'FizzBuzz', otherwise the number.",
    signature: "function solve(n: number): Array<string|number>",
    examples: ["solve(5) -> [1,2,'Fizz',4,'Buzz']"],
    hint: "Classic FizzBuzz — check 15 before 3 and 5.",
    starter: `function solve(n) {\n // implement me\n return []; \n}\n\nreturn solve;`,
    tests: [
      { name: "n=1", args: [1], expected: [1] },
      { name: "n=5", args: [5], expected: [1, 2, "Fizz", 4, "Buzz"] },
      {
        name: "n=15",
        args: [15],
        expected: (function () {
          const arr = [];
          for (let i = 1; i <= 15; i++) {
            if (i % 15 === 0) arr.push("FizzBuzz");
            else if (i % 3 === 0) arr.push("Fizz");
            else if (i % 5 === 0) arr.push("Buzz");
            else arr.push(i);
          }
          return arr;
        })(),
      },
    ],
  },
];

const CodingGame = () => {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [editorCode, setEditorCode] = useState(challenges[0].starter);
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes per session
  const [showHint, setShowHint] = useState(false);
  const workerRef = useRef(null);
  const [lastResults, setLastResults] = useState([]);

  useEffect(() => {
    // create worker
    workerRef.current = createRunnerWorker();
    const worker = workerRef.current;
    worker.onmessage = (e) => {
      const { id, results, error } = e.data;
      setRunning(false);
      if (error) {
        setOutput({ error: error });
        setLastResults([]);
      } else {
        setOutput({ results });
        setLastResults(results);
        const passedAll = results.every((r) => r.passed);
        if (passedAll) {
          // award score and auto-advance after a beat
          setScore((s) => s + 100 + Math.max(0, timeLeft - 60));
        }
      }
    };
    return () => {
      worker.terminate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setEditorCode(challenges[challengeIndex].starter);
    setOutput(null);
    setLastResults([]);
    setShowHint(false);
  }, [challengeIndex]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  function runCode() {
    setRunning(true);
    setOutput(null);
    const worker = workerRef.current;
    const payload = {
      code: editorCode,
      tests: challenges[challengeIndex].tests,
      timeoutMs: 1500,
    };
    let responded = false;
    // Add a one-time message handler for this run
    const handleMessage = (e) => {
      responded = true;
      worker.removeEventListener("message", handleMessage);
      const { id, results, error } = e.data;
      setRunning(false);
      if (error) {
        setOutput({ error: error });
        setLastResults([]);
      } else {
        setOutput({ results });
        setLastResults(results);
        const passedAll = results.every((r) => r.passed);
        if (passedAll) {
          setScore((s) => s + 100 + Math.max(0, timeLeft - 60));
        }
      }
    };
    worker.addEventListener("message", handleMessage);
    // Add a timeout in case the worker fails
    setTimeout(() => {
      if (!responded) {
        worker.removeEventListener("message", handleMessage);
        setRunning(false);
        setOutput({
          error:
            "Code runner did not respond. There may be a syntax error, infinite loop, or browser restriction.",
        });
      }
    }, 2500);
    // Post the code to the worker
    worker.postMessage(payload);
  }

  function nextChallenge() {
    setChallengeIndex((i) => Math.min(challenges.length - 1, i + 1));
  }

  function prevChallenge() {
    setChallengeIndex((i) => Math.max(0, i - 1));
  }

  function resetSession() {
    setScore(0);
    setTimeLeft(300);
    setChallengeIndex(0);
    setEditorCode(challenges[0].starter);
    setOutput(null);
    setLastResults([]);
  }

  const challenge = challenges[challengeIndex];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">
          CodeGame — JavaScript Coding Challenges
        </h2>
        <div className="text-right">
          <div className="text-sm">Score</div>
          <div className="font-mono text-lg">{score}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-lg font-medium text-gray-800">
                  {challenge.title}
                </div>
                <div className="text-sm text-gray-700">
                  {challenge.description}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Challenge {challengeIndex + 1} / {challenges.length}
              </div>
            </div>

            <label className="block text-xs text-gray-600 mb-1">Editor</label>
            <div className="relative w-full h-60 border rounded bg-gray-50 font-mono text-sm">
              {/* Overlay for syntax highlighting */}
              <pre
                aria-hidden="true"
                className="absolute inset-0 m-0 p-2 whitespace-pre-wrap break-words pointer-events-none select-none overflow-auto"
                style={{
                  color: "inherit",
                  fontFamily: "inherit",
                  fontSize: "inherit",
                }}
              >
                {/* Highlight: comments green, starter code blue, user-edited code dark */}
                {(() => {
                  const starterLines = challenge.starter.split("\n");
                  return editorCode.split("\n").map((line, idx) => {
                    const isComment = /^\s*\/\//.test(line);
                    // Pre-written uncommented line: matches starter and not a comment
                    const isStarter = !isComment && starterLines[idx] === line && line.trim() !== "";
                    let color = "#1f2937"; // default: dark
                    if (isComment) color = "#22c55e"; // green
                    else if (isStarter) color = "#2563eb"; // blue-600
                    return (
                      <span
                        key={idx}
                        style={{
                          color,
                          display: "block",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {line === "" ? "\u200b" : line}
                      </span>
                    );
                  });
                })()}
              </pre>
              {/* Transparent textarea for editing */}
              <textarea
                value={editorCode}
                onChange={(e) => setEditorCode(e.target.value)}
                className="absolute inset-0 w-full h-full p-2 bg-transparent text-gray-800 focus:outline-none resize-none border-none font-mono text-sm"
                style={{ color: "transparent", caretColor: "#1f2937" }}
                spellCheck={false}
              />
            </div>

            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={runCode}
                disabled={running}
                className="px-4 py-2 rounded-lg shadow-sm border hover:shadow active:scale-95 disabled:opacity-60 bg-gray-900 text-white hover:bg-gray-800 transition"
              >
                {running ? "Running..." : "Run"}
              </button>

              <button
                onClick={() => setEditorCode(challenge.starter)}
                className="px-3 py-2 rounded-lg border text-sm bg-gray-900 text-white hover:bg-gray-800 transition"
              >
                Reset Editor
              </button>

              <button
                onClick={() => setShowHint((s) => !s)}
                className="px-3 py-2 rounded-lg border text-sm bg-gray-900 text-white hover:bg-gray-800 transition"
              >
                {showHint ? "Hide Hint" : "Show Hint"}
              </button>

              <div className="ml-auto text-sm text-gray-600">
                Time left: {formatTime(timeLeft)}
              </div>
            </div>

            {showHint && (
              <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700">
                {challenge.hint}
              </div>
            )}

            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Test results</div>
              <div className="space-y-2">
                {output && output.error && (
                  <div className="text-red-600 font-mono text-sm">
                    Runtime error: {String(output.error)}
                  </div>
                )}

                {lastResults.length === 0 && !output && (
                  <div className="text-sm text-gray-500">
                    No runs yet — press Run to test your solution.
                  </div>
                )}

                {lastResults.map((r, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        r.passed ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <div className="text-sm font-mono">{r.name}</div>
                    <div className="ml-auto text-sm">
                      {r.passed
                        ? "Passed"
                        : `Failed — expected ${stringify(
                            r.expected
                          )}, got ${stringify(r.actual)}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <button
              onClick={prevChallenge}
              className="px-3 py-2 border rounded"
            >
              Prev
            </button>
            <button
              onClick={nextChallenge}
              className="px-3 py-2 border rounded"
            >
              Next
            </button>
            <button
              onClick={resetSession}
              className="px-3 py-2 border rounded ml-auto"
            >
              Reset Session
            </button>
          </div>
        </div>

        <aside className="bg-white rounded-2xl shadow p-4">
          <div className="text-sm text-gray-600 mb-2">Challenge details</div>
          <div className="mb-3">
            <div className="text-xs text-gray-500">Function signature</div>
            <div className="font-mono bg-gray-50 p-2 rounded mt-1 text-sm">
              {challenge.signature}
            </div>
          </div>

          <div className="mb-3">
            <div className="text-xs text-gray-500">Examples</div>
            <div className="text-sm font-mono bg-gray-50 p-2 rounded mt-1">
              {challenge.examples.join("\n")}
            </div>
          </div>

          <div className="mb-3">
            <div className="text-xs text-gray-500">Scoring</div>
            <div className="text-sm">
              100 points for full pass + time bonus.
            </div>
          </div>

          <div className="mb-3">
            <div className="text-xs text-gray-500">Hints & Tips</div>
            <ul className="text-sm list-disc pl-4">
              <li>Implement the function the challenge asks for.</li>
              <li>Keep pure functions — avoid DOM access in tests.</li>
              <li>
                Use console.log for debugging (worker will capture errors only).
              </li>
            </ul>
          </div>

          <div className="text-xs text-gray-500">Session controls</div>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setTimeLeft((t) => Math.max(0, t - 60))}
              className="px-2 py-1 border rounded text-sm"
            >
              -1m
            </button>
            <button
              onClick={() => setTimeLeft((t) => t + 60)}
              className="px-2 py-1 border rounded text-sm"
            >
              +1m
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
export default CodingGame;
