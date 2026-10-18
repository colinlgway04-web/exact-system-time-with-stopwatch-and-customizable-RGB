(function() {
    'use strict';

    const clockContainer = document.createElement('div');
    clockContainer.id = 'geo-time-window';
    
    const settingsContainer = document.createElement('div');
    settingsContainer.id = 'geo-settings-window';
    settingsContainer.style.display = 'none';

    // Inject Google Font for Retro Arcade style
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.textContent = `
        #geo-time-window, #geo-settings-window {
            position: fixed;
            background: rgba(30, 30, 35, 0.85);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            color: #00ff66;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
            z-index: 999999;
            user-select: none;
            box-sizing: border-box;
            transition: border-color 0.2s ease;
        }
        #geo-time-window:hover, #geo-settings-window:hover {
            border-color: rgba(255, 255, 255, 0.2);
        }

        #geo-time-window {
            top: 20px;
            right: 20px;
            width: auto;
            min-width: 240px;
            display: inline-block;
        }

        #geo-settings-window {
            top: 120px;
            right: 20px;
            width: 280px;
            padding-bottom: 12px;
        }

        .geo-win-header {
            padding: 10px 14px;
            background: rgba(255, 255, 255, 0.03);
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            font-size: 13px;
            font-weight: 600;
            color: #ffffff;
            border-radius: 12px 12px 0 0;
        }
        .geo-tabs {
            display: flex;
            gap: 12px;
        }
        .geo-tab {
            cursor: pointer;
            color: #8e8e93;
            transition: color 0.15s ease;
        }
        .geo-tab.active {
            color: #ffffff;
            border-bottom: 2px solid #00ff66;
            padding-bottom: 2px;
        }
        .geo-header-actions {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .geo-btn {
            cursor: pointer;
            transition: color 0.15s ease, transform 0.15s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .geo-btn:hover {
            transform: scale(1.1);
        }
        .geo-close-btn {
            color: #ff5f56;
        }
        .geo-close-btn:hover {
            color: #ff3b30;
        }
        .geo-gear-btn {
            color: #a3a3a3;
        }
        .geo-gear-btn:hover {
            color: #ffffff;
        }

        .geo-view {
            padding: 16px 20px;
            text-align: center;
        }
        #time-display, #stopwatch-display {
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 0.5px;
            white-space: nowrap;
        }
        #date-display {
            font-size: 11px;
            color: #a3a3a3;
            margin-top: 4px;
            margin-bottom: 2px;
        }
        #time-sync-status {
            font-size: 10px;
            color: #8e8e93;
            text-align: center;
            padding-bottom: 8px;
            font-weight: 500;
        }

        .geo-sw-controls {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 12px;
        }
        .geo-sw-btn {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #fff;
            padding: 6px 14px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            transition: background 0.2s;
        }
        .geo-sw-btn:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .geo-settings-body {
            padding: 14px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            color: #f5f5f7;
            font-size: 13px;
            max-height: 400px;
            overflow-y: auto;
        }
        .geo-setting-row {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        .geo-setting-row label {
            font-weight: 500;
            color: #aeaea3;
        }
        .geo-setting-inline {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
        }
        .geo-input {
            background: rgba(255, 255, 255, 0.07);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            color: #fff;
            padding: 6px 10px;
            font-size: 13px;
            outline: none;
            transition: background 0.2s;
        }
        .geo-input:focus {
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(255, 255, 255, 0.25);
        }
        
        .geo-input option {
            background-color: #1e1e23;
            color: #ffffff;
        }
        
        .geo-color-picker-container {
            display: flex;
            gap: 12px;
            align-items: center;
            margin-top: 4px;
        }
        .geo-color-wheel {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            cursor: pointer;
            border: 1px solid rgba(255, 255, 255, 0.15);
            padding: 0;
            background: none;
            flex-shrink: 0;
        }
        .geo-color-wheel::-webkit-color-swatch-wrapper {
            padding: 0;
        }
        .geo-color-wheel::-webkit-color-swatch {
            border: none;
            border-radius: 50%;
        }
        .geo-rgb-inputs {
            display: flex;
            gap: 6px;
            flex-grow: 1;
        }
        .geo-rgb-field {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
            font-size: 11px;
            color: #8e8e93;
        }
        .geo-rgb-field input {
            width: 100%;
            text-align: center;
            padding: 4px 0;
            font-size: 12px;
        }
    `;
    document.head.appendChild(style);

    clockContainer.innerHTML = `
        <div class="geo-win-header" id="geo-clock-header">
            <div class="geo-tabs">
                <span class="geo-tab active" id="geo-tab-clock">Clock</span>
                <span class="geo-tab" id="geo-tab-stopwatch">Stopwatch</span>
            </div>
            <div class="geo-header-actions">
                <span class="geo-btn geo-gear-btn" id="geo-clock-settings-toggle" title="Settings">⚙️</span>
                <span class="geo-btn geo-close-btn" id="time-close" title="Close">✕</span>
            </div>
        </div>
        <div id="geo-view-clock" class="geo-view">
            <div id="time-display">--:--:--</div>
            <div id="date-display">---, --- --, ----</div>
            <div id="time-sync-status">Syncing...</div>
        </div>
        <div id="geo-view-stopwatch" class="geo-view" style="display: none;">
            <div id="stopwatch-display">00:00:00</div>
            <div class="geo-sw-controls">
                <button id="sw-start-btn" class="geo-sw-btn">Start</button>
                <button id="sw-reset-btn" class="geo-sw-btn">Reset</button>
            </div>
        </div>
    `;
    document.body.appendChild(clockContainer);

    settingsContainer.innerHTML = `
        <div class="geo-win-header" id="geo-settings-header">
            <span>Clock Settings</span>
            <span class="geo-btn geo-close-btn" id="geo-settings-close">✕</span>
        </div>
        <div class="geo-settings-body">
            <div class="geo-setting-row">
                <label>Font Style</label>
                <select id="geo-set-font" class="geo-input">
                    <option value="system-ui">Modern Sans</option>
                    <option value="'Courier New', Courier, monospace" selected>Classic Retro Code</option>
                    <option value="'Georgia', serif">Elegant Serif</option>
                    <option value="'Impact', sans-serif">Bold Impact</option>
                    <option value="'Trebuchet MS', sans-serif">Clean Trebuchet</option>
                    <option value="'Lucida Console', Monaco, monospace">Terminal Monospace</option>
                    <option value="'Brush Script MT', cursive">Script Cursive</option>
                    <option value="'Comic Sans MS', cursive, sans-serif">Playful Comic</option>
                    <option value="'Times New Roman', Times, serif">Classic Times</option>
                    <option value="'Copperplate', fantasy">Futuristic Techno</option>
                    <option value="'Palatino Linotype', 'Book Antiqua', Palatino, serif">Gothic Serif</option>
                    <option value="'Arial Narrow', sans-serif">Compact Condensed</option>
                    <option value="'Press Start 2P', monospace">Retro Arcade</option>
                    <option value="'Papyrus', fantasy">Decorative Display</option>
                    <option value="'Consolas', 'Liberation Mono', monospace">Modern Monospace</option>
                </select>
            </div>
            <div class="geo-setting-row">
                <label>Text Size (<span id="geo-size-val">25</span>px)</label>
                <input type="range" id="geo-set-size" min="5" max="100" value="25" step="1" style="accent-color: #00ff66;">
            </div>
            <div class="geo-setting-row geo-setting-inline">
                <label>24-Hour Time Format</label>
                <input type="checkbox" id="geo-24h-toggle">
            </div>
            <div class="geo-setting-row geo-setting-inline">
                <label>Neon Glow Effect</label>
                <input type="checkbox" id="geo-glow-toggle">
            </div>
            <div class="geo-setting-row">
                <label>Glow Intensity (<span id="geo-glow-val">50</span>%)</label>
                <input type="range" id="geo-set-glow-intensity" min="1" max="100" value="50" step="1" style="accent-color: #00ff66;">
            </div>
            <div class="geo-setting-row">
                <label>Background Opacity (<span id="geo-opacity-val">85</span>%)</label>
                <input type="range" id="geo-set-opacity" min="10" max="100" value="85" step="1" style="accent-color: #00ff66;">
            </div>
            <div class="geo-setting-row">
                <label>RGB Color Picker (Text)</label>
                <div class="geo-color-picker-container">
                    <input type="color" id="geo-color-wheel" class="geo-color-wheel" value="#00ff66">
                    <div class="geo-rgb-inputs">
                        <div class="geo-rgb-field"><input type="number" id="geo-rgb-r" min="0" max="255" class="geo-input">R</div>
                        <div class="geo-rgb-field"><input type="number" id="geo-rgb-g" min="0" max="255" class="geo-input">G</div>
                        <div class="geo-rgb-field"><input type="number" id="geo-rgb-b" min="0" max="255" class="geo-input">B</div>
                    </div>
                </div>
            </div>
            <div class="geo-setting-row">
                <label>RGB Color Picker (Background)</label>
                <div class="geo-color-picker-container">
                    <input type="color" id="geo-bg-color-wheel" class="geo-color-wheel" value="#1e1e23">
                    <div class="geo-rgb-inputs">
                        <div class="geo-rgb-field"><input type="number" id="geo-bg-r" min="0" max="255" class="geo-input">R</div>
                        <div class="geo-rgb-field"><input type="number" id="geo-bg-g" min="0" max="255" class="geo-input">G</div>
                        <div class="geo-rgb-field"><input type="number" id="geo-bg-b" min="0" max="255" class="geo-input">B</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(settingsContainer);

    let timeOffset = 0;
    async function syncTime() {
        try {
            const statusEl = document.getElementById('time-sync-status');
            const startTime = performance.now();
            const response = await fetch('');
            const data = await response.json();
            const endTime = performance.now();
            const latency = (endTime - startTime) / 2;
            const serverUtcTime = new Date(data.utc_datetime).getTime() + latency;
            const localTime = Date.now();
            timeOffset = serverUtcTime - localTime;
            if (statusEl) statusEl.textContent = 'Synced with Atomic Time';
        } catch (error) {
            const statusEl = document.getElementById('time-sync-status');
            if (statusEl) statusEl.textContent = 'Offline (System Time)';
        }
    }

    let is24Hour = false;
    function updateClock() {
        const accurateNow = new Date(Date.now() + timeOffset);
        const timeString = accurateNow.toLocaleTimeString('en-US', { 
            timeZone: 'America/New_York', 
            hour12: !is24Hour, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        const dateString = accurateNow.toLocaleDateString('en-US', {
            timeZone: 'America/New_York',
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        const displayEl = document.getElementById('time-display');
        const dateEl = document.getElementById('date-display');
        if (displayEl) displayEl.textContent = timeString;
        if (dateEl) dateEl.textContent = dateString;
    }

    syncTime();
    setInterval(syncTime, 600000);
    setInterval(updateClock, 100);

    // Stopwatch Logic
    let swStartTime = 0;
    let swElapsedTime = 0;
    let swInterval = null;
    let swRunning = false;

    const swDisplay = document.getElementById('stopwatch-display');
    const swStartBtn = document.getElementById('sw-start-btn');
    const swResetBtn = document.getElementById('sw-reset-btn');

    function formatStopwatch(ms) {
        let totalSecs = Math.floor(ms / 1000);
        let hrs = Math.floor(totalSecs / 3600);
        let mins = Math.floor((totalSecs % 3600) / 60);
        let secs = totalSecs % 60;
        let centisecs = Math.floor((ms % 1000) / 10);
        return (hrs > 0 ? String(hrs).padStart(2, '0') + ':' : '') +
               String(mins).padStart(2, '0') + ':' +
               String(secs).padStart(2, '0') + '.' +
               String(centisecs).padStart(2, '0');
    }

    swStartBtn.addEventListener('click', () => {
        if (!swRunning) {
            swRunning = true;
            swStartBtn.textContent = 'Pause';
            swStartTime = Date.now() - swElapsedTime;
            swInterval = setInterval(() => {
                swElapsedTime = Date.now() - swStartTime;
                swDisplay.textContent = formatStopwatch(swElapsedTime);
            }, 30);
        } else {
            swRunning = false;
            swStartBtn.textContent = 'Start';
            clearInterval(swInterval);
        }
    });

    swResetBtn.addEventListener('click', () => {
        swRunning = false;
        clearInterval(swInterval);
        swStartBtn.textContent = 'Start';
        swElapsedTime = 0;
        swDisplay.textContent = '00:00:00';
    });

    // Tab Switching
    const tabClock = document.getElementById('geo-tab-clock');
    const tabStopwatch = document.getElementById('geo-tab-stopwatch');
    const viewClock = document.getElementById('geo-view-clock');
    const viewStopwatch = document.getElementById('geo-view-stopwatch');

    tabClock.addEventListener('click', () => {
        tabClock.classList.add('active');
        tabStopwatch.classList.remove('active');
        viewClock.style.display = 'block';
        viewStopwatch.style.display = 'none';
    });

    tabStopwatch.addEventListener('click', () => {
        tabStopwatch.classList.add('active');
        tabClock.classList.remove('active');
        viewStopwatch.style.display = 'block';
        viewClock.style.display = 'none';
    });

    function makeElementDraggable(targetEl, handleEl) {
        let isDragging = false;
        let offsetX, offsetY;

        handleEl.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('geo-btn') || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.classList.contains('geo-tab')) return;
            isDragging = true;
            offsetX = e.clientX - targetEl.getBoundingClientRect().left;
            offsetY = e.clientY - targetEl.getBoundingClientRect().top;
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        });
        function mouseMoveHandler(e) {
            if (!isDragging) return;
            targetEl.style.left = (e.clientX - offsetX) + 'px';
            targetEl.style.top = (e.clientY - offsetY) + 'px';
            targetEl.style.right = 'auto';
        }
        function mouseUpHandler() {
            isDragging = false;
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        }
    }
    makeElementDraggable(clockContainer, document.getElementById('geo-clock-header'));
    makeElementDraggable(settingsContainer, document.getElementById('geo-settings-header'));
    
    const toggleGear = document.getElementById('geo-clock-settings-toggle');
    const closeSettings = document.getElementById('geo-settings-close');
    const closeClock = document.getElementById('time-close');
    toggleGear.addEventListener('click', () => {
        if (settingsContainer.style.display === 'none') {
            const clockRect = clockContainer.getBoundingClientRect();
            settingsContainer.style.left = clockRect.left + 'px';
            settingsContainer.style.top = (clockRect.bottom + 10) + 'px';
            settingsContainer.style.display = 'block';
        } else {
            settingsContainer.style.display = 'none';
        }
    });
    closeSettings.addEventListener('click', () => { settingsContainer.style.display = 'none'; });
    closeClock.addEventListener('click', () => {
        clockContainer.remove();
        settingsContainer.remove();
    });

    const fontSelect = document.getElementById('geo-set-font');
    const sizeSlider = document.getElementById('geo-set-size');
    const sizeValueDisplay = document.getElementById('geo-size-val');
    const clockDisplay = document.getElementById('time-display');
    const stopwatchDisplay = document.getElementById('stopwatch-display');
    const toggle24h = document.getElementById('geo-24h-toggle');
    const toggleGlow = document.getElementById('geo-glow-toggle');
    const glowIntensitySlider = document.getElementById('geo-set-glow-intensity');
    const glowValueDisplay = document.getElementById('geo-glow-val');
    const opacitySlider = document.getElementById('geo-set-opacity');
    const opacityValueDisplay = document.getElementById('geo-opacity-val');

    fontSelect.addEventListener('change', (e) => {
        clockDisplay.style.fontFamily = e.target.value;
        stopwatchDisplay.style.fontFamily = e.target.value;
    });
    sizeSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        sizeValueDisplay.textContent = val;
        clockDisplay.style.fontSize = val + 'px';
        stopwatchDisplay.style.fontSize = val + 'px';
    });

    toggle24h.addEventListener('change', (e) => {
        is24Hour = e.target.checked;
        updateClock();
    });

    function updateGlowEffect() {
        glowValueDisplay.textContent = glowIntensitySlider.value;
        if (toggleGlow.checked) {
            let intensity = glowIntensitySlider.value;
            let blurRadius = (intensity / 100) * 20; // scales up to 20px blur
            let shadowStr = `0 0 ${blurRadius}px ${colorWheel.value}, 0 0 ${blurRadius * 2}px ${colorWheel.value}`;
            clockDisplay.style.textShadow = shadowStr;
            stopwatchDisplay.style.textShadow = shadowStr;
        } else {
            clockDisplay.style.textShadow = 'none';
            stopwatchDisplay.style.textShadow = 'none';
        }
    }

    toggleGlow.addEventListener('change', updateGlowEffect);
    glowIntensitySlider.addEventListener('input', updateGlowEffect);

    let currentBgHex = '#1e1e23';
    function applyOpacity() {
        let opacityVal = opacitySlider.value / 100;
        opacityValueDisplay.textContent = opacitySlider.value;
        let rgb = hexToRgb(currentBgHex);
        if (rgb) {
            let rgbaStr = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacityVal})`;
            clockContainer.style.backgroundColor = rgbaStr;
            settingsContainer.style.backgroundColor = rgbaStr;
        }
    }

    opacitySlider.addEventListener('input', applyOpacity);

    const colorWheel = document.getElementById('geo-color-wheel');
    const rgbR = document.getElementById('geo-rgb-r');
    const rgbG = document.getElementById('geo-rgb-g');
    const rgbB = document.getElementById('geo-rgb-b');

    const bgColorWheel = document.getElementById('geo-bg-color-wheel');
    const bgR = document.getElementById('geo-bg-r');
    const bgG = document.getElementById('geo-bg-g');
    const bgB = document.getElementById('geo-bg-b');

    function hexToRgb(hex) {
        let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    function componentToHex(c) {
        let hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    function updateTextColors(hexSource) {
        clockContainer.style.color = hexSource;
        sizeSlider.style.accentColor = hexSource;
        opacitySlider.style.accentColor = hexSource;
        glowIntensitySlider.style.accentColor = hexSource;
        updateGlowEffect();
        const rgb = hexToRgb(hexSource);
        if (rgb) {
            rgbR.value = rgb.r;
            rgbG.value = rgb.g;
            rgbB.value = rgb.b;
        }
    }

    function updateBgColors(hexSource) {
        currentBgHex = hexSource;
        applyOpacity();
        const rgb = hexToRgb(hexSource);
        if (rgb) {
            bgR.value = rgb.r;
            bgG.value = rgb.g;
            bgB.value = rgb.b;
        }
    }

    updateTextColors(colorWheel.value);
    updateBgColors(bgColorWheel.value);

    colorWheel.addEventListener('input', (e) => {
        updateTextColors(e.target.value);
    });

    [rgbR, rgbG, rgbB].forEach(input => {
        input.addEventListener('input', () => {
            let r = Math.min(255, Math.max(0, parseInt(rgbR.value) || 0));
            let g = Math.min(255, Math.max(0, parseInt(rgbG.value) || 0));
            let b = Math.min(255, Math.max(0, parseInt(rgbB.value) || 0));
            const hex = rgbToHex(r, g, b);
            colorWheel.value = hex;
            updateTextColors(hex);
        });
    });

    bgColorWheel.addEventListener('input', (e) => {
        updateBgColors(e.target.value);
    });

    [bgR, bgG, bgB].forEach(input => {
        input.addEventListener('input', () => {
            let r = Math.min(255, Math.max(0, parseInt(bgR.value) || 0));
            let g = Math.min(255, Math.max(0, parseInt(bgG.value) || 0));
            let b = Math.min(255, Math.max(0, parseInt(bgB.value) || 0));
            const hex = rgbToHex(r, g, b);
            bgColorWheel.value = hex;
            updateBgColors(hex);
        });
    });
})();


