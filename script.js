const img = document.getElementById('follow-img');
const draggableObject = document.getElementById('draggable-object');
let lastX = window.innerWidth / 2;
let lastY = window.innerHeight / 2;
let lastTime = Date.now();
let lastDirection = null;
let lookObjectMode = false;
let imgSize = 54;
const minSize = 20;
const maxSize = 200;
const zoomFactor = 10;
let draggableObjectRect;

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
    const x = 2 + xOffset;
    const y = 2 + yOffset;
    const clampedX = Math.min(Math.max(x, 0), 4);
    const clampedY = Math.min(Math.max(y, 0), 4);
    return `img/${images[clampedY][clampedX]}.jpeg`;
}

document.addEventListener('mousemove', (event) => {
    handleCursorMove(event.clientX, event.clientY, lookObjectMode);
});

draggableObject.addEventListener('mousedown', (event) => {
    event.preventDefault();
    const offsetX = event.clientX - draggableObject.getBoundingClientRect().left;
    const offsetY = event.clientY - draggableObject.getBoundingClientRect().top;
    const onMouseMove = (event) => {
        draggableObject.style.left = `${event.clientX - offsetX}px`;
        draggableObject.style.top = `${event.clientY - offsetY}px`;
        if (lookObjectMode) {
            draggableObjectRect = draggableObject.getBoundingClientRect();
            handleCursorMove(draggableObjectRect.left + draggableObjectRect.width / 2, draggableObjectRect.top + draggableObjectRect.height / 2, true);
        }
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', () => {
        draggableObjectRect = draggableObject.getBoundingClientRect();
        document.removeEventListener('mousemove', onMouseMove);
    }, { once: true });
});

function handleCursorMove(x, y, isObjectMode) {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTime;

    let deltaX, deltaY;
    if (isObjectMode) {
        // in Object Mode
        deltaX = draggableObjectRect.x + 27 - x;
        deltaY = draggableObjectRect.y + 27 - y;
    } else {
        deltaX = x - lastX;
        deltaY = y - lastY;
    }

    if (deltaTime === 0) return;

    const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / deltaTime;
    const direction = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

    const directionThreshold = 20;  //If this is set to 10, direction changes less than 10 degrees will not trigger a change in the image's position or source.

    if (lastDirection !== null) {
        const directionChange = Math.abs(direction - lastDirection);
        if (directionChange < directionThreshold) {
            img.style.transform = `translate(${x - 27}px, ${y - 27}px)`;

            lastX = x;
            lastY = y;
            lastTime = currentTime;
            return;
        }
    }

    img.style.transform = `translate(${x - 27}px, ${y - 27}px)`;
    img.src = getImageBasedOnSpeedAndDirection(speed, direction);

    lastX = x;
    lastY = y;
    lastTime = currentTime;
    lastDirection = direction;
}

// toggle fullscreen
document.getElementById('fullscreen-btn').addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
});

// switch to Object mode:
document.getElementById('look-object-btn').addEventListener('click', () => {
    lookObjectMode = true;
    document.getElementById('look-object-btn').style.display = 'none';
    document.getElementById('look-cursor-btn').style.display = 'block';
    draggableObject.style.display = 'block';
    draggableObject.style.left = 'calc(50% - 27px)';
    draggableObject.style.top = 'calc(50% - 27px)';
    draggableObjectRect = draggableObject.getBoundingClientRect();
});

// switch to Cursor mode:
document.getElementById('look-cursor-btn').addEventListener('click', () => {
    lookObjectMode = false;
    document.getElementById('look-object-btn').style.display = 'block';
    document.getElementById('look-cursor-btn').style.display = 'none';
    draggableObject.style.display = 'none';
});

function zoomImage(event) {
    event.preventDefault();
    if (event.deltaY < 0) {
        imgSize = Math.min(maxSize, imgSize + zoomFactor);
    } else {
        imgSize = Math.max(minSize, imgSize - zoomFactor);
    }
    img.style.width = `${imgSize}px`;
    img.style.height = `${imgSize}px`;
}

document.addEventListener('wheel', (event) => {
    if (event.target.id === 'follow-img') {
        zoomImage(event);
    } else {
        // prevent zooming entire page
        event.preventDefault();
    }
}, { passive: false });