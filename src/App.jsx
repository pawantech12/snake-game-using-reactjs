import React from "react";
import SnakeGame from "./components/SnakeGame";

function App() {
  return (
    <div className="App">
      <main className="flex justify-center items-center h-screen bg-gray-100">
        <SnakeGame />
      </main>
    </div>
  );
}

export default App;
