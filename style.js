// Some code thanks to @chrisgannon

const select = function(s) {
  return document.querySelector(s);
};

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

const tl = new TimelineMax();

for (let i = 0; i < 11; i++) {
  const element = select('.bubble' + i);
  
  // Guard against missing elements
  if (!element) {
    console.warn('Element .bubble' + i + ' not found');
    continue;
  }

  const t = TweenMax.to(element, randomBetween(1, 1.5), {
    x: randomBetween(12, 15) * randomBetween(-1, 1),
    y: randomBetween(12, 15) * randomBetween(-1, 1),
    repeat: -1,
    repeatDelay: randomBetween(0.2, 0.5),
    yoyo: true,
    ease: Elastic.easeOut.config(1, 0.5)
  });

  tl.add(t, (i + 1) / 0.6);
}

tl.seek(50);

// Download logging: records downloads to localStorage and optionally POSTs to a server endpoint.
document.addEventListener('DOMContentLoaded', function () {
  function getLogs() {
    try {
      return JSON.parse(localStorage.getItem('downloadLogs') || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveLogs(logs) {
    localStorage.setItem('downloadLogs', JSON.stringify(logs));
  }

  function addLogEntry(entry) {
    // Try sending to server endpoint (optional). Fallback to localStorage.
    try {
      if (navigator.sendBeacon) {
        var url = '/log-download';
        var payload = JSON.stringify(entry);
        navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' }));
      } else {
        fetch('/log-download', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entry) }).catch(function () {});
      }
    } catch (e) {}

    var logs = getLogs();
    logs.push(entry);
    saveLogs(logs);
    renderLogs();
  }

  function renderLogs() {
    var container = document.getElementById('download-log-entries');
    if (!container) return;
    var logs = getLogs().slice().reverse();
    if (logs.length === 0) {
      container.innerHTML = '<div style="color:#666">No downloads recorded yet.</div>';
      return;
    }
    container.innerHTML = logs.map(function (l) {
      return '<div style="padding:6px 0;border-bottom:1px solid #eee"><strong>' + (l.timestamp || '') + '</strong><div style="color:#444">' + (l.file || '') + ' — ' + (l.ua || '') + '</div></div>';
    }).join('');
  }

  function exportLogs() {
    var logs = getLogs();
    var blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'download-logs.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  var dl = document.getElementById('download-resume');
  if (dl) {
    dl.addEventListener('click', function (e) {
      var entry = {
        timestamp: new Date().toISOString(),
        file: dl.getAttribute('href') || 'resume.pdf',
        ua: navigator.userAgent || '',
        page: location.href || ''
      };
      addLogEntry(entry);
      // allow the download to proceed; no preventDefault
    });
  }

  var toggle = document.getElementById('toggle-download-log');
  var exportBtn = document.getElementById('export-download-log');
  var entries = document.getElementById('download-log-entries');
  if (toggle && entries) {
    toggle.addEventListener('click', function () {
      if (entries.style.display === 'none' || entries.style.display === '') {
        entries.style.display = 'block';
        renderLogs();
        toggle.textContent = 'Hide Download Log';
      } else {
        entries.style.display = 'none';
        toggle.textContent = 'View Download Log';
      }
    });
  }
  if (exportBtn) {
    exportBtn.addEventListener('click', exportLogs);
  }

  // Render on load if visible
  if (document.getElementById('download-log-entries') && document.getElementById('download-log-entries').style.display !== 'none') {
    renderLogs();
  }
});