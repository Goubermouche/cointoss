const menu = document.getElementById('menu');
const menuItems = document.querySelectorAll('.menu-item');
const videoContainer = document.getElementById('videoContainer');
const video1 = document.getElementById('video1');
const video2 = document.getElementById('video2');

let selectedIndex = 0;
let state = 'menu';
let currentResult = null;
let activeVideo = video1;
let standbyVideo = video2;

const videos = {
    heads: 'heads.webm',
    tails: 'tails.webm',
    heads_out: 'heads_out.webm',
    tails_out: 'tails_out.webm'
};

Object.values(videos).forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'video';
    link.href = src;
    document.head.appendChild(link);
});

function playSelectSound() {
    const sound = new Audio('select.webm');
    sound.play().catch(err => console.log('Audio play failed:', err));
}

function playConfirmSound() {
    const sound = new Audio('confirm.webm');
    sound.play().catch(err => console.log('Audio play failed:', err));
}

function updateSelection() {
    menuItems.forEach((item, index) => {
        item.classList.toggle('selected', index === selectedIndex);
    });
}

function swapVideos() {
    const temp = activeVideo;
    activeVideo = standbyVideo;
    standbyVideo = temp;
    activeVideo.classList.remove('hidden-video');
    standbyVideo.classList.add('hidden-video');
}

function playVideo(src, onEnded) {
    activeVideo.src = src;
    activeVideo.onended = onEnded;
    activeVideo.play();
}

function showMenu() {
    menu.classList.remove('hidden');
    videoContainer.classList.remove('active');
    state = 'menu';
}

function hideMenu() {
    menu.classList.add('hidden');
}

function flipCoin() {
    state = 'flipping';
    playConfirmSound();
    hideMenu();
    setTimeout(() => {
        videoContainer.classList.add('active');
        currentResult = Math.random() < 0.5 ? 'heads' : 'tails';
        playVideo(videos[currentResult], () => {
            activeVideo.pause();
            state = 'result';
            standbyVideo.src = videos[currentResult + '_out'];
            standbyVideo.load();
        });
    }, 150);
}

function playOutro() {
    state = 'outro';
    swapVideos();
    activeVideo.onended = () => {
        showMenu();
    };
    activeVideo.play();
}

document.addEventListener('keydown', (e) => {
    if (state === 'menu') {
        let oldSelectedIndex = selectedIndex;
        if (e.key === 'ArrowUp') {
            selectedIndex = Math.max(selectedIndex - 1, 0);
            updateSelection();

            if (oldSelectedIndex !== selectedIndex) {
                playSelectSound();
            }
        }
        else if (e.key === 'ArrowDown') {
            selectedIndex = Math.min(selectedIndex + 1, 1);
            updateSelection();
            if (oldSelectedIndex !== selectedIndex) {
                playSelectSound();
            }
        }
        else if (e.key === 'Enter') {
            flipCoin();
        }
    }
    else if (state === 'result') {
        if (e.key === 'Enter') {
            playOutro();
        }
    }
});

document.addEventListener('click', () => {
    if (state === 'result') {
        playOutro();
    }
});