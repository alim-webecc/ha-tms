// frontend-v0/.storybook/preview.ts
import type { Preview } from '@storybook/react';
import '../app/globals.css'; // <— Pfad ggf. anpassen, damit Tailwind/Theme greift

// Optional: wenn du next-themes verwendest, aktivieren (sonst die Decorators weglassen)
import { ThemeProvider } from 'next-themes';
import React from 'react';

export const decorators = [
  (Story) => (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background text-foreground p-8">
        <Story />
      </div>
    </ThemeProvider>
  ),
];

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { test: 'todo' }, // wie bei dir gewünscht
  },
};

export default preview;
