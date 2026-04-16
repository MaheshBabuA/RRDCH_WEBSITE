import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="p-10 bg-white rounded-xl shadow-xl max-w-lg w-full text-center border border-slate-100">
        <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight mb-4">
          React Frontend Running
        </h1>
        
        <p className="text-slate-600 text-lg mb-8 font-medium">
          Vite + React + Tailwind CSS ready!
        </p>

        <div className="bg-slate-100 p-4 rounded-lg inline-block">
          <p className="text-sm text-slate-800 font-mono">
            API URL: {import.meta.env.VITE_API_URL}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
