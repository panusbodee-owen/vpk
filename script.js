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
let mode = 'random', language = 'th', timerId, seconds = 60;
const topicEl = document.querySelector('#topic');
function pickTopic() { const list = topics[mode]; topicEl.textContent = list[Math.floor(Math.random() * list.length)]; document.querySelector('#previousTopic').textContent = 'พร้อมไหม? หายใจลึก ๆ แล้วเริ่มพูด'; document.querySelector('#nextTopic').textContent = 'กดสุ่มอีกครั้งเพื่อเปลี่ยนหัวข้อ'; }
document.querySelectorAll('.nav-pill').forEach(btn => btn.addEventListener('click', () => { document.querySelectorAll('.nav-pill').forEach(b => b.classList.remove('active')); btn.classList.add('active'); mode = btn.dataset.mode; pickTopic(); }));
document.querySelector('#spinBtn').addEventListener('click', pickTopic);
document.querySelector('#langBtn').addEventListener('click', () => { language = language === 'th' ? 'en' : 'th'; document.querySelector('#langLabel').textContent = language === 'th' ? 'ไทย' : 'English'; });
document.querySelector('#levelBtn').addEventListener('click', () => { const label = document.querySelector('#levelLabel'); label.textContent = label.textContent === 'สุ่มทุกระดับ' ? 'ท้าทาย' : 'สุ่มทุกระดับ'; });
document.querySelector('#categoryBtn').addEventListener('click', () => { const label = document.querySelector('#categoryLabel'); label.textContent = label.textContent === 'ทั่วไป' ? 'ชีวิตประจำวัน' : 'ทั่วไป'; });
document.querySelector('#analysisBtn').addEventListener('click', () => alert('โหมดโค้ชกำลังจะมาเร็ว ๆ นี้ — ตอนนี้ลองตั้งเวลาแล้วเริ่มพูดได้เลย!'));
function renderTimer(){ document.querySelector('#timerValue').textContent = `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`; }
document.querySelector('#timerBtn').addEventListener('click', () => { document.querySelector('#timer').hidden = false; clearInterval(timerId); seconds = 60; renderTimer(); timerId = setInterval(() => { seconds--; renderTimer(); if(seconds <= 0){ clearInterval(timerId); alert('หมดเวลาแล้ว! ทำได้ดีมาก'); } }, 1000); });
document.querySelector('#resetTimer').addEventListener('click', () => { clearInterval(timerId); seconds = 60; renderTimer(); document.querySelector('#timer').hidden = true; });
