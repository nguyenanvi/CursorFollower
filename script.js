const img = document.getElementById('follow-img');
let lastX = window.innerWidth / 2;
let lastY = window.innerHeight / 2;
let lastTime = Date.now();
let lastDirection = null;

const images = [
    ["11", "12", "13", "14", "15"],
    ["21", "22", "23", "24", "25"],
    ["31", "32", "33", "34", "35"],
    ["41", "42", "43", "44", "45"],
    ["51", "52", "53", "54", "55"]
];

function getImageBasedOnSpeedAndDirection(speed, direction) {
    const speedFactor = Math.min(Math.floor(speed / 0.1), 4);
    const xOffset = Math.round(Math.cos(direction * Math.PI / 180) * speedFactor);
    const yOffset = Math.round(Math.sin(direction * Math.PI / 180) * speedFactor);
    const x = 2 + xOffset; // Starting at center index 2 (for 33)
    const y = 2 + yOffset;
    const clampedX = Math.min(Math.max(x, 0), 4); // Clamping within grid boundaries
    const clampedY = Math.min(Math.max(y, 0), 4);
    return `img/${images[clampedY][clampedX]}.jpeg`;
}

document.addEventListener('mousemove', (event) => {
    const currentTime = Date.now();
    const deltaX = event.clientX - lastX;
    const deltaY = event.clientY - lastY;
    const deltaTime = currentTime - lastTime;

    if (deltaTime === 0) return;

    const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / deltaTime;
    const direction = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

    const directionThreshold = 10; // Adjust this value as needed

    if (lastDirection !== null) {
        const directionChange = Math.abs(direction - lastDirection);
        if (directionChange < directionThreshold) {
            img.style.transform = `translate(${event.clientX - 27}px, ${event.clientY - 27}px)`;

            lastX = event.clientX;
            lastY = event.clientY;
            lastTime = currentTime;
            return;
        }
    }

    img.style.transform = `translate(${event.clientX - 27}px, ${event.clientY - 27}px)`;
    img.src = getImageBasedOnSpeedAndDirection(speed, direction);

    lastX = event.clientX;
    lastY = event.clientY;
    lastTime = currentTime;
    lastDirection = direction;
});

document.getElementById('fullscreen-btn').addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
});

// Zooming functionality
let imgSize = 54;
const minSize = 20;
const maxSize = 200;
const zoomFactor = 10;

function zoomImage(event) {
    event.preventDefault();
    if (event.deltaY < 0) {
        // Zoom in
        imgSize = Math.min(maxSize, imgSize + zoomFactor);
    } else {
        // Zoom out
        imgSize = Math.max(minSize, imgSize - zoomFactor);
    }
    img.style.width = `${imgSize}px`;
    img.style.height = `${imgSize}px`;
}

document.addEventListener('wheel', zoomImage);
