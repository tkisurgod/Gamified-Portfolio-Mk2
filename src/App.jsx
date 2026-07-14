import { useState } from "react";
import BruteforceGame from "./components/minigame";
import Desktop from "./components/Desktop/Desktop";

export default function App() {
  const [gameCompleted, setGameCompleted] = useState(false);

  if (!gameCompleted) {
    return <BruteforceGame onComplete={() => setGameCompleted(true)} />;
  }

  return <Desktop />;
}
