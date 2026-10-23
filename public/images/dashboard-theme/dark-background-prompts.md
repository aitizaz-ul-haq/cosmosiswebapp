# Dark background generation

Mode: built-in `image_gen.imagegen`, editing existing raster backgrounds. Both outputs are
opaque. The existing light PNGs are edit targets; the supplied dark dashboard screenshot is
a palette and lighting reference, with no UI elements copied into the assets.

## Sidebar prompt

Use case: style-transfer. Asset type: existing website sidebar background recolored for dark mode. Input image 1 is the EDIT TARGET: a clean 337 by 813 portrait sidebar background. Input image 2 is a STYLE REFERENCE ONLY, a screenshot of the desired dark UI; never copy its UI, text, icons, logo, or borders. Recolor image 1 into a polished dark counterpart while preserving its exact wave composition, direction, placements, fine curved line detail, and portrait aspect ratio. Change only color and lighting of the background artwork. Upper roughly 52 percent remains a calm, very dark navy #101d30 field so existing sidebar text can overlay it. The existing flowing wave occupies the lower portion at exactly its current position and shape, now rendered with luminous teal/cyan #00d3b4 threads, deep teal shadows, and restrained violet accents #8046ff, matching the glowing fine-line waves in the reference. Keep most of the image navy and low contrast enough for white sidebar labels. Rich crisp fine strands rather than large flat polygon shapes; a gentle controlled glow in the lower wave. Opaque image, clean full bleed background only. Absolutely no text, no logo, no UI, no icons, no extra objects, no watermark. Preserve original crop, aspect, geometry and blank areas.

Inputs: `sidebar.png` and `../dark mode designs/ChatGPT Image Oct 23, 2026, 04_10_25 PM.png`.

Final project asset: [sidebar-dark.webp](sidebar-dark.webp).

## Title prompt

Use case: style-transfer. Asset type: existing website title/header banner background recolored for dark mode. Input image 1 is the EDIT TARGET: a clean extremely wide 1376 by 130 horizontal banner background with existing fine-line teal waves. Input image 2 is a STYLE REFERENCE ONLY showing desired dark UI colors; never copy any UI, words, icons or logo. Produce the dark-mode counterpart of image 1, preserving its exact very wide 1376:130 aspect ratio, existing crossing wave composition, shapes, positions, crop and detailed curved strands. Change only color and lighting. Replace the pale canvas with very dark navy #08121f. Leave the left 42 percent mostly quiet dark navy where the current white heading and pale subtitle overlay; existing fine-line wave on the center and right should now glow in luminous teal/cyan #00d3b4 with restrained vivid violet #8046ff threads and dark teal shadows, as seen in the reference's header wave. Crisp thin flowing strands, modest elegant glow, no large flat pale filled ribbons. Right portion has the clearest teal/violet wave while left stays subdued and legible. Opaque full bleed background artwork only. Absolutely NO text, no UI, no borders, no logo, no icon, no watermark, no extra object. Preserve the original extreme landscape crop and layout of the artwork.

Inputs: `title.png` and `../dark mode designs/ChatGPT Image Oct 23, 2026, 04_10_25 PM.png`.

Final project asset: [title-dark.webp](title-dark.webp). The generated padded canvas was cropped
for the web export; see the README for crop and encoding settings.
