// @ts-check
import { defineConfig } from 'astro/config';

// User/organization GitHub Pages site → served from the root.
// Deployment happens via GitHub Actions (see .github/workflows/deploy.yml).
export default defineConfig({
  site: 'https://vjroy.github.io',
});
