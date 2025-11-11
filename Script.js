JavaScript



// Responsive feedback form behavior
(() => {
  const form = document.getElementById('feedback-form');
  const messageEl = document.getElementById('message');
  const charCount = document.getElementById('char-count');
  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');
  const resetBtn = document.getElementById('reset-btn');
  const stars = Array.from(document.querySelectorAll('.star'));

  // Initialize character count
  const updateCharCount = () => {
    const len = messageEl.value.length;
    charCount.textContent = ${len} / ${messageEl.maxLength};
    if (len < messageEl.minLength) {
      charCount.style.color = '#b91c1c'; // red if too short
    } else {
      charCount.style.color = '';
    }
  };
  updateCharCount();
  messageEl.addEventListener('input', updateCharCount);

  // Rating keyboard + click handling
  let rating = 0;
  const setRatingUI = (value) => {
    rating = value;
    stars.forEach((s) => {
      const val = Number(s.dataset.value);
      const checked = val <= value;
      s.setAttribute('aria-checked', checked ? 'true' : 'false');
      s.classList.toggle('filled', checked);
    });
  };

  stars.forEach((star, i) => {
    star.addEventListener('click', () => {
      const val = Number(star.dataset.value);
      // toggle: click the same star again to clear
      setRatingUI(rating === val ? 0 : val);
    });

      // Keyboard: Left/Right or Home/End to change rating
    star.addEventListener('keydown', (ev) => {
      const idx = i;
      if (ev.key === 'ArrowRight') {
        const next = Math.min(5, (rating || idx + 1) + 1);
        setRatingUI(next);
        stars[Math.max(0, Math.min(4, next - 1))].focus();
        ev.preventDefault();
      } else if (ev.key === 'ArrowLeft') {
        const prev = Math.max(0, (rating || idx + 1) - 1);
        setRatingUI(prev);
        stars[Math.max(0, prev - 1)].focus();
        ev.preventDefault();
      } else if (ev.key === 'Home') {
        setRatingUI(0);
        ev.preventDefault();
      } else if (ev.key === 'End') {
        setRatingUI(5);
        ev.preventDefault();
      } else if (ev.key === 'Enter' || ev.key === ' ') {
        // Space/Enter toggles
        const val = Number(star.dataset.value);
        setRatingUI(rating === val ? 0 : val);
        ev.preventDefault();
      }
    });
  });

  // Simple validation helper
  const validate = () => {
    const msg = messageEl.value.trim();
    if (msg.length < messageEl.minLength) {
      return { ok: false, message: 'Message must be at least ${messageEl.minLength} characters.' };
    }
    if (msg.length > messageEl.maxLength) {
      return { ok: false, message: 'Message must be less than ${messageEl.maxLength} characters.' };
    }
    // optional email check if provided
    const email = document.getElementById('email').value.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { ok: false, message: 'Please enter a valid email address.' };
    }
    return { ok: true };
  };

  // Simulate submit (replace with real fetch to your backend endpoint)
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    status.textContent = '';
    status.className = 'status';

    const v = validate();
    if (!v.ok) {
      status.textContent = v.message;
      status.classList.add('error');
      submitBtn.focus();
      return;
    }

    // Disable UI while "sending"
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    submitBtn.style.opacity = '0.9';

    const payload = {
      rating,
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      message: messageEl.value.trim(),
      submitted_at: new Date().toISOString(),
    };

    try {
      // Simulate network latency
      await new Promise((res) => setTimeout(res, 700));

      // Example: store feedback locally as demonstration
      const key = 'demo_feedback_list';
      const prev = JSON.parse(localStorage.getItem(key) || '[]');
      prev.unshift(payload);
      localStorage.setItem(key, JSON.stringify(prev.slice(0, 50)));

      status.textContent = 'Thanks — your feedback was submitted!';
      status.classList.add('success');

      // Reset form (but keep name/email for convenience)
      messageEl.value = '';
      updateCharCount();
      setRatingUI(0);
    } catch (err) {
      console.error(err);
      status.textContent = 'Something went wrong. Please try again later.';
      status.classList.add('error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send feedback';
      submitBtn.style.opacity = '';
    }
  });

  // Reset button
  resetBtn.addEventListener('click', () => {
    form.reset();
    setRatingUI(0);
    updateCharCount();
    status.textContent = '';
    status.className = 'status';
  });

  // Friendly enhancement: allow clicking outside inputs to blur on mobile
  document.addEventListener('touchstart', (e) => {
    if (!form.contains(e.target)) {
      document.activeElement?.blur?.();
    }
  });

  // Give initial focus to the message textarea on larger screens
  if (window.innerWidth >= 720) {
    messageEl.focus();
  }

})();