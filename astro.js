(function(){
  const form = document.getElementById('astroForm');
  const preview = document.getElementById('payloadPreview');
  const clearBtn = document.getElementById('clearBtn');
  const lookupBtn = document.getElementById('lookupPlace');
  const lookupStatus = document.getElementById('lookupStatus');

  // Google Geocoding API key (client-side). Keep this restricted in Google Cloud Console.
  const GEOCODING_API_KEY = 'Test Key';

  function showMessage(msg){
    preview.textContent = msg;
  }

  function validateNumber(value, min, max){
    if (value === '' || value === null || Number.isNaN(Number(value))) return false;
    const n = Number(value);
    return n >= min && n <= max;
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();

    const dob = document.getElementById('dob').value; // YYYY-MM-DD
    const tob = document.getElementById('tob').value; // HH:MM
    const place = document.getElementById('place').value.trim();
    const lat = document.getElementById('lat').value;
    const lng = document.getElementById('lng').value;

    // Basic validation
    if (!dob) return alert('Please provide Date of Birth.');
    if (!tob) return alert('Please provide Time of Birth.');
    if (!validateNumber(lat, -90, 90)) return alert('Latitude must be a number between -90 and 90.');
    if (!validateNumber(lng, -180, 180)) return alert('Longitude must be a number between -180 and 180.');

    const payload = {
      dob: dob, // ISO date
      tob: tob, // local time HH:MM
      place: place || null,
      latitude: Number(Number(lat).toFixed(4)),
      longitude: Number(Number(lng).toFixed(4)),
      // Add timezone or other metadata if needed
    };

    // Save last submission to localStorage for convenience
    try { localStorage.setItem('astroLast', JSON.stringify(payload)); } catch (err) { console.warn('localStorage unavailable', err); }

    // Show prepared JSON payload so user may copy or send to API
    showMessage(JSON.stringify(payload, null, 2));

    // Example: to POST to an API, set API_ENDPOINT and uncomment
    // const API_ENDPOINT = 'https://your-kundali-api.example.com/generate';
    // fetch(API_ENDPOINT, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    //   .then(r => r.json()).then(console.log).catch(console.error);
  });

  // Geocode place -> fill lat/lng
  async function geocodePlace(place) {
    if (!place) {
      lookupStatus.textContent = 'Please enter a place to look up.';
      return null;
    }
    if (!GEOCODING_API_KEY) {
      lookupStatus.textContent = 'No API key configured.';
      return null;
    }
    lookupStatus.textContent = 'Looking up...';
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(place)}&key=${GEOCODING_API_KEY}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Network response not ok');
      const data = await res.json();
      if (data.status !== 'OK' || !data.results || data.results.length === 0) {
        lookupStatus.textContent = `No results (${data.status}).`;
        return null;
      }
      const r = data.results[0];
      const lat = r.geometry.location.lat;
      const lng = r.geometry.location.lng;
      const formatted = r.formatted_address || place;
      document.getElementById('lat').value = Number(lat.toFixed(4));
      document.getElementById('lng').value = Number(lng.toFixed(4));
      document.getElementById('place').value = formatted;
      lookupStatus.textContent = `Found: ${formatted}`;
      return { lat, lng, formatted };
    } catch (err) {
      console.error(err);
      lookupStatus.textContent = 'Lookup failed. See console.';
      return null;
    }
  }

  if (lookupBtn) {
    lookupBtn.addEventListener('click', () => {
      const place = document.getElementById('place').value.trim();
      geocodePlace(place);
    });
  }

  clearBtn.addEventListener('click', () => {
    form.reset();
    showMessage('Cleared.');
    try { localStorage.removeItem('astroLast'); } catch (e) {}
  });

  // On load, populate form with last values if present
  (function loadLast(){
    try {
      const raw = localStorage.getItem('astroLast');
      if (!raw) return;
      const d = JSON.parse(raw);
      if (d.dob) document.getElementById('dob').value = d.dob;
      if (d.tob) document.getElementById('tob').value = d.tob;
      if (d.place) document.getElementById('place').value = d.place;
      if (typeof d.latitude !== 'undefined') document.getElementById('lat').value = d.latitude;
      if (typeof d.longitude !== 'undefined') document.getElementById('lng').value = d.longitude;
      showMessage(JSON.stringify(d, null, 2));
    } catch (err) { console.warn('Could not load previous data', err); }
  })();
})();
