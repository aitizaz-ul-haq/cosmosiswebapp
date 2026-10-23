# Dashboard background assets

These backgrounds were extracted from the supplied `../support_image_instructions.png`, without the instruction labels. The four role reference images remain in `public/images`.

- `sidebar.png`: full sidebar background; CSS scales and positions its wave to follow the references.
- `header.png`: subtle navigation bar background.
- `title.png`: page title and subtitle background, with a light overlay for text readability.
- `card-accent.png`: optional section/card background, retained for future use.
- `decorative-wave.png`: optional large empty/auth state background, retained for future use.
- [sidebar-dark.webp](sidebar-dark.webp): dark-only sidebar artwork, 674×1626 (128,672 bytes).
- [title-dark.webp](title-dark.webp): dark-only page-title artwork, 1376×130 (36,956 bytes).

The shell styles live in `dashboardshell/styles/dashboardshell.css`; the dashboard layouts and title styles live in `pages/dashboard/dashboard-ui.css`.

Dark variants are selected only by `dashboard-dark.css` and `dashboard-dark-cards.css`.
They use navy backgrounds and luminous teal/violet strands from the supplied dark-mode
references. Normal blending and a transparent first title-gradient layer expose the artwork
while retaining the existing background sizes, positions and repeat settings. Light mode
continues to use the original PNGs.

The artwork was edited with the built-in imagegen tool, then exported to WebP through browser
canvas. The sidebar uses its full generated image at twice the original logical resolution.
The title export removes generated empty padding (source crop x=0, y=216, width=2171,
height=205), returning to the original 1376×130 ratio. WebP qualities are 0.92 and 0.94,
respectively. The combined runtime asset size is 165,628 bytes.

The final prompt set and input roles are recorded in [dark-background-prompts.md](dark-background-prompts.md).
