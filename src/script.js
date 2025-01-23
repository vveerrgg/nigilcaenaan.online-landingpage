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

// Nostr and Lightning information
const nostrPubkey = '12xyl6w6aacmqa3gmmzwrr9m3u0ldx3dwqhczuascswvew9am9q4sfg99cx';
const nostrNpub = nip19.npubEncode(nostrPubkey);
const lightningAddress = 'nigilcaenaan@getalby.com';

// Profile picture from Nostr
async function setProfilePicture() {
    const profileImage = document.getElementById('profile-image');
    const npub = profileImage.getAttribute('data-npub');
    
    try {
        // Convert npub to hex
        const { data: pubkey } = nip19.decode(npub);
        
        // Use Primal API to get profile picture
        const response = await fetch(`https://api.primal.net/v1/profile/${pubkey}`);
        const data = await response.json();
        
        if (data.content?.picture) {
            profileImage.src = `https://primal.b-cdn.net/media-cache?s=m&a=1&u=${encodeURIComponent(data.content.picture)}`;
        }
    } catch (error) {
        console.error('Error fetching profile picture:', error);
    }
}

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
    const qr = qrcode(0, 'M');
    qr.addData(`https://njump.me/${nostrNpub}`);
    qr.make();
    document.getElementById('nostr-qrcode').innerHTML = qr.createImgTag(5);
}

function generateLightningQR() {
    const qr = qrcode(0, 'M');
    qr.addData(`lightning:${lightningAddress}`);
    qr.make();
    document.getElementById('lightning-qrcode').innerHTML = qr.createImgTag(5);
}

// Display information
document.getElementById('nostrNpub').textContent = nostrNpub;
document.getElementById('nostrPubkey').textContent = nostrPubkey;
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
setProfilePicture();
generateNostrQR();
generateLightningQR();
