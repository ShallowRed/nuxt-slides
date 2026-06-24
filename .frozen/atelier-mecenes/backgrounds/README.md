# Background Images

This directory contains background images for presentations.

## Usage

Background images are automatically applied based on:
1. Theme configuration in `src/config/presentation.ts`
2. Custom backgrounds in presentation frontmatter
3. Heading level (H1, H2, H3)

## Organization

Organize by theme:
```
backgrounds/
├── dsfr/
│   ├── title.jpg       # H1 backgrounds
│   ├── section.jpg     # H2 backgrounds
│   └── vertical.jpg    # H3 backgrounds
├── minimal/
│   └── default.jpg
└── custom/
    └── my-image.jpg
```

## Image Recommendations

- **Format**: JPG (photos), PNG (graphics with transparency), WebP (modern browsers)
- **Size**: 1920x1080px (1080p) or 2560x1440px (1440p)
- **File size**: < 500KB (optimize with tools like ImageOptim, Squoosh)
- **Contrast**: Ensure text remains readable
- **Colors**: Match theme color scheme

## Optimization Tips

1. Use modern formats (WebP, AVIF) with fallbacks
2. Compress images before adding
3. Consider using gradients/overlays in CSS instead for simple backgrounds
4. Test on different screen sizes
