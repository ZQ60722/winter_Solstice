// --- 卡片数据生成和显示逻辑 ---

let popupCount = 0;
let activePopups = [];

function generateRandomPopupData() {
    const songDuration = 45; // !!重要：根据你的歌曲总时长调整这里（秒）
    const popupData = [];

    // 1. 处理带文字的祝福卡片，均匀分布在歌曲的前半部分
    blessings.forEach((blessing, index) => {
        const randomTime = Math.random() * (songDuration / 2 - 5) + 5;
        popupData.push({
            time: Math.floor(randomTime),
            type: 'text',
            data: blessing
        });
    });

    // 2. 处理纯图片卡片，均匀分布在歌曲的后半部分
    imageOnlyBlessings.forEach((image, index) => {
        const randomTime = Math.random() * (songDuration / 2) + (songDuration / 2);
        popupData.push({
            time: Math.floor(randomTime),
            type: 'image',
            data: image
        });
    });

    // 3. 按时间排序
    popupData.sort((a, b) => a.time - b.time);
    console.log('整合后的祝福卡片时间轴:', popupData);
    return popupData;
}

function showPopup(popupInfo) {
    if (popupInfo.type === 'text') {
        createTextBlessingPopup(popupInfo.data);
    } else if (popupInfo.type === 'image') {
        createImagePopup(popupInfo.data);
    }
}

function createTextBlessingPopup(blessing) {
    const popup = document.createElement('div');
    popup.className = 'blessing-popup';
    popup.id = `popup-${popupCount++}`;

    const x = Math.random() * (window.innerWidth - 350);
    const y = Math.random() * (window.innerHeight - 300) + 100;

    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
    popup.style.animation = 'bambooShoot 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'; // 加上这行


    popup.innerHTML = `
        <div class="blessing-header">
            <span class="blessing-title">${blessing.title}</span>
            <button class="close-btn" onclick="closePopup('${popup.id}')">×</button>
        </div>
        <img src="${blessing.image}" alt="祝福图片" class="blessing-image">
        <div class="blessing-content">${blessing.content}</div>
        <div class="blessing-footer">${blessing.from}</div>
    `;

    document.body.appendChild(popup);
    activePopups.push(popup.id);
    makeDraggable(popup);
}

function createImagePopup(imageUrl) {
    const popup = document.createElement('div');
    popup.className = 'image-popup';
    popup.id = `popup-${popupCount++}`;

    const x = Math.random() * (window.innerWidth - 220);
    const y = Math.random() * (window.innerHeight - 220) + 100;

    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
    popup.style.animation = 'bambooShoot 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'; // 加上这行


    popup.innerHTML = `
        <button class="close-btn" onclick="closePopup('${popup.id}')">×</button>
        <img src="${imageUrl}" alt="祝福图片">
    `;

    document.body.appendChild(popup);
    activePopups.push(popup.id);
    makeDraggable(popup);
}

function makeDraggable(element) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    element.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        if (e.target.classList.contains('close-btn')) return;
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === element || element.contains(e.target)) {
            isDragging = true;
            element.style.zIndex = 1002;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;
            element.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
        element.style.zIndex = element.className.includes('blessing-popup') ? 1000 : 999;
    }
}

function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.animation = 'bambooShoot 0.5s ease reverse';
        setTimeout(() => {
            popup.remove();
            activePopups = activePopups.filter(id => id !== popupId);
        }, 500);
    }
}

// --- 初始化和事件监听 ---

document.addEventListener('DOMContentLoaded', function() {
    const audioPlayer = document.getElementById('audio-player');

    if (!audioPlayer) {
        console.error('祝福卡片系统：找不到播放器元素！');
        return;
    }

    let pendingPopups = generateRandomPopupData(); // 使用新变量名

    audioPlayer.addEventListener('timeupdate', () => {
        const currentTime = audioPlayer.currentTime;

        // 从后往前遍历，这样可以在循环中安全地删除元素
        for (let i = pendingPopups.length - 1; i >= 0; i--) {
            const popup = pendingPopups[i];
            if (currentTime >= popup.time) {
                console.log(`🎉 祝福卡片已触发 (时间: ${popup.time}s)`);
                showPopup(popup);
                // 触发后从待处理数组中移除
                pendingPopups.splice(i, 1);
            }
        }
    });

    // 歌曲结束时重置
    audioPlayer.addEventListener('ended', function() {
        pendingPopups = generateRandomPopupData(); // 重新生成数据，实现重置
        console.log('祝福卡片系统已重置，下次播放可再次触发。');
    });
});
