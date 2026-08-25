import React from 'react';
import ReactDOMServer from 'react-dom/server';

try {
  const App = (await import('./App.tsx')).default;
  const html = ReactDOMServer.renderToString(React.createElement(App));
  console.log('RENDER SUCCESS, HTML length:', html.length);
  console.log('Snippet:', html.substring(0, 300));
} catch (err) {
  console.error('RENDER ERROR CAUGHT:', err);
}
