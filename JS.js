// Forest Timer JavaScript Implementation

// ====== Configuration and State ======
const AMBIENT_SOUNDS = [
    { id: 1, name: 'Forest Wind', url: 'sounds/wind.mp3', iconUrl: 'https://cdn.builder.io/api/v1/image/assets/TEMP/3ad994167512c55a089a3a9e2c51cb15ac8db64b' },
    { id: 2, name: 'Rain', url: 'sounds/rain.mp3', iconUrl: 'https://cdn.builder.io/api/v1/image/assets/TEMP/01c2a3c891632f26ccd70333101db7bc2e348a59' },
    { id: 3, name: 'River', url: 'sounds/river.mp3', iconUrl: 'https://cdn.builder.io/api/v1/image/assets/TEMP/53cf0d8770a413d16232f754322a8334db4526b4' },
    { id: 4, name: 'Birds', url: 'sounds/birds.mp3', iconUrl: 'https://cdn.builder.io/api/v1/image/assets/TEMP/2cf5073bccf570301f62e73841809116739b4022' },
    { id: 5, name: 'Cafe', url: 'sounds/cafe.mp3', iconUrl: 'https://cdn.builder.io/api/v1/image/assets/TEMP/0204812076c6da88b42b0b5bcdbc4b12c6e7749e' },
    { id: 6, name: 'Office', url: 'sounds/office.mp3', iconUrl: 'https://cdn.builder.io/api/v1/image/assets/TEMP/5c5389923c721a5232f55d9c0625097893511035' },
    { id: 7, name: 'White Noise', url: 'sounds/white-noise.mp3', iconUrl: 'https://cdn.builder.io/api/v1/image/assets/TEMP/44ad746ef36d644459c70b285bf65a18b22f6021' }
  ];
  
  const BACKGROUND_IMAGES = [
    { id: 1, url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9', alt: 'Forest 1' },
    { id: 2, url: 'https://images.unsplash.com/photo-1448375240586-882707db888b', alt: 'Forest 2' },
    { id: 3, url: 'https://images.unsplash.com/photo-1511497584788-876760111969', alt: 'Forest 3' },
    { id: 4, url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d', alt: 'Forest 4' },
    { id: 5, url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131', alt: 'Forest 5' },
    { id: 6, url: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843', alt: 'Forest 6' }
  ];
  
  const SOUND_IMAGES = {
    beep: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07',
    bell: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f'
  };
  
  // Timer state
  const timerState = {
    mode: 'focus',
    type: 'pomodoro',
    time: 25 * 60, // 25 minutes in seconds
    isRunning: false,
    selectedSound: 4, // Default to 'Birds'
    focusTime: 25,
    breakTime: 5,
    hideSeconds: false,
    autoStartTimer: true,
    timerSound: true,
    browserNotifications: false,
    cyclesCompleted: 0,
    totalCycles: 4,
    sleepTimer: 0,
    soundType: 'beep',
    hideControls: false,
    backgroundImage: SOUND_IMAGES['beep'],
    useSoundImage: true,
    playingSound: null,
    timerInterval: null,
    sleepTimeout: null
  };
  
  // Temporary values for settings
  const tempSettings = { ...timerState };
  
  // ====== DOM Elements ======
  const timerBackground = document.querySelector('.timer-background');
  const timerDisplay = document.querySelector('.timer-time');
  const cycleIndicators = document.querySelector('.cycle-indicators');
  const soundGrid = document.querySelector('.sound-grid');
  const backgroundGrid = document.querySelector('.background-grid');
  const forestTimer = document.querySelector('.forest-timer');
  
  // Buttons
  const focusBtn = document.querySelector('.focus-btn');
  const breakBtn = document.querySelector('.break-btn');
  const playPauseBtn = document.querySelector('.play-pause-btn');
  const resetBtn = document.querySelector('.reset-btn');
  const settingsBtn = document.querySelector('.settings-btn');
  const hideBtn = document.querySelector('.hide-btn');
  const eyeIcon = document.querySelector('.eye-icon');
  const eyeOffIcon = document.querySelector('.eye-off-icon');
  const playIcon = document.querySelector('.play-icon');
  const pauseIcon = document.querySelector('.pause-icon');
  
  // Settings Modal
  const settingsModal = document.querySelector('.settings-modal');
  const closeModalBtn = document.querySelector('.close-modal-btn');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const timerTypeBtns = document.querySelectorAll('.timer-type-btn');
  const focusTimeInput = document.getElementById('focus-time');
  const breakTimeInput = document.getElementById('break-time');
  const totalCyclesInput = document.getElementById('total-cycles');
  const addTenBtn = document.querySelector('.add-ten-btn');
  const sleepTimerInput = document.getElementById('sleep-timer');
  const timePresetBtns = document.querySelectorAll('.time-preset-btn');
  const hideSecondsToggle = document.getElementById('hide-seconds');
  const autoStartTimerToggle = document.getElementById('auto-start-timer');
  const timerSoundToggle = document.getElementById('timer-sound');
  const browserNotificationsToggle = document.getElementById('browser-notifications');
  const soundTypeRadios = document.querySelectorAll('input[name="sound-type"]');
  const playSoundBtns = document.querySelectorAll('.play-sound-btn');
  const useSoundImageBtn = document.querySelector('.use-sound-image-btn');
  const soundImageNotice = document.querySelector('.sound-image-notice');
  const cancelBtn = document.querySelector('.cancel-btn');
  const applyBtn = document.querySelector('.apply-btn');
  
  // Audio elements
  const audioElements = {};
  AMBIENT_SOUNDS.forEach(sound => {
    audioElements[sound.id] = document.getElementById(`sound-${sound.name.toLowerCase().replace(/\s/g, '-')}`);
  });
  const notificationBeep = document.getElementById('notification-beep');
  const notificationBell = document.getElementById('notification-bell');
  
  // ====== Initialize ======
  function init() {
    // Set initial background
    updateBackground(timerState.backgroundImage);
    
    // Create cycle indicators
    updateCycleIndicators();
    
    // Create sound tiles
    createSoundTiles();
    
    // Create background tiles
    createBackgroundTiles();
    
    // Initialize timer display
    updateTimerDisplay();
    
    // Set up event listeners
    setupEventListeners();
  }
  
  // ====== Timer Functions ======
  function updateTimerDisplay() {
    const minutes = Math.floor(timerState.time / 60);
    const seconds = timerState.time % 60;
    
    if (timerState.hideSeconds) {
      timerDisplay.textContent = `${minutes}`;
    } else {
      timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }
  
  function startTimer() {
    if (timerState.timerInterval) {
      clearInterval(timerState.timerInterval);
    }
    
    timerState.isRunning = true;
    playPauseBtn.classList.add('active');
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
    
    // Start playing sound if selected
    if (timerState.selectedSound && timerState.playingSound === null) {
      playSound(timerState.selectedSound);
    }
    
    // Set up sleep timer if enabled
    if (timerState.sleepTimer > 0) {
      if (timerState.sleepTimeout) {
        clearTimeout(timerState.sleepTimeout);
      }
      timerState.sleepTimeout = setTimeout(() => {
        pauseTimer();
        stopAllSounds();
      }, timerState.sleepTimer * 60 * 1000);
    }
    
    timerState.timerInterval = setInterval(() => {
      if (timerState.type === 'countup') {
        timerState.time += 1;
      } else {
        timerState.time -= 1;
        
        // Check if timer ended
        if (timerState.time <= 0) {
          // Play notification sound
          if (timerState.timerSound) {
            playNotificationSound();
          }
          
          // Show browser notification
          if (timerState.browserNotifications) {
            showNotification(`${timerState.mode === 'focus' ? 'Focus' : 'Break'} time ended!`);
          }
          
          // Auto switch between focus and break
          if (timerState.autoStartTimer) {
            let newMode, newTime, newCyclesCompleted;
            
            if (timerState.mode === 'focus') {
              newMode = 'break';
              newTime = timerState.breakTime * 60;
              newCyclesCompleted = timerState.cyclesCompleted + 1;
            } else {
              newMode = 'focus';
              newTime = timerState.focusTime * 60;
              newCyclesCompleted = timerState.cyclesCompleted;
            }
            
            timerState.mode = newMode;
            timerState.time = newTime;
            timerState.cyclesCompleted = newCyclesCompleted;
            
            // Update UI
            if (newMode === 'focus') {
              focusBtn.classList.add('active');
              breakBtn.classList.remove('active');
            } else {
              focusBtn.classList.remove('active');
              breakBtn.classList.add('active');
            }
            
            updateCycleIndicators();
          } else {
            pauseTimer();
            timerState.time = 0;
          }
        }
      }
      
      updateTimerDisplay();
    }, 1000);
  }
  
  function pauseTimer() {
    clearInterval(timerState.timerInterval);
    timerState.timerInterval = null;
    timerState.isRunning = false;
    
    playPauseBtn.classList.remove('active');
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    
    // Clear sleep timer if it exists
    if (timerState.sleepTimeout) {
      clearTimeout(timerState.sleepTimeout);
      timerState.sleepTimeout = null;
    }
  }
  
  function resetTimer() {
    pauseTimer();
    
    if (timerState.type === 'pomodoro') {
      switch (timerState.mode) {
        case 'focus':
          timerState.time = timerState.focusTime * 60;
          break;
        case 'break':
          timerState.time = timerState.breakTime * 60;
          break;
      }
    } else {
      timerState.time = 0;
    }
    
    timerState.cyclesCompleted = 0;
    updateCycleIndicators();
    updateTimerDisplay();
    
    // Stop all sounds
    stopAllSounds();
  }
  
  function toggleTimer() {
    if (timerState.isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  }
  
  function changeTimerMode(mode) {
    if (timerState.mode === mode) return;
    
    pauseTimer();
    timerState.mode = mode;
    
    if (mode === 'focus') {
      timerState.time = timerState.focusTime * 60;
      focusBtn.classList.add('active');
      breakBtn.classList.remove('active');
    } else {
      timerState.time = timerState.breakTime * 60;
      focusBtn.classList.remove('active');
      breakBtn.classList.add('active');
    }
    
    updateTimerDisplay();
  }
  
  function changeTimerType(type) {
    pauseTimer();
    timerState.type = type;
    
    // Update UI based on timer type
    timerTypeBtns.forEach(btn => {
      if (btn.dataset.type === type) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // Hide pomodoro settings if not pomodoro
    document.querySelector('.pomodoro-settings').style.display = 
      type === 'pomodoro' ? 'block' : 'none';
    
    // Update time based on type
    if (type === 'pomodoro') {
      if (timerState.mode === 'focus') {
        timerState.time = timerState.focusTime * 60;
      } else {
        timerState.time = timerState.breakTime * 60;
      }
      
      document.querySelector('.mode-switcher').style.display = 'flex';
      document.querySelector('.cycle-indicators').style.display = 'flex';
    } else if (type === 'countup') {
      timerState.time = 0;
      document.querySelector('.mode-switcher').style.display = 'none';
      document.querySelector('.cycle-indicators').style.display = 'none';
    } else {
      // None
      timerState.time = 0;
      document.querySelector('.mode-switcher').style.display = 'none';
      document.querySelector('.cycle-indicators').style.display = 'none';
    }
    
    updateTimerDisplay();
  }
  
  // ====== Sound Functions ======
  function playSound(soundId) {
    // Stop currently playing sound
    stopAllSounds();
    
    // Play the new sound
    const sound = AMBIENT_SOUNDS.find(s => s.id === soundId);
    if (sound) {
      const audio = document.getElementById(`sound-${sound.name.toLowerCase().replace(/\s/g, '-')}`);
      if (audio) {
        audio.volume = 0.5; // Set a default volume
        audio.play().catch(err => console.error("Error playing sound:", err));
        timerState.playingSound = soundId;
        
        // Update UI
        updateSoundTiles();
      }
    }
  }
  
  function stopAllSounds() {
    AMBIENT_SOUNDS.forEach(sound => {
      const audio = document.getElementById(`sound-${sound.name.toLowerCase().replace(/\s/g, '-')}`);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    
    timerState.playingSound = null;
    updateSoundTiles();
  }
  
  function playNotificationSound() {
    const sound = timerState.soundType === 'beep' ? notificationBeep : notificationBell;
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(err => console.error("Error playing notification:", err));
    }
  }
  
  function toggleSound(soundId) {
    if (timerState.playingSound === soundId) {
      stopAllSounds();
    } else {
      playSound(soundId);
    }
  }
  
  function showNotification(message) {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(message);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(message);
          }
        });
      }
    }
  }
  
  // ====== UI Functions ======
  function updateBackground(url) {
    timerBackground.style.backgroundImage = `url('${url}')`;
  }
  
  function updateCycleIndicators() {
    cycleIndicators.innerHTML = '';
    
    for (let i = 0; i < timerState.totalCycles; i++) {
      const indicator = document.createElement('div');
      indicator.className = `cycle-indicator${i < timerState.cyclesCompleted ? ' completed' : ''}`;
      indicator.setAttribute('aria-label', i < timerState.cyclesCompleted ? 'Completed cycle' : 'Pending cycle');
      cycleIndicators.appendChild(indicator);
    }
  }
  
  function createSoundTiles() {
    soundGrid.innerHTML = '';
    
    AMBIENT_SOUNDS.forEach(sound => {
      const tile = document.createElement('div');
      tile.className = `sound-tile${timerState.selectedSound === sound.id ? ' selected' : ''}`;
      tile.dataset.id = sound.id;
      
      const img = document.createElement('img');
      img.src = sound.iconUrl;
      img.alt = sound.name;
      tile.appendChild(img);
      
      if (timerState.selectedSound === sound.id) {
        const statusIndicator = document.createElement('div');
        statusIndicator.className = 'status-indicator';
        
        if (timerState.playingSound === sound.id) {
          const volumeIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          volumeIcon.setAttribute('viewBox', '0 0 24 24');
          volumeIcon.setAttribute('fill', 'none');
          volumeIcon.setAttribute('stroke', 'currentColor');
          volumeIcon.setAttribute('stroke-width', '2');
          volumeIcon.setAttribute('stroke-linecap', 'round');
          volumeIcon.setAttribute('stroke-linejoin', 'round');
          
          const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path1.setAttribute('d', 'M11 5L6 9H2v6h4l5 4z');
          
          const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path2.setAttribute('d', 'M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07');
          
          volumeIcon.appendChild(path1);
          volumeIcon.appendChild(path2);
          statusIndicator.appendChild(volumeIcon);
        } else {
          const circle = document.createElement('div');
          circle.style.width = '8px';
          circle.style.height = '8px';
          circle.style.backgroundColor = '#4CAF50';
          circle.style.borderRadius = '50%';
          statusIndicator.appendChild(circle);
        }
        
        tile.appendChild(statusIndicator);
      }
      
      if (timerState.playingSound === sound.id && timerState.selectedSound !== sound.id) {
        const playIndicator = document.createElement('div');
        playIndicator.className = 'play-indicator';
        
        const volumeXIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        volumeXIcon.setAttribute('viewBox', '0 0 24 24');
        volumeXIcon.setAttribute('fill', 'none');
        volumeXIcon.setAttribute('stroke', 'currentColor');
        volumeXIcon.setAttribute('stroke-width', '2');
        volumeXIcon.setAttribute('stroke-linecap', 'round');
        volumeXIcon.setAttribute('stroke-linejoin', 'round');
        
        const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path1.setAttribute('d', 'M11 5L6 9H2v6h4l5 4z');
        
        const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line1.setAttribute('x1', '23');
        line1.setAttribute('y1', '9');
        line1.setAttribute('x2', '17');
        line1.setAttribute('y2', '15');
        
        const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line2.setAttribute('x1', '17');
        line2.setAttribute('y1', '9');
        line2.setAttribute('x2', '23');
        line2.setAttribute('y2', '15');
        
        volumeXIcon.appendChild(path1);
        volumeXIcon.appendChild(line1);
        volumeXIcon.appendChild(line2);
        
        playIndicator.appendChild(volumeXIcon);
        playIndicator.addEventListener('click', (e) => {
          e.stopPropagation();
          stopAllSounds();
        });
        
        tile.appendChild(playIndicator);
      }
      
      tile.addEventListener('click', () => {
        selectSound(sound.id);
        toggleSound(sound.id);
      });
      
      soundGrid.appendChild(tile);
    });
  }
  
  function createBackgroundTiles() {
    backgroundGrid.innerHTML = '';
    
    BACKGROUND_IMAGES.forEach(bg => {
      const tile = document.createElement('div');
      tile.className = `background-tile${!timerState.useSoundImage && timerState.backgroundImage === bg.url ? ' selected' : ''}`;
      tile.dataset.url = bg.url;
      
      const img = document.createElement('img');
      img.src = bg.url;
      img.alt = bg.alt;
      tile.appendChild(img);
      
      tile.addEventListener('click', () => {
        tempSettings.backgroundImage = bg.url;
        tempSettings.useSoundImage = false;
        
        // Update selected class
        document.querySelectorAll('.background-tile').forEach(t => {
          t.classList.remove('selected');
        });
        tile.classList.add('selected');
        
        // Show sound image notice status
        soundImageNotice.classList.add('hidden');
      });
      
      backgroundGrid.appendChild(tile);
    });
  }
  
  function updateSoundTiles() {
    // Recreate sound tiles to reflect current state
    createSoundTiles();
  }
  
  function selectSound(soundId) {
    timerState.selectedSound = soundId;
    
    // If using sound image as background, update it
    if (timerState.useSoundImage) {
      const selectedSound = AMBIENT_SOUNDS.find(s => s.id === soundId);
      if (selectedSound) {
        updateBackground(selectedSound.iconUrl);
        timerState.backgroundImage = selectedSound.iconUrl;
      }
    }
    
    updateSoundTiles();
  }
  
  function toggleHideControls() {
    timerState.hideControls = !timerState.hideControls;
    
    if (timerState.hideControls) {
      forestTimer.classList.add('controls-hidden');
      document.querySelector('.ambient-sound-selector').style.display = 'none';
      eyeOffIcon.classList.add('hidden');
      eyeIcon.classList.remove('hidden');
    } else {
      forestTimer.classList.remove('controls-hidden');
      document.querySelector('.ambient-sound-selector').style.display = 'block';
      eyeOffIcon.classList.remove('hidden');
      eyeIcon.classList.add('hidden');
    }
  }
  
  // ====== Settings Functions ======
  function openSettingsModal() {
    // Copy current state to temp settings
    Object.assign(tempSettings, timerState);
    
    // Update form values
    focusTimeInput.value = tempSettings.focusTime;
    breakTimeInput.value = tempSettings.breakTime;
    totalCyclesInput.value = tempSettings.totalCycles;
    sleepTimerInput.value = tempSettings.sleepTimer;
    hideSecondsToggle.checked = tempSettings.hideSeconds;
    autoStartTimerToggle.checked = tempSettings.autoStartTimer;
    timerSoundToggle.checked = tempSettings.timerSound;
    browserNotificationsToggle.checked = tempSettings.browserNotifications;
    
    // Set sound type
    document.getElementById(`sound-${tempSettings.soundType}`).checked = true;
    
    // Show sound image notice if needed
    if (tempSettings.useSoundImage) {
      soundImageNotice.classList.remove('hidden');
    } else {
      soundImageNotice.classList.add('hidden');
    }
    
    // Update background tiles
    document.querySelectorAll('.background-tile').forEach(tile => {
      if (!tempSettings.useSoundImage && tile.dataset.url === tempSettings.backgroundImage) {
        tile.classList.add('selected');
      } else {
        tile.classList.remove('selected');
      }
    });
    
    // Show modal
    settingsModal.classList.add('active');
  }
  
  function closeSettingsModal() {
    settingsModal.classList.remove('active');
  }
  
  function applySettings() {
    // Apply temp settings to timer state
    timerState.focusTime = parseInt(focusTimeInput.value) || 25;
    timerState.breakTime = parseInt(breakTimeInput.value) || 5;
    timerState.totalCycles = parseInt(totalCyclesInput.value) || 4;
    timerState.sleepTimer = parseInt(sleepTimerInput.value) || 0;
    timerState.hideSeconds = hideSecondsToggle.checked;
    timerState.autoStartTimer = autoStartTimerToggle.checked;
    timerState.timerSound = timerSoundToggle.checked;
    timerState.browserNotifications = browserNotificationsToggle.checked;
    
    // Get sound type
    const selectedSoundType = document.querySelector('input[name="sound-type"]:checked');
    if (selectedSoundType) {
      timerState.soundType = selectedSoundType.value;
    }
    
    // Background settings
    timerState.useSoundImage = tempSettings.useSoundImage;
    timerState.backgroundImage = tempSettings.backgroundImage;
    updateBackground(timerState.backgroundImage);
    
    // Update the time if needed
    if (!timerState.isRunning) {
      if (timerState.type === 'pomodoro') {
        if (timerState.mode === 'focus') {
          timerState.time = timerState.focusTime * 60;
        } else {
          timerState.time = timerState.breakTime * 60;
        }
      }
      updateTimerDisplay();
    }
    
    // Update cycle indicators
    updateCycleIndicators();
    
    // Close modal
    closeSettingsModal();
  }
  
  function useSoundImage() {
    tempSettings.useSoundImage = true;
    
    // Set background image based on sound type
    if (tempSettings.soundType in SOUND_IMAGES) {
      tempSettings.backgroundImage = SOUND_IMAGES[tempSettings.soundType];
    }
    
    // Update UI
    soundImageNotice.classList.remove('hidden');
    
    // Deselect all background tiles
    document.querySelectorAll('.background-tile').forEach(tile => {
      tile.classList.remove('selected');
    });
  }
  
  // ====== Event Listeners ======
  function setupEventListeners() {
    // Mode buttons
    focusBtn.addEventListener('click', () => changeTimerMode('focus'));
    breakBtn.addEventListener('click', () => changeTimerMode('break'));
    
    // Timer controls
    playPauseBtn.addEventListener('click', toggleTimer);
    resetBtn.addEventListener('click', resetTimer);
    settingsBtn.addEventListener('click', openSettingsModal);
    hideBtn.addEventListener('click', toggleHideControls);
    
    // Settings modal
    closeModalBtn.addEventListener('click', closeSettingsModal);
    cancelBtn.addEventListener('click', closeSettingsModal);
    applyBtn.addEventListener('click', applySettings);
    
    // Tabs
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all tabs
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab
        btn.classList.add('active');
        document.querySelector(`.tab-content[data-tab="${btn.dataset.tab}"]`).classList.add('active');
      });
    });
    
    // Timer type
    timerTypeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        changeTimerType(btn.dataset.type);
      });
    });
    
    // Add 10 minutes button
    addTenBtn.addEventListener('click', () => {
      focusTimeInput.value = (parseInt(focusTimeInput.value) || 25) + 10;
    });
    
    // Time preset buttons
    timePresetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sleepTimerInput.value = btn.dataset.time;
      });
    });
    
    // Sound buttons
    playSoundBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const soundType = btn.dataset.sound;
        const audio = soundType === 'beep' ? notificationBeep : notificationBell;
        audio.currentTime = 0;
        audio.play().catch(err => console.error("Error playing sound:", err));
      });
    });
    
    // Use sound image button
    useSoundImageBtn.addEventListener('click', useSoundImage);
    
    // Browser notifications
    browserNotificationsToggle.addEventListener('change', () => {
      if (browserNotificationsToggle.checked && 'Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
    });
    
    // Close modal when clicking outside
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) {
        closeSettingsModal();
      }
    });
  }
  
  // Initialize the app
  document.addEventListener('DOMContentLoaded', init);
  