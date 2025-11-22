// --- 卡片数据生成和显示逻辑 ---

console.log("card.js 文件已加载");

// 1. 数据定义
const blessings = [
    {
        title: "最美的不是下雨天，是曾与你躲过雨的屋檐",
        image: "img+audio/下雨天.jpg",
        content: "那天晚上我问你物理题要怎么写，你摇头，原来不是不肯教我，而是——",
        from: "不能说的秘密"
    },
    {
        title: "潺潺流水穿过了群山一座座",
        image: "img+audio/桥.jpg",
        content: "王菲说平凡最浪漫，于是我开始读懂细水潺潺的温柔",
        from: "珠江新城"
    },
    {
        title: "昆明的春+你喜欢的花",
        image: "img+audio/云南4.jpg",
        content: "至若春和景明，失约的花定会再见",
        from: "来自云南朋友的祝福"
    },
    {
        title:"凤起楼的木棉花",
        image:"img+audio/木棉花.jpg",
        content:"于是我开始回忆，自此代码里多了细腻和温情",
        from:"沈从文"
    },
    {
        title:"七里香",
        image:"img+audio/poem.jpg",
        content:"其实我很好奇，秋刀鱼到底是什么滋味",
        from:"鱼玄机"
    },
    {
        title:"夜空霓虹",
        image:"img+audio/夜空霓虹1.jpg",
        content:"这是不是你那个时候跟我说的夜空霓虹",
        from:"广州塔"
    },
    {
        title:"落日熔金 浮光掠影",
        image:"img+audio/海.jpg",
        content:"所以，海的那边是什么？",
        from:"炸酱面"
    },
    {
        title:"轮渡",
        image:"img+audio/船.jpg",
        content:"记忆的小帆船，能否渡到天空的彼岸",
        from:"炸酱面"
    },
    {
        title:"海天一色",
        image:"img+audio/海(2).jpg",
        content:"不要你离开，距离隔不开，思念变成海",
        from:"花海"
    },
    {
        title:"我在等一个悠闲的午后",
        image:"img+audio/鸭.jpg",
        content:"要天天快乐鸭！",
        from:"炸酱面"
    }
    // ... 在这里补充更多带文字的祝福卡片，确保 title 和 content 都有内容
];

const imageOnlyBlessings = [
    "img+audio/向日葵.jpg",
    "img+audio/夜花.jpg",
    "img+audio/晚霞2.jpg",
    "img+audio/夜空霓虹3.jpg",
    "img+audio/晴天.jpg",
    "img+audio/文创1.jpg",
    "img+audio/云南3.jpg",
    "img+audio/云南1.jpg",
    "img+audio/云南5.jpg",
    "img+audio/云南3.jpg",
    "img+audio/云南.jpg",
    "img+audio/晴天(2).jpg",
    "img+audio/山.jpg",
    "img+audio/鸟.jpg",
    "img+audio/桥(2).jpg"
];

const floatingTexts = [
    "🌸 宫商广寒鸦一身飒飒无暇",
    "✨ 总是思绪翩翩相见却无言",
    "💖 我傻傻等待，傻傻等春暖花开",
    "🎈 夜空霓虹都是我不要的繁荣",
    "🌟 当流光遇流萤染了白月牙",
    "🎆 将相思寄明月，期盼你能察觉",
    "🍃 不太习惯没了你的小宇宙",
    "💫 古道遥遥牡丹亭外花",
];

// 2. 全局变量
let popupCount = 0;
let activePopups = [];
let pendingPopups = [];

