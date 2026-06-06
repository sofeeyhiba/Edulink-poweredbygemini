// Screen navigation
let currentScreen = 0;
const totalScreens = 4;

function goToScreen(screenIndex) {
  // Hide all screens
  document.querySelectorAll('.app-screen').forEach(screen => {
    screen.classList.remove('active', 'exit');
    screen.classList.add('exit');
  });
  
  // Show selected screen
  setTimeout(() => {
    const screen = document.getElementById(`scr-${screenIndex}`);
    if (screen) {
      screen.classList.remove('exit');
      screen.classList.add('active');
    }
  }, 50);
  
  // Update dots
  document.querySelectorAll('.sdot').forEach((dot, index) => {
    dot.classList.toggle('active', index === screenIndex);
  });
  
  // Update navigation chip
  const chipTexts = ['🏠 Home', '📸 Scan', '💬 Study', '🔥 Streak'];
  const chip = document.getElementById('screen-chip');
  if (chip) chip.textContent = chipTexts[screenIndex];
  
  currentScreen = screenIndex;
}

function nextScreen() {
  const next = (currentScreen + 1) % totalScreens;
  goToScreen(next);
}

function prevScreen() {
  const prev = (currentScreen - 1 + totalScreens) % totalScreens;
  goToScreen(prev);
}

function toggleNav() {
  const links = document.querySelector('.nav-links');
  const button = document.querySelector('.nav-toggle');
  if (links) {
    const isOpen = links.classList.toggle('open');
    if (button) button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }
}

// Scan functionality
function triggerScan() {
  const result = document.getElementById('scan-result');
  if (result) {
    result.classList.toggle('show');
  }
}

function answerScan(element, answer, correct) {
  // Mark correct/wrong
  document.querySelectorAll('#scan-opts .qopt').forEach(opt => {
    opt.classList.remove('correct', 'wrong', 'dim');
  });
  
  if (answer === correct) {
    element.classList.add('correct');
    showToast('✅ Correct answer!');
  } else {
    element.classList.add('wrong');
    document.querySelectorAll('#scan-opts .qopt').forEach(opt => {
      if (opt.textContent.includes(correct)) {
        opt.classList.add('correct', 'reveal');
      } else if (opt !== element) {
        opt.classList.add('dim');
      }
    });
    showToast('❌ Try again!');
  }
}

// Chat functionality
function answerChat(element, answer, correct) {
  // Mark correct/wrong
  document.querySelectorAll('#chat-quiz .awopt').forEach(opt => {
    opt.classList.remove('correct', 'wrong', 'dim');
  });
  
  if (answer === correct) {
    element.classList.add('correct');
    showToast('✅ Great explanation!');
  } else {
    element.classList.add('wrong');
    document.querySelectorAll('#chat-quiz .awopt').forEach(opt => {
      if (opt.textContent.includes('Aisha')) {
        opt.classList.add('correct', 'reveal');
      } else if (opt !== element) {
        opt.classList.add('dim');
      }
    });
    showToast('❌ Check the explanation again');
  }
}

function sendMsg() {
  const input = document.getElementById('chat-inp');
  const message = input?.value.trim();
  
  if (message) {
    // Add user message to chat
    const feed = document.getElementById('chat-feed');
    if (feed) {
      const userMsg = document.createElement('div');
      userMsg.className = 'bubble-row mine';
      userMsg.innerHTML = `
        <div class="bav" style="background:#1E1240;color:#9D6FEC">S</div>
        <div><div class="bubble mine">${message}</div><div class="btime" style="text-align:right">Just now</div></div>
      `;
      feed.appendChild(userMsg);
      feed.scrollTop = feed.scrollHeight;
    }
    
    input.value = '';
    showToast('📨 Message sent!');
  }
}

// Toast notifications
function showToast(message) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }
}

// Waitlist form
function handleWaitlist() {
  const emailInput = document.getElementById('email-input');
  const email = emailInput?.value.trim();
  
  if (email && email.includes('@')) {
    if (typeof window.addToWaitlist === 'function') {
      showToast('⏳ Adding you to the waitlist...');
      window.addToWaitlist(email)
        .then(() => {
          showToast('✅ Added to waitlist! Check your email.');
          emailInput.value = '';
        })
        .catch(error => {
          console.error('Waitlist save failed:', error);
          showToast('❌ Failed to add email. Try again.');
        });
    } else {
      showToast('⚠️ Firebase is not configured yet.');
    }
  } else {
    showToast('❌ Please enter a valid email');
  }
}

// Intersection Observer for reveal animations
document.addEventListener('DOMContentLoaded', function() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.reveal').forEach(element => {
    observer.observe(element);
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      const links = document.querySelector('.nav-links');
      if (links) links.classList.remove('open');
    });
  });
});

// ========== WAITLIST FORM ==========
const form = document.getElementById('waitlist-form');
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const emailInput = document.getElementById('email-input');
  const email = emailInput?.value.trim();
  if (!email || !email.includes('@')) {
    showToast('❌ Please enter a valid email');
    return;
  }

  form.style.display = 'none';
  document.getElementById('success-msg').style.display = 'block';
  showToast('🎉 You’re on the waitlist!');
  if (emailInput) emailInput.value = '';
});