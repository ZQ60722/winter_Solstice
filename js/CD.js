// script.js
document.addEventListener('DOMContentLoaded', function() {
    // --- 获取播放器和歌词相关元素 ---
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const record = document.querySelector('.record');
    const lyricsContainer = document.querySelector('.lyrics-container');
    const progressBar = document.querySelector('.progress-bar');
    const currentTimeEl = document.querySelector('.current-time');
    const totalTimeEl = document.querySelector('.total-time');
    const volumeSlider = document.getElementById('volume-slider');
    const stage = document.getElementById('effects-stage');

    // --- 歌词数据 (时间戳和文本) ---
    const lyricsData = [
        { time: 0, text: "手写的从前 - 周杰伦" },
        { time: 1, text: "微风需要竹林 溪流需要蜻蜓" },
        { time: 3, text: "乡愁般的离开 需要片片浮萍" },
        { time: 5, text: "记得那年的雨季 回忆里特安静" },
        { time: 8, text: "哭过后的决定 是否还能进行" },
        { time: 11, text: "我傻傻等待 傻傻等春暖花开" },
        { time: 13, text: "等终等于等明等白 等待爱情归来" },
        { time: 15, text: "青春属于表白 阳光属于窗台" },
        { time: 18, text: "而我想我属于一个拥有你的未来" },
        { time: 21, text: "纸上的彩虹 用素描画的钟" },
        { time: 23, text: "我还在修改 回忆之中你的笑容" },
        { time: 26, text: "该怎么去形容 为思念酝酿的痛" },
        { time: 29, text: "夜空霓虹 都是我不要的繁荣" },
        { time: 32, text: "或许去趟沙滩 或许去看看夕阳" },
        { time: 34, text: "或许任何一个可以想心事的地方" },
        { time: 37, text: "情绪在咖啡馆 被调成一篇文章" },
        { time: 39, text: "彻底爱上你如诗般透明的泪光" },
    ];

    const waveEmojis = {
        wave1: ['🍃','🌸','💮','💐','🪷', '🦋','☁','🌤️'],
        wave2: ['🌸','🌈','🕙','✏', '💮', '🏵'],
        wave3: ['✨', '💫', '⭐','🌟','⭐'],
        wave4: ['☕','🏖','🌇','🌙','🎇','🌼','✉','💌'],
        wave5: ['💖', '💕', '💗', '🎈','🎀','🎉','🎁','🎊']
    };

    const EFFECT_TIMINGS = {
        bloomStart: 2, // 浮动表情开始时间
    };

    // --- 特效状态标记 ---
    let hasBloomed = false;

    // --- 1. 初始化：将歌词数据渲染到页面上 ---
    function renderLyrics() {
        lyricsData.forEach(line => {
            const p = document.createElement('p');
            p.classList.add('lyric-line');
            p.textContent = line.text;
            p.dataset.time = line.time;
            lyricsContainer.appendChild(p);
        });
    }
    renderLyrics();

    // --- 2. 播放器核心逻辑 ---
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function togglePlay() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playBtn.textContent = '⏸';
            record.classList.add('playing');
        } else {
            audioPlayer.pause();
            playBtn.textContent = '▶';
            record.classList.remove('playing');
        }
    }
    playBtn.addEventListener('click', togglePlay);

    // --- 3. 进度条更新 ---
    function updateProgress() {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = progress + '%';
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    }
    audioPlayer.addEventListener('timeupdate', updateProgress);

    // --- 4. 歌词同步与高亮逻辑 ---
    function updateLyrics() {
        const currentTime = audioPlayer.currentTime;
        const allLyricLines = lyricsContainer.querySelectorAll('.lyric-line');
        let activeIndex = -1;
        for (let i = 0; i < lyricsData.length; i++) {
            if (currentTime >= lyricsData[i].time) {
                activeIndex = i;
            } else {
                break;
            }
        }
        allLyricLines.forEach(line => line.classList.remove('active'));
        if (activeIndex !== -1) {
            const activeLine = allLyricLines[activeIndex];
            activeLine.classList.add('active');
            activeLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    audioPlayer.addEventListener('timeupdate', updateLyrics);

    // --- 5. 整合后的时间监听器，处理进度、歌词和浮动表情 ---
    audioPlayer.addEventListener('timeupdate', () => {
        const currentTime = audioPlayer.currentTime;

        // 触发波次花效果
        if (currentTime >= EFFECT_TIMINGS.bloomStart && !hasBloomed) {
            hasBloomed = true;
            console.log('🌸 波次花效果已触发！');
            startBlooming();
        }
    });

    // --- 6. 歌曲结束重置 ---
    audioPlayer.addEventListener('ended', function() {
        console.log('歌曲播放完毕');
        playBtn.textContent = '▶';
        record.classList.remove('playing');
        progressBar.style.width = '0%';
        currentTimeEl.textContent = '0:00';
        const allLyricLines = lyricsContainer.querySelectorAll('.lyric-line');
        allLyricLines.forEach(line => line.classList.remove('active'));
        if (allLyricLines.length > 0) {
            allLyricLines[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        hasBloomed = false; // 重置浮动表情状态
    });

    // --- 7. 音量控制 ---
    volumeSlider.addEventListener('input', function() {
        audioPlayer.volume = this.value / 100;
    });

    // --- 8. 音频加载完成后显示总时长 ---
    audioPlayer.addEventListener('loadedmetadata', function() {
        totalTimeEl.textContent = formatTime(audioPlayer.duration);
    });

    // --- 9. 进度条跳转 ---
    const progressContainer = document.querySelector('.progress-container');
    progressContainer.addEventListener('click', function(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        audioPlayer.currentTime = (clickX / width) * duration;
    });

    // --- 10. 浮动表情相关函数 ---
    function startBlooming() {
        createWaveOfFlowers(10, 0, waveEmojis.wave1);
        createWaveOfFlowers(16, 800, waveEmojis.wave2);
        createWaveOfFlowers(24, 1600, waveEmojis.wave3);
        createWaveOfFlowers(32, 2500, waveEmojis.wave4);
        createWaveOfFlowers(24, 3500, waveEmojis.wave5);
    }

    function createWaveOfFlowers(count, delay, emojiList) {
        setTimeout(() => {
            for (let i = 0; i < count; i++) {
                setTimeout(() => createFlower(emojiList), i * 150);
            }
        }, delay);
    }

    function createFlower(emojiList) {
        const flower = document.createElement('div');
        const flowerType = emojiList[Math.floor(Math.random() * emojiList.length)];
        flower.className = 'flower';
        flower.textContent = flowerType;

        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        const endX = startX + (Math.random() - 0.5) * 200;
        const endY = Math.random() * window.innerHeight * 0.5;
        const scale = Math.random() * 1.5 + 0.5;
        const duration = Math.random() * 3 + 4;

        flower.style.left = `${startX}px`;
        flower.style.top = `${startY}px`;
        flower.style.setProperty('--end-x', `${endX - startX}px`);
        flower.style.setProperty('--end-y', `${endY - startY}px`);
        flower.style.setProperty('--scale', scale);
        flower.style.fontSize = `${scale * 30}px`;
        flower.style.animationDuration = `${duration}s`;

        stage.appendChild(flower);

        flower.addEventListener('animationend', () => {
            flower.remove();
        });
    }
});
