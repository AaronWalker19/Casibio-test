import { useEffect, useState } from "react";


function App() {
  const [data, setData] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/api/test")
      .then(res => res.json())
      .then(data => setData(data.message));
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold text-blue-200">CASiBIO</h1>
      <p>{data}</p>
      <div className="bg-red-500 text-white text-4xl">
      TEST TAILWIND
    </div>
    </div>
    
  );
}

export default App;