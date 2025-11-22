document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，开始初始化...');
    // ==================== 功能模块初始化 ====================
    initBackgroundMusic(); // 初始化背景音乐
    initCarousel();        // 初始化轮播图
    initGridGame();        // 初始化九宫格游戏
    initImageCells();      // 初始化6格图片交互 (你的核心问题)
    initMessageBoard();    // 初始化留言板
});


// ==================== 1. 背景音乐模块 ====================
function initBackgroundMusic() {
    document.addEventListener('click', function() {
        const audio = document.getElementById('bgmusic');
        if (audio) {
            audio.muted = false;
            audio.play();
        }
    }, { once: true });
}


// ==================== 2. 轮播图模块 ====================
function initCarousel() {
    const carouselImages = document.querySelectorAll(".carousel-item");
    if (carouselImages.length === 0) {
        console.log('未找到轮播图元素，跳过初始化。');
        return;
    }

    const imageCount = carouselImages.length;
    let currentIndex = 0;
    let timerId;

    // 设置初始样式
    carouselImages.forEach(img => {
        img.style.transition = 'transform 0.5s ease-in-out';
    });

    function setupView() {
        const halfLength = Math.floor(imageCount / 2);
        carouselImages.forEach((img, index) => {
            img.style.transform = '';
            img.style.boxShadow = '';
        });
        for (let i = 0; i < halfLength; i++) {
            let leftIndex = (currentIndex - i - 1 + imageCount) % imageCount;
            let rightIndex = (currentIndex + i + 1) % imageCount;

            carouselImages[leftIndex].style.transform = `translateX(${-150 * (i + 1)}px) translateZ(${200 - i * 100}px) rotateY(30deg)`;
            carouselImages[rightIndex].style.transform = `translateX(${150 * (i + 1)}px) translateZ(${200 - i * 100}px) rotateY(-30deg)`;
            carouselImages[leftIndex].style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
            carouselImages[rightIndex].style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
        }
        carouselImages[currentIndex].style.transform = `translateZ(300px) scale(1)`;
        carouselImages[currentIndex].style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    }

    function bindEvents() {
        for (let i = 0; i < imageCount; i++) {
            (function (index) {
                carouselImages[index].addEventListener('click', function () {
                    currentIndex = index;
                    setupView();
                });
                carouselImages[index].addEventListener('mouseenter', function () {
                    if (index === currentIndex) {
                        carouselImages[index].style.transform = `translateZ(300px) scale(1.1)`;
                    }
                    clearInterval(timerId);
                });
                carouselImages[index].addEventListener('mouseout', function () {
                    if (index === currentIndex) {
                        carouselImages[index].style.transform = `translateZ(300px) scale(1)`;
                    }
                    startAutoPlay();
                });
            })(i);
        }
    }

    function startAutoPlay() {
        timerId = setInterval(function () {
            currentIndex = (currentIndex + 1) % imageCount;
            setupView();
        }, 2000);
    }

    // 启动轮播图
    setupView();
    bindEvents();
    startAutoPlay();
}


