import { useEffect, useState } from "react";
import { WithSplashScreen } from "./components/SplashScreen";
import Navigation from "./navigation/index";
import { notificationListener, requestUserPermission } from "./utils/notificationService";


export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    requestUserPermission()
    notificationListener()
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
