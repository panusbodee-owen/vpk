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
const categoryTopics = {
  general: [
    'ถ้าคุณมีเวลาเพิ่มวันละหนึ่งชั่วโมง จะเอาไปทำอะไร',
    'สิ่งเล็ก ๆ ที่ทำให้วันธรรมดาของคุณดีขึ้นคืออะไร',
    'เล่าเรื่องหนึ่งอย่างที่คุณเปลี่ยนใจหลังจากได้ลองทำจริง',
    'ถ้าต้องอธิบายตัวเองด้วยสิ่งของหนึ่งชิ้น จะเลือกอะไร',
    'กฎหนึ่งข้อที่คุณอยากเพิ่มให้โลกนี้มีคืออะไร',
    'อะไรคือคำชมที่คุณจำได้จนถึงวันนี้',
    'ถ้าคุณต้องสอนเรื่องหนึ่งให้คนทั้งโลก จะสอนอะไร',
    'ความเข้าใจผิดเกี่ยวกับตัวคุณที่คนมักมีคืออะไร',
    'หนึ่งนิสัยที่คุณอยากเริ่มในเดือนนี้คืออะไร',
    'เล่าเหตุผลที่คุณยังอยากตื่นขึ้นมาในวันพรุ่งนี้',
    'ถ้าความสุขเป็นเมนูอาหาร มันจะประกอบด้วยอะไรบ้าง'
  ],
  daily: [
    'อาหารจานหนึ่งที่คุณกินได้ซ้ำ ๆ โดยไม่เบื่อคืออะไร',
    'กิจวัตรตอนเช้าของคุณถ้าเล่าเป็นโฆษณาจะเป็นอย่างไร',
    'สถานที่ธรรมดา ๆ ที่ทำให้คุณรู้สึกสบายใจ',
    'ของใช้ชิ้นไหนที่คุณอยากออกแบบใหม่ให้ดีขึ้น',
    'วันที่เหนื่อยมาก คุณมีวิธีรีเซ็ตตัวเองอย่างไร',
    'ถ้าชีวิตมีปุ่ม Undo หนึ่งครั้ง คุณจะใช้กับเรื่องอะไร',
    'รีวิวห้องนอนของคุณเหมือนเป็นโรงแรมห้าดาว',
    'อะไรคือสิ่งที่คุณซื้อแล้วคุ้มที่สุด',
    'ถ้าต้องอยู่โดยไม่มีอินเทอร์เน็ตหนึ่งสัปดาห์จะทำอะไร',
    'เพลงไหนเหมาะกับซาวด์แทร็กชีวิตช่วงนี้',
    'อธิบายวันหยุดในฝันของคุณแบบละเอียด'
  ],
  creative: [
    'ตั้งชื่อหนังเกี่ยวกับชีวิตของคุณ พร้อมเล่าเรื่องย่อใน 3 ประโยค',
    'ขายก้อนเมฆหนึ่งก้อนให้คนที่ไม่เคยเห็นท้องฟ้า',
    'สร้างกฎของโลกที่ทุกคนต้องพูดความจริงวันละหนึ่งครั้ง',
    'ถ้าความคิดมีสี วันนี้หัวคุณจะเป็นสีอะไร',
    'ออกแบบแอปที่ไม่มีใครรู้ว่าตัวเองต้องการ แต่พอเห็นแล้วขาดไม่ได้',
    'อธิบายความรักโดยห้ามใช้คำว่า “ความรู้สึก”',
    'ออกแบบเทศกาลสำหรับคนที่ไม่ชอบงานเทศกาล',
    'เล่าเรื่องจากมุมมองของเก้าอี้ในห้องนี้',
    'ถ้าคุณสร้างสีใหม่ได้ จะตั้งชื่อว่าอะไร',
    'เปลี่ยนปัญหาน่ารำคาญหนึ่งอย่างให้กลายเป็นเกม',
    'เขียนพาดหัวข่าวเกี่ยวกับตัวคุณในอีก 20 ปี'
  ],
  future: [
    'ทักษะอะไรจะสำคัญที่สุดในโลกการทำงานอีก 10 ปีข้างหน้า',
    'ถ้า AI เป็นเพื่อนร่วมทีมของคุณ คุณอยากให้มันช่วยเรื่องอะไร',
    'บริษัทในฝันของคุณควรมีวัฒนธรรมการทำงานแบบไหน',
    'เล่าโปรเจกต์หนึ่งอย่างที่คุณอยากสร้างให้สำเร็จ',
    'ความสำเร็จในแบบของคุณวัดจากอะไร',
    'ถ้าได้เริ่มอาชีพใหม่พรุ่งนี้ คุณจะเลือกทำอะไร',
    'ทีมที่ดีควรมีคนแบบไหนบ้าง',
    'อะไรคือความแตกต่างระหว่างงานที่ดีและงานที่ใช่',
    'เล่าเป้าหมายหนึ่งอย่างที่คุณกำลังค่อย ๆ สร้าง',
    'ถ้าได้ส่งข้อความถึงตัวเองในอีก 5 ปี จะเขียนว่าอะไร',
    'ทักษะหนึ่งอย่างที่คุณอยากเก่งขึ้นก่อนสิ้นปีคืออะไร'
  ]
};
const categoryTopicsEn = {
  general: ['If you had one extra hour every day, how would you use it?', 'What small thing makes an ordinary day better?', 'What is something you changed your mind about after trying it?', 'If one object could describe you, what would it be?', 'What rule would you add to the world?', 'What compliment do you still remember?', 'What would you teach the whole world?', 'What do people often misunderstand about you?', 'What habit do you want to start this month?', 'Why are you looking forward to tomorrow?', 'If happiness were a meal, what would be in it?', 'What does success mean to you today?'],
  daily: ['What food could you eat every week without getting bored?', 'Turn your morning routine into a commercial.', 'What ordinary place makes you feel comfortable?', 'What everyday object would you redesign?', 'How do you reset after a difficult day?', 'If life had one Undo button, when would you use it?', 'Review your bedroom like a five-star hotel.', 'What purchase has been most worth it?', 'What would you do without the internet for one week?', 'What song fits the soundtrack of your life right now?', 'Describe your perfect day off.', 'What daily ritual would you never give up?'],
  creative: ['Name a movie about your life and pitch the plot in three sentences.', 'Sell one cloud to someone who has never seen the sky.', 'Create a world where everyone must tell the truth once a day.', 'If your thoughts had a color today, what color would they be?', 'Design an app nobody knows they need yet.', 'Explain love without using the word “feeling”.', 'Design a festival for people who dislike festivals.', 'Tell a story from the point of view of a chair.', 'If you could create a new color, what would you call it?', 'Turn one annoying problem into a game.', 'Write a headline about your life 20 years from now.', 'Invent a product that solves a completely silly problem.'],
  future: ['What skill will matter most in the workplace ten years from now?', 'If AI joined your team, what would you ask it to handle?', 'What culture should your dream company have?', 'What project do you want to build one day?', 'How do you measure success for yourself?', 'If you could start a new career tomorrow, what would it be?', 'What makes a great team?', 'What is the difference between a good job and the right job?', 'What goal are you slowly building toward?', 'What would you write to your future self five years from now?', 'What skill do you want to improve before the end of this year?', 'What should schools teach that they often do not?']
};
let mode = 'random', language = 'th', selectedCategory = 'general', selectedLevel = 'all', timerId, seconds = 60, slotTimer, slotInterval, caseTimer;
const topicEl = document.querySelector('#topic');
function getTopicList() {
  const bank = language === 'en' ? categoryTopicsEn : categoryTopics;
  const allTopics = bank[selectedCategory] || bank.general;
  if (selectedLevel === 'easy') return allTopics.slice(0, 4);
  if (selectedLevel === 'medium') return allTopics.slice(4, 8);
  if (selectedLevel === 'challenge') return allTopics.slice(-4);
  return allTopics;
}
function pickTopic() {
  const list = getTopicList();
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
    if (option.dataset.target === 'langLabel') { language = option.dataset.value === 'ไทย' ? 'th' : 'en'; pickTopic(); }
    if (option.dataset.level) { selectedLevel = option.dataset.level; pickTopic(); }
    if (option.dataset.category) { selectedCategory = option.dataset.category; pickTopic(); }
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
document.querySelector('#timerBtn').addEventListener('click', () => { document.querySelector('#timer').hidden = false; clearInterval(timerId); seconds = 60; renderTimer(); timerId = setInterval(() => { seconds--; renderTimer(); if(seconds <= 0){ clearInterval(timerId); alert(language === 'en' ? 'Time is up! Great job.' : 'หมดเวลาแล้ว! ทำได้ดีมาก'); } }, 1000); });
document.querySelector('#stopTimer').addEventListener('click', () => { clearInterval(timerId); timerId = null; });
document.querySelector('#resetTimer').addEventListener('click', () => { clearInterval(timerId); seconds = 60; renderTimer(); document.querySelector('#timer').hidden = true; });