// ==================== 3. 九宫格游戏模块 ====================
function initGridGame() {
    const gridContainer = document.getElementById('grid-container');
    if (!gridContainer) {
        console.log('未找到九宫格容器，跳过初始化。');
        return;
    }

    let clickCount = 1;
    const gridItems = [];
    for (let i = 0; i < 9; i++) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        gridItem.textContent = i + 1;
        gridContainer.appendChild(gridItem);
        gridItems.push(gridItem);
    }

    const messages = ['顺遂无虞', '满载而归', '皆得所愿', '红袖添香', '春和景明', '平安喜乐', '万事胜意', '拨雪寻春'];
    const emojis = ['🎁', '💝', '🌟', '🎈', '🎉', '🌈', '⭐', '🎊'];
    const prizeIndex = Math.floor(Math.random() * 9);
    const hasClicked = Array(9).fill(false);
    let isPrizeClicked = false;
    let remainingMessages = [...messages];

    function checkPrize(index) {
        if (hasClicked[index] || isPrizeClicked) return;
        hasClicked[index] = true;
        const clickedItem = gridItems[index];
        clickedItem.classList.add('revealed')
        if (index === prizeIndex) {
            clickedItem.textContent = '好运++';
            clickedItem.classList.add('prize');
            alert('寻觅' + clickCount + '次获得幸运女神的青睐！');
            isPrizeClicked = true;
            gridItems.forEach((item, i) => {
                if (!hasClicked[i] && remainingMessages.length > 0) {
                    item.textContent = remainingMessages.pop();
                }
            });
            createFloatingEmojis();
            disableAllGrids();
            showAllMessages();
        } else {
            if (remainingMessages.length > 0) {
                const randomIndex = Math.floor(Math.random() * remainingMessages.length);
                const randomMessage = remainingMessages[randomIndex];
                clickedItem.textContent = randomMessage;
                remainingMessages.splice(randomIndex, 1);
                clickedItem.classList.add('disabled');
            } else {
                clickedItem.textContent = '无文案';
                clickedItem.classList.add('disabled');
            }
        }
        clickCount++;
    }

    function disableAllGrids() {
        gridItems.forEach(item => {
            item.classList.add('disabled');
            item.removeEventListener('click', checkPrize);
        });
    }

    function showAllMessages() {
        const finalMessages = [
            '再过上一段时间，就是烟花🎇、爆竹🧨；飘雪❄还有新年🆕',
            '世间美好如约而至，他们翘首以盼的，是那个满载而归的你！📷',
            '是Π的无穷，是无穷级数发散，是高山流水，是无可替代！',
            '许愿有烟火年年，馈余以温柔的冬'
        ];
        finalMessages.forEach(message => alert(message));
    }

    // 绑定点击事件
    gridItems.forEach((item, index) => {
        item.addEventListener('click', () => checkPrize(index));
    });
    function createFloatingEmojis() {
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const emoji = document.createElement('div');
                emoji.className = 'floating-emoji';
                emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                emoji.style.left = Math.random() * window.innerWidth + 'px';
                emoji.style.top = window.innerHeight + 'px';
                emoji.style.animationDelay = Math.random() * 2 + 's';
                document.body.appendChild(emoji);

                // 向上飘动
                let position = window.innerHeight;
                const floatInterval = setInterval(() => {
                    position -= 2;
                    emoji.style.top = position + 'px';
                    emoji.style.transform = `translateX(${Math.sin(position / 50) * 30}px)`;

                    if (position < -100) {
                        clearInterval(floatInterval);
                        emoji.remove();
                    }
                }, 20);
            }, i * 240);
        }
    }

}


// ==================== 4. 6格图片交互模块 (你的核心问题) ====================
function initImageCells() {
    const cells = document.querySelectorAll('.image-cell');
    if (cells.length === 0) {
        console.log('未找到6格图片元素，跳过初始化。');
        return;
    }

    console.log(`找到 ${cells.length} 个图片格子，开始初始化...`);

    cells.forEach((cell, index) => {
        // 从 data 属性中获取图片路径
        const defaultBg = cell.dataset.defaultBg;
        const leaveBg = cell.dataset.leaveBg;

        // 检查 data 属性是否存在
        if (!defaultBg || !leaveBg) {
            console.error(`Cell ${index} 缺少 data-default-bg 或 data-leave-bg 属性，跳过初始化。`);
            return;
        }

        // 1. 页面加载时，设置初始背景图
        cell.style.backgroundImage = `url('${defaultBg}')`;
        console.log(`Cell ${index} 初始背景设置为: ${defaultBg}`);

        // 2. 鼠标进入事件 (悬停时显示单张图片，由CSS控制，这里无需操作)
        cell.addEventListener('mouseenter', function() {
            // 可以在这里添加其他悬停效果
        });

        // 3. 鼠标离开事件 (切换到第二张长图)
        cell.addEventListener('mouseleave', function() {
            console.log(`Cell ${index} 鼠标离开，切换背景为: ${leaveBg}`);
            cell.style.backgroundImage = `url('${leaveBg}')`;
        });

        // 4. 点击事件
        cell.addEventListener('click', function() {
            console.log(`点击了第 ${index + 1} 个图片`);
        });
    });
}


// ==================== 5. 留言板模块 ====================
// 全局变量，用于存储留言数据
let messages = [];

// 页面加载时初始化留言板
function initMessageBoard() {
    // 1. 复刻：从 localStorage 加载已保存的留言
    const savedMessages = localStorage.getItem('messages');
    if (savedMessages) {
        try {
            // 我们现在存储的是JSON数组，所以需要解析
            messages = JSON.parse(savedMessages);
        } catch (e) {
            // 如果解析失败（比如旧版本数据），则清空
            messages = [];
        }
    }
    // 渲染已加载的留言
    renderMessages();
}

// 2. 复刻：确认名字并启用留言功能（带个性化欢迎语）
window.confirmAndEnableMessage = function() {
    const nameInput = document.getElementById('name');
    const messageTextarea = document.getElementById('message');
    const addMessageBtn = document.getElementById('addMessageBtn');

    const nameValue = nameInput.value.trim();

    if (nameValue) {
        // 复刻：原有的温馨欢迎语
        alert(`好久不见 ${nameValue}👋，听说听1000遍反方向的钟可以回到从前，我们在这里寄存下我们现在的快乐，下次不开心的时候就在这里收获愉悦啦！`);

        // 启用留言框和按钮
        messageTextarea.disabled = false;
        addMessageBtn.disabled = false;
        messageTextarea.focus(); // 自动聚焦到留言框
    } else {
        // 复刻：原有的提示语
        alert('所有美好都值得期待');

        // 确保按钮是禁用状态
        addMessageBtn.disabled = true;
    }
};

