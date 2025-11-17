
self.onmessage = async function (e) {
  const { code, tests, timeoutMs } = e.data;
  try {
    let solve;
    try {
      const userWrapper = new Function(
        '"use strict";\n' +
          code +
          '; return typeof solve !== "undefined" ? solve : (typeof module !== "undefined" && module.exports ? module.exports : null);'
      );
      const exported = userWrapper();
      solve = typeof exported === "function" ? exported : self.solve || null;
    } catch (err) {
      self.postMessage({
        error: "Error while compiling code : " + String(err),
      });
      return;
    }

    if (typeof solve !== "function") {
      self.postMessage({
        error:
          'No function named "solve" found. Define it as function solve(...) { ... } or export it.',
      });
      return;
    }

    const results = [];
    for (const t of tests) {
      let passed = false;
      let actual;
      try {
        const candidate = solve.apply(null, t.args);
        if (candidate && typeof candidate.then === "function") {
          actual = await Promise.race([
            candidate,
            new Promise((_, rej) =>
              setTimeout(() => rej(new Error("Timeout")), timeoutMs)
            ),
          ]);
        } else {
          actual = candidate;
        }
        passed = deepEqual(actual, t.expected);
      } catch (err) {
        actual = "threw" + String(err);
        passed = false;
      }
      results.push({ name: t.name, passed, expected: t.expected, actual });
    }
    self.postMessage({ results });
  } catch (err) {
    self.postMessage({ error: String(err) });
  }

  function deepEqual(a, b) {
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch (e) {
      return false;
    }
  }
};
