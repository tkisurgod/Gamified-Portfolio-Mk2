import { useState } from "react";
import BruteforceGame from "./components/minigame";
// TODO: Replace this with the actual path to your main portfolio component
import Home from "./components/Home"; 

export default function App() {
  // State to track if the user has passed the minigame
  const [gameCompleted, setGameCompleted] = useState(false);

  // If the game is not yet completed, render the minigame
  // and pass a function to update the state when it finishes
  if (!gameCompleted) {
    return <BruteforceGame onComplete={() => setGameCompleted(true)} />;
  }

  // Once the game is completed, render your main application/portfolio
  return (
    <Home />
  );
}