// 3. 复刻：添加留言功能
window.addMessage = function() {
    const nameInput = document.getElementById('name');
    const messageTextarea = document.getElementById('message');
    const addButton = document.getElementById('addMessageBtn');

    const newName = nameInput.value.trim();
    const newMessage = messageTextarea.value.trim();

    if (newName && newMessage) {
        // 创建新的留言对象
        const message = {
            id: Date.now(), // 使用时间戳作为唯一ID
            name: newName,
            content: newMessage,
            timestamp: new Date().toLocaleString()
        };

        // 将新留言添加到数组开头（新留言在顶部）
        messages.unshift(message);

        // 重新渲染留言列表
        renderMessages();

        // 复刻：保存到 localStorage
        updateLocalStorage();

        // 复刻：清空输入框并禁用按钮
        messageTextarea.value = '';
        addButton.disabled = true;
        // 注意：这里不清空名字，方便用户连续留言
        createEasterEggButton();

    } else {
        // 复刻：原有的提示语
        alert('输入留言内容开始留下回忆吧！');
    }
};
function createEasterEggButton() {
    // 检查是否已存在彩蛋按钮，避免重复创建
    if (document.getElementById('easterEggBtn')) {
        return;
    }

    // 创建悬浮球按钮
    const easterEggBtn = document.createElement('div');
    easterEggBtn.id = 'easterEggBtn';
    easterEggBtn.innerHTML = '🎁';
    easterEggBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        z-index: 1000;
        animation: bounce 2s infinite;
    `;

    // 添加悬停效果
    easterEggBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
    });

    easterEggBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    });

    // 点击事件
    easterEggBtn.addEventListener('click', function() {
        // 显示弹窗
        alert('那天拿快递，枝头看到白色的花\n室友捡了一个放在我头上，说这样很好看');
        alert('我就戴着走了一段路\n\n:你为什么不摘下来???\n:很久没看到这个花了，怀念一下\n:你们高中有吗，这种兰花\n:有的兄弟有的，而且我清楚记得，夏夜会在晚自习看到\n:你是下课了下去走看到的吗');
        alert('没有这些很漂亮的兰花会定时出现在我课桌上\n他们好奇，问为什么嘞，是窗外掉的吗？\n我摇头——');
        alert('不是不是，是我有一个很温柔的同桌，他每次回来都会给我带~~')
        // 跳转到新页面（请替换为你的目标页面）
        setTimeout(() => {
            window.location.href = './yuxuanji.html';
        }, 1000);
    });

    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            60% {
                transform: translateY(-5px);
            }
        }
    `;
    document.head.appendChild(style);

    // 将按钮添加到页面
    document.body.appendChild(easterEggBtn);
}

// 渲染所有留言到页面上
function renderMessages() {
    const messagesContainer = document.getElementById('messages');
    messagesContainer.innerHTML = ''; // 清空现有列表

    if (messages.length === 0) {
        messagesContainer.innerHTML = '<p style="text-align: center; color: #aaa;">还没有留言，来做第一个留言的人吧！</p>';
        return;
    }

    // 遍历 messages 数组，为每条留言创建DOM元素
    messages.forEach(msg => {
        const messageEl = document.createElement('div');
        messageEl.className = 'message-item';
        messageEl.innerHTML = `
            <div class="message-header">
                <span class="author">${msg.name}</span>
                <span class="timestamp">${msg.timestamp}</span>
            </div>
            <div class="content">${msg.content}</div>
            <button class="delete-btn" onclick="deleteMessage(${msg.id})">×</button>
        `;
        messagesContainer.appendChild(messageEl);
    });
}

// 4. 复刻：删除留言功能
function deleteMessage(id) {
    // 从数组中移除对应ID的留言
    messages = messages.filter(msg => msg.id !== id);

    // 重新渲染列表
    renderMessages();

    // 更新本地存储
    updateLocalStorage();
}

// 复刻：更新 localStorage 的函数
function updateLocalStorage() {
    // 我们现在存储的是整个JSON数组，而不是HTML字符串
    localStorage.setItem('messages', JSON.stringify(messages));
}

// 当页面加载完成后，初始化留言板
document.addEventListener('DOMContentLoaded', initMessageBoard);
