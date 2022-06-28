let location = useLocation();
let matches = useMatches();

let isMount = true;
React.useEffect(() => {
  let mounted = isMount;
  isMount = false;
  if ("serviceWorker" in navigator) {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller?.postMessage(JSON.stringify({
        type: "REMIX_NAVIGATION",
        isMount: mounted,
        location,
        matches,
        manifest: window.__remixManifest,
      }));
    } else {
      let listener = async () => {
        await navigator.serviceWorker.ready;
        navigator.serviceWorker.controller?.postMessage(JSON.stringify({
          type: "REMIX_NAVIGATION",
          isMount: mounted,
          location,
          matches,
          manifest: window.__remixManifest,
        }));
      };
      navigator.serviceWorker.addEventListener("controllerchange", listener);
      return () => {
        navigator.serviceWorker.removeEventListener("controllerchange", listener);
      };
    }
  }
}, [location]);
