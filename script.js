const topics = {
  random: [
    'อธิบายอินเทอร์เน็ตให้เด็กอนุบาลเข้าใจ โดยห้ามใช้คำว่า “คอมพิวเตอร์”',
    'ถ้าคุณเปลี่ยนอาชีพได้หนึ่งวัน คุณจะเลือกเป็นอะไร เพราะอะไร',
    'ขายของธรรมดาสักชิ้นให้ดูน่าสนใจภายใน 30 วินาที',
    'เมืองในฝันของคุณควรมีอะไรที่เมืองปัจจุบันไม่มี',
    'เล่าเรื่องความล้มเหลวหนึ่งครั้งที่สอนอะไรบางอย่างให้คุณ'
  ],
  interview: ['เล่าเกี่ยวกับตัวคุณในแบบที่ไม่ซ้ำกับเรซูเม่', 'จุดแข็งที่คุณใช้ช่วยทีมได้ดีที่สุดคืออะไร', 'เล่าเหตุการณ์ที่คุณต้องแก้ปัญหาเฉพาะหน้า', 'อีกสามปีข้างหน้า คุณอยากเห็นตัวเองเป็นอย่างไร'],
  vocab: ['ความกล้าหาญ — อธิบายความหมายพร้อมยกตัวอย่าง', 'ความอยากรู้อยากเห็น — ใช้ในประโยคให้ได้ 3 แบบ', 'ความยืดหยุ่น — เล่าเหตุการณ์ที่คำนี้มีความหมายกับคุณ'],
  research: ['เทคโนโลยีจะเปลี่ยนวิธีเรียนรู้ของคนในอีก 10 ปีอย่างไร', 'เมืองควรออกแบบอย่างไรให้คนมีความสุขมากขึ้น', 'เราจะสร้างสมดุลระหว่างความเป็นส่วนตัวกับ AI ได้อย่างไร']
};
let mode = 'random', language = 'th', timerId, seconds = 60, slotTimer, slotInterval, caseTimer;
const topicEl = document.querySelector('#topic');
function pickTopic() {
  const list = topics[mode];
  const card = document.querySelector('.topic-card');
  const track = document.querySelector('#caseTrack');
  clearTimeout(slotTimer);
  clearInterval(slotInterval);
  clearTimeout(caseTimer);
  card.classList.remove('shuffle');
  void card.offsetWidth;
  card.classList.remove('slot-spin', 'case-active');
  void card.offsetWidth;
  card.classList.add('shuffle', 'slot-spin', 'case-active');
  const winner = Math.floor(Math.random() * list.length);
  const items = Array.from({length: 31}, (_, index) => list[index === 25 ? winner : Math.floor(Math.random() * list.length)]);
  track.innerHTML = items.map((item, index) => `<div class="case-item ${index === 25 ? 'winner' : ''}"><small>${String(index + 1).padStart(2, '0')}</small><span>${item}</span></div>`).join('');
  track.style.transition = 'none';
  track.style.transform = 'translateX(0)';
  requestAnimationFrame(() => {
    const winnerCard = track.querySelector('.case-item.winner');
    const itemWidth = winnerCard.getBoundingClientRect().width;
    const centerOffset = (card.clientWidth - itemWidth) / 2;
    track.style.transition = 'transform 2.8s cubic-bezier(.08,.72,.14,1)';
    track.style.transform = `translateX(${centerOffset - winnerCard.offsetLeft}px)`;
  });
  caseTimer = setTimeout(() => {
    topicEl.textContent = track.querySelector('.case-item.winner span').textContent;
    topicEl.classList.remove('shuffle-text');
    card.classList.remove('case-active', 'slot-spin');
    track.innerHTML = '';
  }, 3100);
  setTimeout(() => card.classList.remove('shuffle'), 3250);
  document.querySelector('#previousTopic').textContent = 'พร้อมไหม? หายใจลึก ๆ แล้วเริ่มพูด';
  document.querySelector('#nextTopic').textContent = 'กดสุ่มอีกครั้งเพื่อเปลี่ยนหัวข้อ';
}
document.querySelectorAll('.nav-pill').forEach(btn => btn.addEventListener('click', () => { btn.animate([{transform:'scale(1)'},{transform:'scale(.94)'},{transform:'scale(1)'}], {duration:260}); pickTopic(); }));
document.querySelector('#spinBtn').addEventListener('click', pickTopic);
document.querySelectorAll('.dropdown-wrap').forEach(dropdown => {
  const trigger = dropdown.querySelector('.select-chip');
  trigger.addEventListener('click', event => {
    event.stopPropagation();
    document.querySelectorAll('.dropdown-wrap.open').forEach(other => { if (other !== dropdown) other.classList.remove('open'); });
    dropdown.classList.toggle('open');
    trigger.setAttribute('aria-expanded', dropdown.classList.contains('open'));
    trigger.classList.add('chip-pop');
    setTimeout(() => trigger.classList.remove('chip-pop'), 450);
  });
  dropdown.querySelectorAll('.dropdown-menu button').forEach(option => option.addEventListener('click', () => {
    document.querySelector(`#${option.dataset.target}`).textContent = option.dataset.value;
    if (option.dataset.target === 'langLabel') language = option.dataset.value === 'ไทย' ? 'th' : 'en';
    dropdown.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
  }));
});
document.addEventListener('click', () => document.querySelectorAll('.dropdown-wrap.open').forEach(dropdown => dropdown.classList.remove('open')));
const donateModal = document.querySelector('#donateModal');
document.querySelector('#donateBtn').addEventListener('click', () => { donateModal.hidden = false; });
document.querySelector('#closeDonate').addEventListener('click', () => { donateModal.hidden = true; });
donateModal.addEventListener('click', event => { if (event.target === donateModal) donateModal.hidden = true; });
document.querySelectorAll('.select-chip').forEach((chip, index) => chip.addEventListener('click', () => {
  chip.classList.remove('chip-pop');
  void chip.offsetWidth;
  chip.classList.add('chip-pop');
}));
document.querySelector('#analysisBtn').addEventListener('click', () => alert('โหมดปั่นกำลังอุ่นเครื่องอยู่! ตอนนี้กดสุ่มแล้วพูดไปก่อนเลย ✨'));
function renderTimer(){ document.querySelector('#timerValue').textContent = `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`; }
document.querySelector('#timerBtn').addEventListener('click', () => { document.querySelector('#timer').hidden = false; clearInterval(timerId); seconds = 60; renderTimer(); timerId = setInterval(() => { seconds--; renderTimer(); if(seconds <= 0){ clearInterval(timerId); alert('หมดเวลาแล้ว! ทำได้ดีมาก'); } }, 1000); });
document.querySelector('#resetTimer').addEventListener('click', () => { clearInterval(timerId); seconds = 60; renderTimer(); document.querySelector('#timer').hidden = true; });
