# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is an array diagram (アレイ図) visualization tool for understanding multiplication structure. It helps teachers who would otherwise need to draw dots on paper to demonstrate multiplication concepts.

## Key Features
- **Array Visualization**: Interactive grid displaying multiplication structure as arrays
- **Answer Toggle**: Button to hide/show multiplication results, allowing students to predict or count
- **Sound Effects**: Simple button operation sounds (pi.mp3, pi2.mp3)

## Architecture

### Core Components
- **index.html**: Main application with semantic HTML5 structure, includes comprehensive SEO meta tags and Open Graph/Twitter Card support
- **script.js**: Vanilla JavaScript application with:
  - State management pattern using a single `state` object
  - Configuration object `CONFIG` for all app settings
  - Event-driven architecture with button controls for multiplication selection
  - Sound management with error handling
  - Grid animation system using CSS classes
- **styles.css**: CSS3 with animations, responsive grid layout, and custom properties for theming

### Key Implementation Details
- **Grid System**: 9x9 interactive grid with dynamic cell highlighting based on selected multiplication
- **Answer Toggle**: Button to show/hide multiplication results
- **Accessibility**: Full ARIA labels, semantic HTML, and keyboard support

## Development

### Running the Application
Simply open `index.html` in a web browser. No build process required.

### Testing
Test locally by opening the HTML file. Ensure sounds load correctly by checking browser console.

### Deployment
The app is deployed via GitHub Pages at https://jimitas.github.io/kuku-array/

### Git Workflow
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

## Important Notes
- The app uses Japanese text throughout (九九 = multiplication tables)
- Sound files must be in the `sounds/` directory
- No external dependencies - pure vanilla JavaScript
- Designed for educational use in Japanese elementary schools