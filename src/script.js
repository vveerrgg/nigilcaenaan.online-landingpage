import { SimplePool, nip19 } from 'nostr-tools';

// Theme toggle functionality
const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Nostr functionality
const npub = 'npub12xyl6w6aacmqa3gmmzwrr9m3u0ldx3dwqhczuascswvew9am9q4sfg99cx'; // Replace with your npub
const relays = [
    'wss://relay.damus.io',
    'wss://relay.nostr.band',
    'wss://nos.lol',
    'wss://relay.MaiQR.app'
];

async function initNostr() {
    try {
        const { type, data: pubkey } = nip19.decode(npub);
        
        const pool = new SimplePool();
        
        // Fetch user metadata
        const events = await pool.list(relays, [{
            kinds: [0],
            authors: [pubkey]
        }]);
        
        if (events.length > 0) {
            const metadata = JSON.parse(events[0].content);
            if (metadata.lud16) { // Lightning address
                document.getElementById('lightningAddress').textContent = metadata.lud16;
                generateLightningQR(metadata.lud16);
            }
        }
        
        // Update Nostr information
        document.getElementById('nostrNpub').textContent = npub;
        document.getElementById('nostrPubkey').textContent = pubkey;
        
        // Generate Nostr QR code
        generateNostrQR(pubkey);
        
    } catch (error) {
        console.error('Error initializing Nostr:', error);
    }
}

// Initialize QR codes
function generateNostrQR(pubkey) {
    const qr = qrcode(0, 'M');
    qr.addData(`nostr:${pubkey}`);
    qr.make();
    document.getElementById('nostr-qrcode').innerHTML = qr.createImgTag(5);
}

function generateLightningQR(address) {
    if (!address) return;
    const qr = qrcode(0, 'M');
    qr.addData(`lightning:${address}`);
    qr.make();
    document.getElementById('lightning-qrcode').innerHTML = qr.createImgTag(5);
}

// Tab functionality
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        button.classList.add('active');
        const tabId = `${button.dataset.tab}-tab`;
        document.getElementById(tabId).classList.add('active');
    });
});

// QR Code functionality
const qrButton = document.querySelector('.qr-button');
const overlay = document.getElementById('qrOverlay');
const closeOverlay = document.querySelector('.close-overlay');
const copyButtons = document.querySelectorAll('.copy-button');

// Show/hide overlay
qrButton.addEventListener('click', () => {
    overlay.classList.add('active');
});

closeOverlay.addEventListener('click', () => {
    overlay.classList.remove('active');
});

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
        overlay.classList.remove('active');
    }
});

// Copy button functionality
copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const type = button.dataset.copy;
        const text = document.getElementById(type === 'lightning' ? 'lightningAddress' : 
                                          type === 'npub' ? 'nostrNpub' : 'nostrPubkey').textContent;
        
        try {
            await navigator.clipboard.writeText(text);
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    });
});

// Initialize Nostr functionality
initNostr();
