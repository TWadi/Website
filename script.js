// === ADVANCED INTERACTIVE EMBEDDED PORTFOLIO JS ===

document.addEventListener('DOMContentLoaded', function() {
    // --- LOADING SCREEN: Firmware Flashing ---
    if (!document.querySelector('.loading')) {
        const loading = document.createElement('div');
        loading.className = 'loading';
        loading.innerHTML = `
            <img src="Logo.svg" class="loading-logo" alt="Microchip Logo">
            <div class="loading-terminal">
                <span>Flashing firmware</span>
                <span class="loading-dots">...</span>
            </div>
            <div class="loading-progress-bar"><div class="loading-progress"></div></div>
            <pre class="loading-hex">0000: 7F 45 4C 46 02 01 01 00 00 00 00 00 00 00 00 00\n0010: 02 00 3E 00 01 00 00 00 78 56 34 12 00 00 00 00\n0020: 40 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00</pre>
        `;
        document.body.appendChild(loading);
        // Animate progress bar
        const progress = loading.querySelector('.loading-progress');
        let prog = 0;
        const progInt = setInterval(() => {
            prog += 2;
            progress.style.width = prog + '%';
            if (prog >= 100) clearInterval(progInt);
        }, 30);
        // Remove loading after 2.2s
        setTimeout(() => loading.remove(), 2200);
    }

    // --- OSCILLOSCOPE WAVE ANIMATION ---
    const osc = document.getElementById('oscilloscope');
    if (osc) {
        let t = 0;
        function drawOscilloscope() {
            let path = '';
            let color = `hsl(${(t*2)%360},100%,60%)`;
            for (let x = 0; x <= 600; x += 2) {
                let y = 40 + 24*Math.sin((x/60)+t) + 8*Math.sin((x/15)-t*1.5) + 4*Math.random();
                path += (x===0?'M':'L')+x+','+y+' ';
            }
            osc.innerHTML = `<path d="${path}" stroke="${color}" stroke-width="3" fill="none" filter="url(#glow)"/>
            <defs><filter id="glow"><feGaussianBlur stdDeviation="2.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
            t += 0.04;
            requestAnimationFrame(drawOscilloscope);
        }
        drawOscilloscope();
    }

    // --- LIVE TERMINAL WIDGET ---
    const terminal = document.getElementById('terminal-output');
    if (terminal) {
        const logs = [
            '[BOOT] MCU: STM32F407VG detected',
            '[INFO] Initializing peripherals...',
            '[OK] UART1 @ 115200 baud',
            '[OK] SPI1 @ 8MHz',
            '[OK] I2C1 @ 400kHz',
            '[INFO] RTOS: FreeRTOS v10.4.3',
            '[INFO] Task: SensorRead started',
            '[DATA] Temp: 23.4C  Hum: 41.2%',
            '[WARN] Battery low: 3.1V',
            '[INFO] MQTT: Connected',
            '[DATA] Sent packet: 0xA2 0xB3 0xC4',
            '[OK] All systems nominal',
            '[INFO] Entering low-power mode...'
        ];
        let i = 0, char = 0;
        function typeLog() {
            if (i < logs.length) {
                if (char < logs[i].length) {
                    terminal.innerHTML += logs[i][char] === '\n' ? '<br>' : logs[i][char];
                    char++;
                    setTimeout(typeLog, 18 + Math.random()*30);
                } else {
                    terminal.innerHTML += '<br>';
                    i++; char = 0;
                    setTimeout(typeLog, 350);
                }
            } else {
                setTimeout(() => { terminal.innerHTML = ''; i = 0; typeLog(); }, 2000);
            }
        }
        typeLog();
        // Blinking cursor
        const cursor = document.createElement('span');
        cursor.className = 'terminal-cursor';
        cursor.textContent = '_';
        terminal.parentNode.appendChild(cursor);
        setInterval(() => { cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0'; }, 500);
    }

    // --- STATUS LED ANIMATION ---
    document.querySelectorAll('.status-led').forEach(led => {
        if (led.classList.contains('led-green')) {
            led.animate([
                { boxShadow: '0 0 8px #00ff99, 0 0 2px #00ffc6' },
                { boxShadow: '0 0 24px #00ff99, 0 0 8px #00ffc6' },
                { boxShadow: '0 0 8px #00ff99, 0 0 2px #00ffc6' }
            ], { duration: 1800, iterations: Infinity });
        } else if (led.classList.contains('led-yellow')) {
            led.animate([
                { boxShadow: '0 0 8px #ffe066, 0 0 2px #fffbe6' },
                { boxShadow: '0 0 24px #ffe066, 0 0 8px #fffbe6' },
                { boxShadow: '0 0 8px #ffe066, 0 0 2px #fffbe6' }
            ], { duration: 1200, iterations: Infinity });
        }
    });

    // --- INTERACTIVE MCU SVG ---
    const mcuSVG = document.getElementById('mcu-svg');
    const mcuTooltip = document.getElementById('mcu-tooltip');
    if (mcuSVG && mcuTooltip) {
        mcuSVG.querySelectorAll('.mcu-pin').forEach(pin => {
            pin.addEventListener('mouseenter', e => {
                const tooltip = pin.getAttribute('data-tooltip');
                mcuTooltip.textContent = tooltip;
                mcuTooltip.style.display = 'block';
                mcuTooltip.style.left = (e.clientX - mcuSVG.getBoundingClientRect().left + 10) + 'px';
                mcuTooltip.style.top = (e.clientY - mcuSVG.getBoundingClientRect().top - 10) + 'px';
                pin.setAttribute('fill', '#7f5cff');
            });
            pin.addEventListener('mousemove', e => {
                mcuTooltip.style.left = (e.clientX - mcuSVG.getBoundingClientRect().left + 10) + 'px';
                mcuTooltip.style.top = (e.clientY - mcuSVG.getBoundingClientRect().top - 10) + 'px';
            });
            pin.addEventListener('mouseleave', () => {
                mcuTooltip.style.display = 'none';
                pin.setAttribute('fill', '#00ffc6');
            });
        });
    }

    // --- INTERACTIVE PROJECT CARDS ---
    document.querySelectorAll('.interactive-card').forEach(card => {
        card.addEventListener('mouseenter', () => card.classList.add('flipped'));
        card.addEventListener('mouseleave', () => card.classList.remove('flipped'));
        // Live code typing on flip
        const codeBlock = card.querySelector('.project-back code');
        if (codeBlock) {
            let code = codeBlock.textContent;
            codeBlock.textContent = '';
            card.addEventListener('mouseenter', () => {
                codeBlock.textContent = '';
                let i = 0;
                function typeCode() {
                    if (i < code.length) {
                        codeBlock.textContent += code[i];
                        i++;
                        setTimeout(typeCode, 10 + Math.random()*20);
                    }
                }
                typeCode();
            });
        }
    });

    // --- SECTION TRANSITIONS: Animated Signal ---
    // (Simple SVG signal between sections)
    document.querySelectorAll('section').forEach((section, idx, arr) => {
        if (idx < arr.length - 1) {
            const divider = document.createElement('div');
            divider.className = 'section-divider';
            divider.innerHTML = `<svg width="100%" height="32" viewBox="0 0 600 32"><polyline points="0,16 100,16 120,4 180,28 220,8 300,24 400,8 480,28 500,16 600,16" stroke="#00ffc6" stroke-width="3" fill="none" filter="url(#glow)"/></svg>`;
            section.after(divider);
        }
    });

    // --- KONAMI CODE EASTER EGG: Debug Overlay ---
    const konami = [38,38,40,40,37,39,37,39,66,65];
    let kidx = 0;
    window.addEventListener('keydown', e => {
        if (e.keyCode === konami[kidx]) {
            kidx++;
            if (kidx === konami.length) {
                showDebugOverlay();
                kidx = 0;
            }
        } else {
            kidx = 0;
        }
    });
    function showDebugOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'debug-overlay';
        overlay.innerHTML = `<div class="debug-box"><h2>Debug Mode Activated</h2><pre>// Embedded system status\nMCU: STM32F407VG\nHeap: 32KB free\nTasks: 5 running\nTemp: 24.1C\nVoltage: 3.3V\n</pre><button id="close-debug">Close</button></div>`;
        document.body.appendChild(overlay);
        document.getElementById('close-debug').onclick = () => overlay.remove();
    }

    // === WILD HERO SECTION UPGRADE ===
    // --- 3D PARALLAX ---
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    document.addEventListener('mousemove', e => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        parallaxLayers.forEach(layer => {
            const depth = parseFloat(layer.dataset.depth || 0.1);
            layer.style.transform = `translate3d(${x * depth * 40}px, ${y * depth * 40}px, 0) scale(1.02)`;
        });
        const chip = document.getElementById('hero-microchip');
        if (chip) chip.style.transform = `rotateY(${-x*12}deg) rotateX(${y*12}deg)`;
    });
    // Touch parallax
    document.addEventListener('touchmove', e => {
        if (e.touches.length) {
            const t = e.touches[0];
            const x = (t.clientX / window.innerWidth - 0.5) * 2;
            const y = (t.clientY / window.innerHeight - 0.5) * 2;
            parallaxLayers.forEach(layer => {
                const depth = parseFloat(layer.dataset.depth || 0.1);
                layer.style.transform = `translate3d(${x * depth * 40}px, ${y * depth * 40}px, 0) scale(1.02)`;
            });
            const chip = document.getElementById('hero-microchip');
            if (chip) chip.style.transform = `rotateY(${-x*12}deg) rotateX(${y*12}deg)`;
        }
    });

    // --- MICROCHIP HEARTBEAT & TRACES ---
    const chipHeart = document.querySelector('.chip-heartbeat');
    if (chipHeart) {
        setInterval(() => {
            chipHeart.classList.toggle('pulse');
        }, 600);
    }
    document.querySelectorAll('.chip-trace').forEach(trace => {
        trace.style.strokeDasharray = '60 20';
        trace.style.strokeDashoffset = '0';
        let offset = 0;
        setInterval(() => {
            offset = (offset + 2) % 80;
            trace.style.strokeDashoffset = offset;
        }, 40);
    });

    // --- MCU PIN INTERACTIVITY ---
    const heroChip = document.getElementById('hero-microchip');
    if (heroChip && mcuTooltip) {
        heroChip.querySelectorAll('.mcu-pin').forEach(pin => {
            pin.addEventListener('mouseenter', e => {
                const tooltip = pin.getAttribute('data-tooltip');
                mcuTooltip.textContent = tooltip;
                mcuTooltip.style.display = 'block';
                mcuTooltip.style.left = (e.clientX - heroChip.getBoundingClientRect().left + 10) + 'px';
                mcuTooltip.style.top = (e.clientY - heroChip.getBoundingClientRect().top - 10) + 'px';
                pin.classList.add('active');
                // Blink a random status LED
                const leds = heroChip.querySelectorAll('.status-led');
                if (leds.length) {
                    const led = leds[Math.floor(Math.random()*leds.length)];
                    led.classList.add('blink');
                    setTimeout(() => led.classList.remove('blink'), 700);
                }
            });
            pin.addEventListener('mousemove', e => {
                mcuTooltip.style.left = (e.clientX - heroChip.getBoundingClientRect().left + 10) + 'px';
                mcuTooltip.style.top = (e.clientY - heroChip.getBoundingClientRect().top - 10) + 'px';
            });
            pin.addEventListener('mouseleave', () => {
                mcuTooltip.style.display = 'none';
                pin.classList.remove('active');
            });
            pin.addEventListener('click', () => {
                // Simulate "signal" by blinking all LEDs
                heroChip.querySelectorAll('.status-led').forEach(led => {
                    led.classList.add('blink');
                    setTimeout(() => led.classList.remove('blink'), 700);
                });
            });
        });
    }

    // --- DATA PACKETS ANIMATION ---
    const circuit = document.getElementById('data-circuit');
    if (circuit) {
        let packets = [];
        for (let i = 0; i < 7; i++) {
            const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            c.setAttribute('class', 'data-packet');
            c.setAttribute('r', 10 + Math.random()*4);
            c.setAttribute('fill', '#00ffc6');
            c.setAttribute('opacity', 0.7);
            circuit.appendChild(c);
            packets.push({el: c, t: Math.random()});
        }
        function animatePackets() {
            packets.forEach((p, i) => {
                // Simulate packet loss/retransmit
                let t = (p.t += 0.004 + Math.random()*0.002);
                if (t > 1) {
                    if (Math.random() < 0.2) {
                        // Packet loss: fade out, then retransmit
                        p.el.setAttribute('opacity', 0.1);
                        setTimeout(() => { p.t = 0; p.el.setAttribute('opacity', 0.7); }, 400 + Math.random()*400);
                    } else {
                        p.t = 0;
                    }
                }
                // Move along the polyline path
                const x = 1200 * t;
                const y = 90 + 60*Math.sin(2*Math.PI*t + i);
                p.el.setAttribute('cx', x);
                p.el.setAttribute('cy', y);
            });
            requestAnimationFrame(animatePackets);
        }
        animatePackets();
    }

    // --- TYPEWRITER/BOOT-UP HERO TEXT ---
    function typewriterEffect(el, text, delay=40, cb) {
        el.textContent = '';
        let i = 0;
        function type() {
            if (i < text.length) {
                el.textContent += text[i];
                i++;
                setTimeout(type, delay + Math.random()*30);
            } else if (cb) {
                cb();
            }
        }
        type();
    }
    const heroTitle = document.getElementById('hero-title');
    const heroSub = document.getElementById('hero-sub');
    const cursor = document.querySelector('.typewriter-cursor');
    if (heroTitle && heroSub && cursor) {
        heroTitle.textContent = '';
        heroSub.textContent = '';
        cursor.style.display = 'inline';
        setTimeout(() => {
            typewriterEffect(heroTitle, 'Wadi Touil', 60, () => {
                setTimeout(() => {
                    typewriterEffect(heroSub, 'Embedded Systems & C++ Engineer', 30, () => {
                        cursor.style.display = 'none';
                        heroSub.insertAdjacentHTML('afterend', '<div class="bootup-ready">[ SYSTEM READY ]</div>');
                    });
                }, 400);
            });
        }, 600);
    }

    // --- OSCILLOSCOPE: COLOR CYCLING, MOUSE REACTIVITY ---
    let oscMouse = 0;
    if (osc) {
        osc.addEventListener('mousemove', e => {
            oscMouse = (e.offsetX / osc.clientWidth - 0.5) * 2;
        });
        let t = 0;
        function drawOscilloscope() {
            let path = '';
            let color = `hsl(${(t*60)%360},100%,60%)`;
            for (let x = 0; x <= 600; x += 2) {
                let y = 40 + 24*Math.sin((x/60)+t+oscMouse*2) + 8*Math.sin((x/15)-t*1.5) + 4*Math.random();
                path += (x===0?'M':'L')+x+','+y+' ';
            }
            osc.innerHTML = `<path d="${path}" stroke="${color}" stroke-width="3" fill="none" filter="url(#glow)"/>
            <defs><filter id="glow"><feGaussianBlur stdDeviation="2.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
            t += 0.04;
            requestAnimationFrame(drawOscilloscope);
        }
        drawOscilloscope();
    }

    // --- THEME POWER CYCLE (CRT FLICKER) ---
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.add('crt-flicker');
            setTimeout(() => {
                document.body.classList.remove('crt-flicker');
                // Toggle theme (dark/light/retro)
                if (!document.body.classList.contains('theme-light')) {
                    document.body.classList.add('theme-light');
                } else if (!document.body.classList.contains('theme-retro')) {
                    document.body.classList.remove('theme-light');
                    document.body.classList.add('theme-retro');
                } else {
                    document.body.classList.remove('theme-retro');
                }
            }, 700);
        });
    }

    // --- HEX DUMP/DISASSEMBLY EASTER EGG ---
    const hexEgg = document.getElementById('hex-easter-egg');
    if (hexEgg) {
        hexEgg.addEventListener('click', () => {
            if (document.querySelector('.hex-dump-overlay')) return;
            const overlay = document.createElement('div');
            overlay.className = 'hex-dump-overlay';
            overlay.innerHTML = `<div class="hex-dump-content"><pre id="hex-dump"></pre></div><button class="hex-dump-close">Close</button>`;
            document.body.appendChild(overlay);
            const hexDump = document.getElementById('hex-dump');
            let lines = [];
            for (let i = 0; i < 32; i++) {
                let addr = (i*16).toString(16).padStart(4,'0');
                let bytes = Array.from({length:16},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join(' ');
                let asm = ['MOV','LDR','STR','ADD','SUB','B','BL','CMP','BX','NOP'][Math.floor(Math.random()*10)];
                lines.push(`${addr}: ${bytes}   ; ${asm}`);
            }
            let idx = 0;
            function scrollDump() {
                if (idx < lines.length) {
                    hexDump.textContent += lines[idx] + '\n';
                    idx++;
                    setTimeout(scrollDump, 60 + Math.random()*40);
                }
            }
            scrollDump();
            overlay.querySelector('.hex-dump-close').onclick = () => overlay.remove();
        });
    }

    // --- KONAMI CODE: DEBUG OVERLAY ---
    function showDebugOverlay() {
        if (document.querySelector('.debug-overlay')) return;
        const overlay = document.createElement('div');
        overlay.className = 'debug-overlay';
        overlay.innerHTML = `<div class="debug-box"><h2>Debug Mode Activated</h2><pre id="debug-status">// Embedded system status\nMCU: STM32F407VG\nHeap: 32KB free\nTasks: 5 running\nTemp: 24.1C\nVoltage: 3.3V\n</pre><button id="close-debug">Close</button></div>`;
        document.body.appendChild(overlay);
        document.getElementById('close-debug').onclick = () => overlay.remove();
        // Glitch effect
        overlay.style.animation = 'crt-flicker 0.7s linear 1';
        // Live stats
        const status = document.getElementById('debug-status');
        let temp = 24.1, heap = 32, tasks = 5, v = 3.3;
        setInterval(() => {
            temp += (Math.random()-0.5)*0.2;
            heap -= Math.random()*0.01;
            v += (Math.random()-0.5)*0.01;
            status.textContent = `// Embedded system status\nMCU: STM32F407VG\nHeap: ${heap.toFixed(2)}KB free\nTasks: ${tasks} running\nTemp: ${temp.toFixed(1)}C\nVoltage: ${v.toFixed(2)}V\n`;
        }, 400);
    }
});

// Modern JavaScript for Carthavate Website
// (REMOVE EVERYTHING from here until the next unique section or end of file)
// ... existing code ... 