let images = [];
let isDragging = false;
let dragIndex = -1;
let offsetX, offsetY;

document.getElementById('createCollageBtn').addEventListener('click', createCollage);
document.getElementById('downloadCollageBtn').addEventListener('click', downloadCollage);
document.getElementById('collageCanvas').addEventListener('mousedown', startDragging);
document.getElementById('collageCanvas').addEventListener('mousemove', dragImage);
document.getElementById('collageCanvas').addEventListener('mouseup', stopDragging);
document.getElementById('collageCanvas').addEventListener('mouseleave', stopDragging);

function createCollage() {
    const files = document.getElementById('fileInput').files;
    if (files.length === 0) {
        alert('Please select some images first.');
        return;
    }

    const canvas = document.getElementById('collageCanvas');
    const ctx = canvas.getContext('2d');

    const canvasWidth = 800;
    const canvasHeight = 600;
    const imgWidth = 200;
    const imgHeight = 150;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    let x = 0;
    let y = 0;
    images = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                images.push({ image: img, x: x, y: y, width: imgWidth, height: imgHeight });
                ctx.drawImage(img, x, y, imgWidth, imgHeight);
                x += imgWidth;
                if (x >= canvasWidth) {
                    x = 0;
                    y += imgHeight;
                }
            };
            img.src = event.target.result;
        };

        reader.readAsDataURL(file);
    }
}

function startDragging(e) {
    const canvas = document.getElementById('collageCanvas');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (x > img.x && x < img.x + img.width && y > img.y && y < img.y + img.height) {
            isDragging = true;
            dragIndex = i;
            offsetX = x - img.x;
            offsetY = y - img.y;
            break;
        }
    }
}

function dragImage(e) {
    if (!isDragging) return;

    const canvas = document.getElementById('collageCanvas');
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    images[dragIndex].x = x - offsetX;
    images[dragIndex].y = y - offsetY;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const img of images) {
        ctx.drawImage(img.image, img.x, img.y, img.width, img.height);
    }
}

function stopDragging() {
    isDragging = false;
    dragIndex = -1;
}

function downloadCollage() {
    const canvas = document.getElementById('collageCanvas');
    const link = document.createElement('a');
    link.download = 'collage.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