// 3. 核心功能函数
function generateRandomPopupData() {
    const songDuration = 40;
    const popupData = [];
    const baseCardCount = 15;
    const burstPoint = 0.6;
    const earlyPhaseRatio = 0.4;
    const earlyPhaseCardCount = Math.floor(baseCardCount * earlyPhaseRatio);
    const latePhaseCardCount = baseCardCount - earlyPhaseCardCount;

    for (let i = 0; i < earlyPhaseCardCount; i++) {
        const blessing = blessings[i % blessings.length];
        const image = imageOnlyBlessings[i % imageOnlyBlessings.length];
        const maxTime = songDuration * burstPoint;
        const randomTime = Math.random() * (maxTime - 5) + 5;
        const isTextCard = Math.random() > 0.5;
        popupData.push({
            time: Math.floor(randomTime),
            type: isTextCard ? 'text' : 'image',
            data: isTextCard ? blessing : image
        });
    }

    for (let i = 0; i < latePhaseCardCount; i++) {
        const blessing = blessings[i % blessings.length];
        const image = imageOnlyBlessings[i % imageOnlyBlessings.length];
        const minTime = songDuration * burstPoint;
        const maxTime = songDuration - 2;
        const randomTime = Math.random() * (maxTime - minTime) + minTime;
        const isTextCard = Math.random() > 0.5;
        popupData.push({
            time: Math.floor(randomTime),
            type: isTextCard ? 'text' : 'image',
            data: isTextCard ? blessing : image
        });
    }

    popupData.sort((a, b) => a.time - b.time);
    console.log('🎊 带节奏的祝福卡片时间轴:', popupData);
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
    // 修复：如果 title 或 content 为空，使用默认值
    const title = blessing.title || "一份祝福";
    const content = blessing.content || "祝你天天开心！";

    const popup = document.createElement('div');
    popup.className = 'blessing-popup';
    popup.id = `popup-${popupCount++}`;
    const x = Math.random() * (window.innerWidth - 350);
    const y = Math.random() * (window.innerHeight - 300) + 100;
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
    popup.style.animation = 'bambooShoot 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
    popup.innerHTML = `
        <div class="blessing-header">
            <span class="blessing-title">${title}</span>
            <button class="close-btn" onclick="closePopup('${popup.id}')">×</button>
        </div>
        <img src="${blessing.image}" alt="祝福图片" class="blessing-image">
        <div class="blessing-content">${content}</div>
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
    popup.style.animation = 'bambooShoot 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
    popup.innerHTML = `
        <button class="close-btn" onclick="closePopup('${popup.id}')">×</button>
        <img src="${imageUrl}" alt="祝福图片">
    `;
    document.body.appendChild(popup);
    activePopups.push(popup.id);
    makeDraggable(popup);
}

function makeDraggable(element) { /* ... 拖动函数保持不变 ... */
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

function createFloatingText(text) {
    const textElement = document.createElement('div');
    textElement.className = 'floating-text';
    textElement.textContent = text;
    const startSide = Math.random() > 0.5 ? 'left' : 'right';
    const startX = startSide === 'left' ? -50 : window.innerWidth + 50;
    const startY = window.innerHeight - Math.random() * 200;
    const endX = Math.random() * window.innerWidth;
    const endY = -100;
    const fontSize = Math.random() * 0.8 + 1.2;
    const duration = Math.random() * 5 + 8;
    textElement.style.left = `${startX}px`;
    textElement.style.top = `${startY}px`;
    textElement.style.fontSize = `${fontSize}rem`;
    textElement.style.setProperty('--end-x', `${endX - startX}px`);
    textElement.style.setProperty('--end-y', `${endY - startY}px`);
    textElement.style.animationDuration = `${duration}s`;
    document.body.appendChild(textElement);
    textElement.addEventListener('animationend', () => {
        textElement.remove();
    });
}

function createWaveOfFloatingTexts(count, delay) {
    setTimeout(() => {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const randomText = floatingTexts[Math.floor(Math.random() * floatingTexts.length)];
                createFloatingText(randomText);
            }, i * 300);
        }
    }, delay);
}


// 4. 初始化和事件监听 (核心修改部分)
document.addEventListener('DOMContentLoaded', function() {
    const audioPlayer = document.getElementById('audio-player');
    if (!audioPlayer) {
        console.error('祝福卡片系统：找不到播放器元素！');
        return;
    }

    // 状态标记变量移到这里，确保每次重置都能访问到
    let hasTriggeredTextWave1 = false;
    let hasTriggeredTextWave2 = false;
    let hasTriggeredTextWave3 = false;

    // 初始化数据
    pendingPopups = generateRandomPopupData();

    // --- 合并后的 timeupdate 监听器 ---
    audioPlayer.addEventListener('timeupdate', () => {
        const currentTime = audioPlayer.currentTime;

        // 1. 处理卡片弹出
        for (let i = pendingPopups.length - 1; i >= 0; i--) {
            const popup = pendingPopups[i];
            if (currentTime >= popup.time) {
                console.log(`🎉 祝福卡片已触发 (时间: ${popup.time}s)`);
                showPopup(popup);
                pendingPopups.splice(i, 1);
            }
        }

        // 2. 处理飘动文字
        if (currentTime >= 10 && !hasTriggeredTextWave1) {
            hasTriggeredTextWave1 = true;
            console.log('✨ 第一波祝福语已触发！');
            createWaveOfFloatingTexts(3, 0);
        }
        if (currentTime >= 25 && !hasTriggeredTextWave2) {
            hasTriggeredTextWave2 = true;
            console.log('✨ 第二波祝福语已触发！');
            createWaveOfFloatingTexts(5, 0);
        }
        if (currentTime >= 40 && !hasTriggeredTextWave3) {
            hasTriggeredTextWave3 = true;
            console.log('✨ 第三波祝福语已触发！');
            createWaveOfFloatingTexts(8, 0);
        }
    });

    // 歌曲结束时重置所有状态
    audioPlayer.addEventListener('ended', function() {
        console.log('歌曲结束，重置所有状态...');
        pendingPopups = generateRandomPopupData();
        hasTriggeredTextWave1 = false;
        hasTriggeredTextWave2 = false;
        hasTriggeredTextWave3 = false;
    });
});
