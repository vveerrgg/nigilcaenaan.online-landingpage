# nigilcaenaan.online Landing Page

A modern, responsive "link-in-bio" style landing page with integrated Nostr and Lightning Network support.

## Features

- 🎨 Clean, minimal design with dark mode support
- 📱 Fully responsive layout
- ⚡ Nostr integration with QR code support
- 💸 Lightning Network payment integration
- 🔄 Smooth animations and transitions
- 🔗 Social media and professional links
- 🎯 SEO optimized
- 🌐 Easy to customize

## Technologies

- HTML5 & CSS3
- Vanilla JavaScript
- Webpack for bundling
- Nostr Tools for Nostr integration
- QR Code Generator for scannable codes
- Font Awesome for icons

## Setup

1. Clone the repository:
```bash
git clone https://github.com/nigilcaenaan/nigilcaenaan.online-landingpage.git
cd nigilcaenaan.online-landingpage
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Serve the files using a local server:
```bash
# Using Python 3
python3 -m http.server 8000

# Or using Node.js
npx serve
```

5. Open your browser and visit `http://localhost:8000`

## Customization

### Basic Configuration

1. Edit `index.html` to update:
   - Meta tags and SEO information
   - Social media links
   - Profile information

2. Modify `styles.css` to change:
   - Color scheme
   - Layout
   - Animations
   - Responsive breakpoints

3. Update `src/script.js` to configure:
   - Nostr public key
   - Lightning address
   - QR code settings
   - Interactive features

### Nostr Integration

The site includes Nostr integration with:
- Profile QR code generation (using njump.me)
- Pubkey and npub display
- Relay connections for metadata
- Copy-to-clipboard functionality

### Lightning Network

Lightning Network support includes:
- Lightning address display
- QR code generation for payments
- Copy-to-clipboard functionality

## Development

```bash
# Watch for changes during development
npm run watch

# Build for production
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Author

[@nigilcaenaan](https://github.com/nigilcaenaan)

## Links

- GitHub: [nigilcaenaan](https://github.com/nigilcaenaan)
- Nostr: [nigilcaenaan](https://primal.net/nigilcaenaan)
- Website: [nigilcaenaan.online](https://nigilcaenaan.online)
- Articles: [HumanJava](https://www.humanjava.com/author/nigilcaenaan/)
