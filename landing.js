document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.sidebar .option-btn');

  // Entrance animation using GSAP (slide from left for sidebar)
  gsap.from(buttons, {
    duration: 0.7,
    x: -30,
    opacity: 0,
    stagger: 0.12,
    ease: 'power3.out'
  });

  // Title and subtitle entrance to match resume animations
  const title = document.querySelector('.landing-title');
  const sub = document.querySelector('.landing-sub');
  if (title) gsap.from(title, { duration: 0.9, y: -16, opacity: 0, ease: 'back.out(1.2)' });
  if (sub) gsap.from(sub, { duration: 0.9, y: -8, opacity: 0, delay: 0.12, ease: 'power3.out' });

  // Avatar subtle scale pulse to echo resume bubble motion
  const avatar = document.querySelector('.landing-avatar');
  if (avatar) gsap.to(avatar, { scale: 1.03, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });

  // Hover interactions
  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, { x: 6, duration: 0.18, ease: 'power2.out' });
      gsap.to(btn.querySelector('.btn-icon'), { rotation: 8, duration: 0.28 });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, duration: 0.18, ease: 'power2.out' });
      gsap.to(btn.querySelector('.btn-icon'), { rotation: 0, duration: 0.28 });
    });

    // Click feedback
    btn.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      btn.appendChild(ripple);
      gsap.fromTo(ripple, { scale: 0, opacity: 0.6 }, { scale: 3, opacity: 0, duration: 0.6, ease: 'power2.out', onComplete() { ripple.remove(); } });
    });
  });

  // Keyboard accessibility: focus animation
  buttons.forEach(btn => {
    btn.addEventListener('focus', () => gsap.to(btn, { scale: 1.04, duration: 0.15 }));
    btn.addEventListener('blur', () => gsap.to(btn, { scale: 1, duration: 0.15 }));
  });
});
