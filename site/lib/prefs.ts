/* The reader's saved choices, applied before paint by an inline script in the root layout. Plain strings in a
   server-safe module: exported from a "use client" file they reach the server as client references, not text. */
export const themeScript = `try{if(localStorage.getItem("isoform-theme-v2")==="light")document.documentElement.dataset.theme="light"}catch(e){}`;
export const fxScript = `try{var f=localStorage.getItem("isoform-fx");if(f==="off"||f==="subtle")document.documentElement.dataset.fx=f}catch(e){}`;
