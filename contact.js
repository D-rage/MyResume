// contact.js — build mailto and store messages in localStorage
(function(){
  const form = document.getElementById('contactForm');
  const messagesList = document.getElementById('messagesList');
  const STORAGE_KEY = 'resume_contact_messages_v1';

  function loadMessages(){
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  function saveMessage(msg){
    const all = loadMessages();
    all.unshift(msg);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  function renderMessages(){
    const all = loadMessages();
    messagesList.innerHTML = '';
    if(all.length === 0){
      messagesList.innerHTML = '<li>No messages yet.</li>';
      return;
    }
    all.forEach(m => {
      const li = document.createElement('li');
      li.style.marginBottom = '12px';
      li.innerHTML = '<strong>' + escapeHtml(m.name) + '</strong> (' + escapeHtml(m.email) + ')<br>' + escapeHtml(m.message);
      messagesList.appendChild(li);
    });
  }

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  async function postToFormspree(endpoint, data){
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return response;
    } catch (err) {
      console.error('Formspree POST failed', err);
      return null;
    }
  }

  form.addEventListener('submit', async function(ev){
    ev.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if(!name || !email || !message) return;

    const payload = {
      name: name,
      email: email,
      message: message,
      date: new Date().toISOString()
    };

    // Save locally
    saveMessage(payload);
    renderMessages();

    // Try to send to Formspree if endpoint set
    const endpoint = form.dataset.formspreeEndpoint;
    if(endpoint && endpoint.indexOf('yourFormID') === -1){
      // Send JSON payload as Formspree recommends
      const res = await postToFormspree(endpoint, {name, email, message});
      if(res && (res.status === 200 || res.status === 202)){
        alert('Message sent via Formspree. Thank you!');
        form.reset();
      } else {
        alert('Unable to send via Formspree. The message was saved locally.');
      }
    } else {
      // No valid Formspree ID configured
      alert('Formspree endpoint not configured. Message saved locally. To enable sending, replace "yourFormID" in contact.html with your Formspree form ID.');
    }
  });

  // Initial render
  renderMessages();
})();
