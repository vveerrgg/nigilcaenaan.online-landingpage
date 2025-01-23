import qrcode from 'qrcode-generator';
import { Buffer } from 'buffer';
import { nip19 } from 'nostr-crypto-utils';
window.Buffer = Buffer;

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

// Profile information from Nostr
async function setProfileInfo() {
    const profileImage = document.getElementById('profile-image');
    const npub = profileImage.getAttribute('data-npub');
    
    try {
        // Convert npub to hex
        const { data: pubkey } = nip19.decode(npub);
        
        // Use Primal API to get profile info
        const response = await fetch(`https://api.primal.net/v1/profile/${pubkey}`);
        const data = await response.json();
        
        if (data.content) {
            // Set profile picture
            if (data.content.picture) {
                profileImage.src = `https://primal.b-cdn.net/media-cache?s=m&a=1&u=${encodeURIComponent(data.content.picture)}`;
            }

            // Set display name and username
            const displayName = data.content.display_name || data.content.name || 'Nigil Caenaan';
            const name = `${displayName} • @${data.content.name || 'Caenaan'}`;
            document.getElementById('profile-name').textContent = name;

            // Set bio
            const bio = data.content.about || 'Musician • Artist • Alias of @Vveerrgg';
            document.getElementById('profile-bio').textContent = bio;

            // Update meta tags
            const title = `${displayName} | ${bio}`;
            document.getElementById('meta-description').content = bio;
            document.getElementById('og-title').content = title;
            document.getElementById('og-description').content = bio;
            document.getElementById('twitter-title').content = title;
            document.getElementById('twitter-description').content = bio;

            // Update schema.org data
            const schemaScript = document.querySelector('script[type="application/ld+json"]');
            if (schemaScript) {
                const schemaData = JSON.parse(schemaScript.textContent);
                schemaData.name = displayName;
                schemaData.alternateName = `@${data.content.name || 'Caenaan'}`;
                schemaData.description = bio;
                schemaScript.textContent = JSON.stringify(schemaData, null, 4);
            }

            // Update Nostr info display
            document.getElementById('nostrNpub').textContent = npub;
            document.getElementById('nostrPubkey').textContent = pubkey;
        }
    } catch (error) {
        console.error('Error fetching profile info:', error);
    }
}

// Lightning information
const lightningAddress = 'nigilcaenaan@getalby.com';

// Tab functionality
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        const tabId = `${button.dataset.tab}-tab`;
        document.getElementById(tabId).classList.add('active');

        // Generate QR code for active tab
        if (button.dataset.tab === 'nostr') {
            generateNostrQR();
        } else {
            generateLightningQR();
        }
    });
});

// Initialize QR codes
function generateNostrQR() {
    const profileImage = document.getElementById('profile-image');
    const npub = profileImage.getAttribute('data-npub');
    const qr = qrcode(0, 'M');
    qr.addData(`https://njump.me/${npub}`);
    qr.make();
    document.getElementById('nostr-qrcode').innerHTML = qr.createImgTag(5);
}

function generateLightningQR() {
    const qr = qrcode(0, 'M');
    qr.addData(`lightning:${lightningAddress}`);
    qr.make();
    document.getElementById('lightning-qrcode').innerHTML = qr.createImgTag(5);
}

// Display lightning information
document.getElementById('lightningAddress').textContent = lightningAddress;

// Nostr QR Code functionality
const qrButton = document.querySelector('.qr-button');
const overlay = document.getElementById('qrOverlay');
const closeOverlay = document.querySelector('.close-overlay');
const copyButtons = document.querySelectorAll('.copy-button');

// Show overlay
qrButton.addEventListener('click', () => {
    overlay.classList.add('active');
    // Generate QR code for active tab
    const activeTab = document.querySelector('.tab-button.active').dataset.tab;
    if (activeTab === 'nostr') {
        generateNostrQR();
    } else {
        generateLightningQR();
    }
});

// Hide overlay
closeOverlay.addEventListener('click', () => {
    overlay.classList.remove('active');
});

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
        overlay.classList.remove('active');
    }
});

// Copy functionality
copyButtons.forEach(button => {
    button.addEventListener('click', () => {
        const textToCopy = button.previousElementSibling.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        });
    });
});

// Initialize
setProfileInfo();
generateNostrQR();
generateLightningQR();
