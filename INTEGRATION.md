# StickerVerse Sticker Editor

An interactive sticker editor that can be easily integrated into any HTML website.

## Features

- Upload and crop images
- Choose from different sticker shapes
- Select sticker materials
- Preview stickers before ordering
- Background removal tool
- Interactive image transformations

## Integration Guide

### Method 1: Script Tag (Recommended for most websites)

1. Include React and ReactDOM in your HTML:

```html
<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
```

1. Add a container for the editor:

```html
<div id="sticker-editor" style="height: 700px;"></div>
```

1. Include the sticker editor files:

```html
<link rel="stylesheet" href="path/to/dist/stickerverse_sticker_editor.css">
<script src="path/to/dist/sticker-editor.umd.js"></script>
```

1. Initialize the editor:

```html
<script>
  document.addEventListener('DOMContentLoaded', function() {
    if (window.StickerEditor) {
      window.StickerEditor.init('sticker-editor', {
        // Optional configuration options
      });
    }
  });
</script>
```

### Method 2: Auto-initialization

You can also auto-initialize the editor by adding data attributes to your script tag:

```html
<div id="sticker-container"></div>
<script 
  src="path/to/dist/sticker-editor.umd.js" 
  data-container="sticker-container"
  data-config='{"someOption": true}'
></script>
```

### Method 3: ES Modules (For modern build systems)

If you're using a build system like webpack, vite, etc.:

```javascript
import { initStickerEditor } from 'stickerverse-sticker-editor';
import 'stickerverse-sticker-editor/dist/stickerverse_sticker_editor.css';

// Initialize when your component mounts
initStickerEditor('sticker-editor-container', {
  // Optional configuration
});
```

## Configuration Options

The second parameter to `StickerEditor.init()` accepts a configuration object with the following options:

- More configuration options will be added in future releases

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Build from Source

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build
```

The build output will be in the `dist` directory.

## Example Integration

See `integration-example.html` for a complete example of how to integrate the sticker editor into a website.
