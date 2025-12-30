export function getNowMs(headers: Headers): number {
     console.log("the type is",typeof(process.env.TEST_MODE));
  if (process.env.TEST_MODE === "1") {
      const h = headers.get("x-test-now-ms");
      if (h) {
          const ms = Number(h);
          console.log("i am here",ms)
      if (!Number.isNaN(ms)) {
        console.log("hurray",ms)
        return Date.now()+ms;
      }
    }
  }
  return Date.now();
}
