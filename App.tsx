import { useEffect, useState } from "react";
import { WithSplashScreen } from "./components/SplashScreen";
import Navigation from "./navigation/index";

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {

    setIsAppReady(true);
  }, []);

  return (
    <>
      <WithSplashScreen isAppReady={isAppReady}>
        <Navigation />
      </WithSplashScreen>
    </>
  );

}
