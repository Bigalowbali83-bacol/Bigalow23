
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Global Error Handler untuk menampilkan pesan di layar jika terjadi crash fatal
const renderError = (error: any) => {
    rootElement.innerHTML = `
        <div style="display:flex; flex-direction:column; height:100vh; justify-content:center; align-items:center; background-color:#111827; color:#f3f4f6; font-family: sans-serif; padding: 20px; text-align:center;">
            <h1 style="color:#f87171; font-size: 24px; margin-bottom: 10px;">Aplikasi Error</h1>
            <p style="max-width: 600px; line-height: 1.6;">Maaf, terjadi kesalahan saat memuat aplikasi. Ini mungkin karena konfigurasi Firebase belum diisi.</p>
            <pre style="background:#1f2937; padding:15px; border-radius:8px; margin-top:20px; text-align:left; overflow:auto; max-width:100%; border: 1px solid #374151;">${error.toString()}</pre>
        </div>
    `;
};

try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
} catch (e) {
    console.error("Fatal render error:", e);
    renderError(e);
}

// Tangkap error unhandled promise/runtime yang mungkin terjadi sebelum React mount
window.addEventListener('error', (event) => {
    console.error("Global error:", event.error);
    // Opsional: renderError(event.error); 
});
