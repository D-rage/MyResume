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