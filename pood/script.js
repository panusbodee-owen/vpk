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
  ],
  deep: [
    'ถ้าความสำเร็จไม่มีใครมองเห็น คุณยังอยากทำสิ่งเดิมอยู่ไหม',
    'ความเชื่ออะไรของคุณที่อาจเปลี่ยนไปได้เมื่อมีประสบการณ์มากขึ้น',
    'คุณกำลังพยายามพิสูจน์อะไรกับตัวเองหรือคนอื่นอยู่หรือเปล่า',
    'ถ้าต้องเลือกหนึ่งอย่างระหว่างความมั่นคงกับอิสระ คุณจะเลือกอะไร เพราะอะไร',
    'บทเรียนจากความผิดพลาดครั้งหนึ่งที่คุณยังใช้ตัดสินใจอยู่คืออะไร',
    'คุณคิดว่าตัวตนของเราถูกสร้างจากสิ่งที่เลือก หรือสิ่งที่จำเป็นต้องเจอมากกว่ากัน',
    'ถ้าคุณได้คุยกับตัวเองในวันที่กำลังท้อที่สุด คุณอยากบอกอะไร',
    'มีเรื่องอะไรที่คุณรู้คำตอบอยู่แล้ว แต่ยังไม่กล้ายอมรับ',
    'อะไรคือเส้นแบ่งระหว่างการพยายามต่อกับการรู้ว่าเมื่อไหร่ควรปล่อยมือ',
    'ถ้าต้องตัดสิ่งหนึ่งออกจากชีวิตเพื่อให้มีพื้นที่กับสิ่งสำคัญ คุณจะตัดอะไร',
    'คุณอยากให้คนจำคุณจากความสามารถ หรือจากวิธีที่คุณทำให้พวกเขารู้สึก',
    'วันนี้คุณกำลังใช้ชีวิตตามความต้องการของตัวเอง หรือความคาดหวังของใครอยู่'
  ]
};
const categoryTopicsEn = {
  general: ['If you had one extra hour every day, how would you use it?', 'What small thing makes an ordinary day better?', 'What is something you changed your mind about after trying it?', 'If one object could describe you, what would it be?', 'What rule would you add to the world?', 'What compliment do you still remember?', 'What would you teach the whole world?', 'What do people often misunderstand about you?', 'What habit do you want to start this month?', 'Why are you looking forward to tomorrow?', 'If happiness were a meal, what would be in it?', 'What does success mean to you today?'],
  daily: ['What food could you eat every week without getting bored?', 'Turn your morning routine into a commercial.', 'What ordinary place makes you feel comfortable?', 'What everyday object would you redesign?', 'How do you reset after a difficult day?', 'If life had one Undo button, when would you use it?', 'Review your bedroom like a five-star hotel.', 'What purchase has been most worth it?', 'What would you do without the internet for one week?', 'What song fits the soundtrack of your life right now?', 'Describe your perfect day off.', 'What daily ritual would you never give up?'],
  creative: ['Name a movie about your life and pitch the plot in three sentences.', 'Sell one cloud to someone who has never seen the sky.', 'Create a world where everyone must tell the truth once a day.', 'If your thoughts had a color today, what color would they be?', 'Design an app nobody knows they need yet.', 'Explain love without using the word “feeling”.', 'Design a festival for people who dislike festivals.', 'Tell a story from the point of view of a chair.', 'If you could create a new color, what would you call it?', 'Turn one annoying problem into a game.', 'Write a headline about your life 20 years from now.', 'Invent a product that solves a completely silly problem.'],
  future: ['What skill will matter most in the workplace ten years from now?', 'If AI joined your team, what would you ask it to handle?', 'What culture should your dream company have?', 'What project do you want to build one day?', 'How do you measure success for yourself?', 'If you could start a new career tomorrow, what would it be?', 'What makes a great team?', 'What is the difference between a good job and the right job?', 'What goal are you slowly building toward?', 'What would you write to your future self five years from now?', 'What skill do you want to improve before the end of this year?', 'What should schools teach that they often do not?'],
  deep: ['If nobody could see your success, would you still want the same things?', 'What belief of yours might change as you gain more experience?', 'What are you trying to prove to yourself or to other people?', 'If you had to choose between security and freedom, which would you choose and why?', 'What lesson from a mistake still shapes the way you make decisions?', 'Do you think identity is shaped more by our choices or by what we have to face?', 'If you could speak to yourself on your hardest day, what would you say?', 'What do you already know but still refuse to admit?', 'How do you tell the difference between persistence and knowing when to let go?', 'What would you remove from your life to make room for what matters most?', 'Would you rather be remembered for what you can do or how you make people feel?', 'Are you living by your own wishes today, or by someone else’s expectations?']
};
const interviewTopicsEn = [
  'Tell me about yourself beyond what is written on your resume.',
  'What strength do you bring to a team?',
  'Tell me about a time you solved an unexpected problem.',
  'What would you like to be better at one year from now?',
  'Describe a piece of feedback that changed how you work.',
  'How do you decide what to do when everything feels urgent?',
  'What kind of team environment helps you do your best work?',
  'Why are you interested in this kind of role?',
  'Tell me about a project you are proud to have completed.',
  'What does meaningful progress look like to you?',
  'How would a teammate describe the way you collaborate?',
  'What question would you ask us at the end of an interview?'
];
const interviewStyleTopics = {
  general: [
    'เล่าเกี่ยวกับตัวคุณในแบบที่ไม่ซ้ำกับเรซูเม่',
    'จุดแข็งที่คุณใช้ช่วยทีมได้ดีที่สุดคืออะไร',
    'เล่าเหตุการณ์ที่คุณต้องแก้ปัญหาเฉพาะหน้า',
    'อีกสามปีข้างหน้า คุณอยากเห็นตัวเองเป็นอย่างไร',
    'เล่าโปรเจกต์ที่คุณภูมิใจที่สุดและบทบาทของคุณในโปรเจกต์นั้น',
    'คำแนะนำหรือฟีดแบ็กอะไรที่เปลี่ยนวิธีทำงานของคุณ'
  ],
  tech: [
    'เล่าโปรเจกต์เทคโนโลยีที่คุณเคยทำ ตั้งแต่โจทย์จนถึงผลลัพธ์',
    'เวลาระบบมีปัญหา คุณจะไล่หาสาเหตุอย่างเป็นขั้นตอนอย่างไร',
    'อธิบายเทคโนโลยีที่คุณถนัดให้คนที่ไม่ใช่สายเทคเข้าใจ',
    'คุณตัดสินใจเลือกระหว่างความเร็ว คุณภาพ และความปลอดภัยอย่างไร',
    'เล่าครั้งที่คุณต้องเรียนรู้เครื่องมือหรือเฟรมเวิร์กใหม่อย่างรวดเร็ว',
    'ถ้าเห็นโค้ดหรือระบบที่ทำงานได้แต่ดูแลยาก คุณจะจัดการอย่างไร'
  ],
  management: [
    'เล่าเหตุการณ์ที่คุณต้องนำทีมให้ไปถึงเป้าหมาย',
    'ถ้าสมาชิกในทีมเห็นต่างกันมาก คุณจะช่วยให้ทีมตัดสินใจอย่างไร',
    'คุณจัดลำดับความสำคัญเมื่อทุกงานถูกบอกว่าเร่งด่วนอย่างไร',
    'เล่าครั้งที่คุณต้องรับผิดชอบต่อความผิดพลาดของทีม',
    'คุณวัดความสำเร็จของทีมและโครงการจากอะไรบ้าง',
    'ถ้าผู้มีส่วนได้ส่วนเสียเปลี่ยนความต้องการกลางทาง คุณจะรับมืออย่างไร'
  ],
  creative: [
    'เล่าผลงานที่แสดงวิธีคิดสร้างสรรค์ของคุณได้ดีที่สุด',
    'คุณเริ่มต้นคิดไอเดียใหม่เมื่อเจอโจทย์ที่ยังไม่ชัดอย่างไร',
    'เล่าครั้งที่คุณต้องปกป้องไอเดียต่อหน้าคนที่ไม่เห็นด้วย',
    'คุณใช้ฟีดแบ็กเพื่อพัฒนางานโดยไม่เสียตัวตนอย่างไร',
    'ถ้าเวลาน้อยและทรัพยากรจำกัด คุณจะเลือกตัดอะไรออกจากงานก่อน',
    'ผลงานที่ดีในมุมมองของคุณควรสร้างผลกระทบอะไรให้ผู้ใช้'
  ],
  graduate: [
    'เล่าประสบการณ์จากการเรียน ฝึกงาน หรือกิจกรรมนอกห้องเรียนที่สะท้อนตัวคุณ',
    'ทักษะอะไรที่คุณกำลังเร่งพัฒนาเพื่อเริ่มต้นการทำงาน',
    'เล่าครั้งที่คุณทำงานร่วมกับคนที่มีสไตล์ต่างจากคุณ',
    'เมื่อได้รับงานที่ไม่เคยทำ คุณจะเริ่มต้นเรียนรู้จากตรงไหน',
    'คุณอยากได้อะไรจากหัวหน้าหรือทีมในช่วงเริ่มงาน',
    'ทำไมคุณจึงสนใจตำแหน่งนี้ และคุณคิดว่าจะช่วยทีมได้อย่างไร'
  ]
};
const interviewStyleTopicsEn = {
  general: interviewTopicsEn,
  tech: ['Tell me about a technology project you built, from the problem to the outcome.', 'How would you systematically debug a failing system?', 'Explain a technology you know well to a non-technical person.', 'How do you balance speed, quality, and security?', 'Tell me about a time you had to learn a new tool or framework quickly.', 'What would you do with working code that is difficult to maintain?'],
  management: ['Tell me about a time you led a team toward a goal.', 'How do you help a team decide when members strongly disagree?', 'How do you prioritise when every task is urgent?', 'Tell me about a time you took responsibility for a team mistake.', 'How do you measure the success of a team or project?', 'How would you handle a stakeholder changing requirements mid-project?'],
  creative: ['Tell me about work that best shows how you think creatively.', 'How do you start when a creative brief is still unclear?', 'Tell me about a time you defended an idea someone disagreed with.', 'How do you use feedback without losing your point of view?', 'If time and resources were limited, what would you cut first?', 'What impact should good creative work have on its users?'],
  graduate: ['Tell me about a class, internship, or activity that reflects who you are.', 'What skill are you actively developing for your first role?', 'Tell me about a time you worked with someone very different from you.', 'How do you start learning something you have never done before?', 'What do you hope to learn from your first manager or team?', 'Why are you interested in this role, and how could you help the team?']
};
let mode = 'random', language = 'th', selectedCategory = 'general', selectedLevel = 'all', selectedInterviewStyle = 'general', timerId, seconds = 60, slotTimer, slotInterval, caseTimer, caseSoundTimers = [];
const topicEl = document.querySelector('#topic');
function renderModeIntro() {
  const tagline = document.querySelector('#modeTagline');
  const note = document.querySelector('#personalNote');
  if (mode === 'speed') {
    tagline.innerHTML = language === 'en' ? 'Think fast<br><span>Speak before time runs out</span>' : 'สุ่มให้ไว<br><span>พูดให้ทันก่อนหมดเวลา</span>';
    note.textContent = language === 'en' ? 'A focused 30-second round. No overthinking, just get to the point.' : 'โหมดสปีด 30 วินาที ตัดความคิดเยอะออก แล้วพูดให้เข้าประเด็น';
  } else if (mode === 'interview') {
    tagline.innerHTML = language === 'en' ? 'Answer clearly<br><span>Be more yourself</span>' : 'ตอบให้ชัด<br><span>ในแบบที่เป็นตัวเอง</span>';
    note.textContent = language === 'en' ? 'Practice interview answers from real experience, one clear thought at a time.' : 'ซ้อมตอบสัมภาษณ์จากประสบการณ์จริง คิดทีละประเด็นแล้วพูดออกมา';
  } else {
    tagline.innerHTML = language === 'en' ? 'Pick one<br><span>Then just start talking</span>' : 'สุ่มมาเลย<br><span>เดี๋ยวก็พูดได้เองแหละ</span>';
    note.textContent = language === 'en' ? 'Overthinking will not make you speak. Pick a topic and let it flow.' : 'คิดเยอะไปก็ไม่ได้พูด ลองสุ่มหัวข้อแล้วปล่อยของแบบไม่ต้องเป๊ะกันเถอะ ✌️';
  }
}
function renderInterviewCopy() {
  const english = language === 'en';
  document.querySelector('#interviewEyebrow').textContent = english ? 'MODE 03 / INTERVIEW ROOM' : 'โหมด 03 / ห้องซ้อมสัมภาษณ์';
  document.querySelector('#interviewTitle').innerHTML = english ? 'Practice interview answers<br><em>and sound more like yourself</em>' : 'ซ้อมตอบคำถามสัมภาษณ์<br><em>ให้เป็นตัวเองมากขึ้น</em>';
  document.querySelector('#interviewLead').textContent = english ? 'A practice room before the real interview. Draw a question and answer clearly without memorising someone else’s script.' : 'พื้นที่ซ้อมพูดก่อนถึงห้องสัมภาษณ์จริง สุ่มคำถามแล้วตอบให้ชัด โดยไม่ต้องท่องคำตอบให้เหมือนใคร';
  const cards = english ? [
    ['Answer from experience', 'Use a real moment to show how you think and what you did.'],
    ['Keep it focused', 'Shape your answer so it lands clearly in about one minute.'],
    ['Speak, then refine', 'Use Feedback to improve flow, clarity, and confidence.']
  ] : [
    ['ตอบจากประสบการณ์', 'เล่าเหตุการณ์จริงให้เห็นวิธีคิดและสิ่งที่คุณลงมือทำ'],
    ['จับเวลาให้พอดี', 'ฝึกเรียบเรียงคำตอบให้อยู่ในเวลาประมาณ 1 นาที'],
    ['พูดแล้วค่อยปรับ', 'ใช้ Feedback ดูความต่อเนื่อง ความชัดเจน และความมั่นใจ']
  ];
  cards.forEach((card, index) => {
    document.querySelector(`#interviewCardTitle${index + 1}`).textContent = card[0];
    document.querySelector(`#interviewCardText${index + 1}`).textContent = card[1];
  });
  document.querySelector('#startInterview').innerHTML = `${english ? 'Start interview mode' : 'เริ่มโหมดสัมภาษณ์'} <span>→</span>`;
}
function getTopicList() {
  if (mode === 'interview') {
    const bank = language === 'en' ? interviewStyleTopicsEn : interviewStyleTopics;
    return bank[selectedInterviewStyle] || bank.general;
  }
  const bank = language === 'en' ? categoryTopicsEn : categoryTopics;
  const allTopics = bank[selectedCategory] || bank.general;
  if (selectedLevel === 'easy') return allTopics.slice(0, 4);
  if (selectedLevel === 'medium') return allTopics.slice(4, 8);
  if (selectedLevel === 'challenge') return allTopics.slice(-4);
  return allTopics;
}
function playTone(frequency, duration = .06, volume = .035, type = 'square') {
  const AudioContextAPI = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextAPI) return;
  window.poodAudio = window.poodAudio || new AudioContextAPI();
  const context = window.poodAudio;
  if (context.state === 'suspended') context.resume();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type; oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(volume, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + duration);
  oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + duration);
}
function playNoise(duration = .04, volume = .018, filterFrequency = 1800) {
  const AudioContextAPI = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextAPI) return;
  window.poodAudio = window.poodAudio || new AudioContextAPI();
  const context = window.poodAudio;
  if (context.state === 'suspended') context.resume();
  const buffer = context.createBuffer(1, context.sampleRate * duration, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  filter.type = 'bandpass'; filter.frequency.value = filterFrequency; filter.Q.value = .7;
  gain.gain.setValueAtTime(volume, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + duration);
  source.buffer = buffer; source.connect(filter); filter.connect(gain); gain.connect(context.destination);
  source.start(); source.stop(context.currentTime + duration);
}
function stopCaseSound() {
  caseSoundTimers.forEach(timer => clearTimeout(timer));
  caseSoundTimers = [];
}
function playCaseSound() {
  stopCaseSound();
  // A softer, original case-opening sound: latch, rolling clicks, then a gentle reveal.
  playNoise(.06, .009, 2100);
  playTone(105, .11, .018, 'triangle');
  caseSoundTimers.push(setTimeout(() => playTone(190, .07, .012, 'sine'), 110));
  caseSoundTimers.push(setTimeout(() => playNoise(.08, .007, 850), 180));

  caseSoundTimers.push(setTimeout(() => {
    stopCaseSound();
    playNoise(.12, .009, 1050);
    playTone(300, .1, .018, 'triangle');
    caseSoundTimers.push(setTimeout(() => playTone(520, .14, .016, 'triangle'), 95));
    caseSoundTimers.push(setTimeout(() => playTone(780, .22, .012, 'sine'), 210));
  }, 3050));
}
function pickTopic() {
  const list = getTopicList();
  const card = document.querySelector('.topic-card');
  const track = document.querySelector('#caseTrack');
  clearTimeout(slotTimer);
  clearInterval(slotInterval);
  clearTimeout(caseTimer);
  stopCaseSound();
  card.classList.remove('shuffle');
  void card.offsetWidth;
  card.classList.remove('slot-spin', 'case-active');
  void card.offsetWidth;
  card.classList.add('shuffle', 'slot-spin', 'case-active');
  playCaseSound();
  const previousTopic = topicEl.textContent.trim();
  let winner = Math.floor(Math.random() * list.length);
  if (list.length > 1) {
    while (list[winner] === previousTopic) winner = Math.floor(Math.random() * list.length);
  }
  const items = Array.from({length: 31}, (_, index) => list[index === 25 ? winner : Math.floor(Math.random() * list.length)]);
  track.innerHTML = items.map((item, index) => `<div class="case-item ${index === 25 ? 'winner' : ''}"><small>${String(index + 1).padStart(2, '0')}</small><span>${item}</span></div>`).join('');
  track.style.transition = 'none';
  track.style.transform = 'translateX(0)';
  requestAnimationFrame(() => {
    const winnerCard = track.querySelector('.case-item.winner');
    const itemWidth = winnerCard.getBoundingClientRect().width;
    const centerOffset = (card.clientWidth - itemWidth) / 2;
    track.style.transition = 'transform 3s cubic-bezier(.08,.72,.14,1)';
    track.style.transform = `translateX(${centerOffset - winnerCard.offsetLeft}px)`;
  });
  caseTimer = setTimeout(() => {
    topicEl.textContent = track.querySelector('.case-item.winner span').textContent;
    topicEl.classList.remove('shuffle-text');
    card.classList.remove('case-active', 'slot-spin');
    track.innerHTML = '';
  }, 3250);
  setTimeout(() => card.classList.remove('shuffle'), 3400);
  document.querySelector('#previousTopic').textContent = mode === 'interview'
    ? (language === 'en' ? 'Interview question ready. Take a breath and begin.' : 'คำถามสัมภาษณ์พร้อมแล้ว หายใจลึก ๆ แล้วเริ่มพูด')
    : (language === 'en' ? 'Ready when you are.' : 'พร้อมไหม? หายใจลึก ๆ แล้วเริ่มพูด');
  document.querySelector('#nextTopic').textContent = mode === 'interview'
    ? (language === 'en' ? 'Press Spin to draw another interview question' : 'กดสุ่มเพื่อเปลี่ยนคำถามสัมภาษณ์')
    : (language === 'en' ? 'Press Spin to draw a new topic' : 'กดสุ่มอีกครั้งเพื่อเปลี่ยนหัวข้อ');
}
document.querySelectorAll('.nav-pill').forEach(btn => btn.addEventListener('click', () => {
  btn.animate([{transform:'scale(1)'},{transform:'scale(.94)'},{transform:'scale(1)'}], {duration:260});
  document.querySelectorAll('.nav-pill').forEach(item => item.classList.toggle('active', item === btn));
  mode = btn.dataset.mode || 'random';
  renderModeIntro();
  renderInterviewCopy();
  const interviewMode = document.querySelector('#interviewMode');
  if (mode === 'interview') {
    document.querySelector('.layout').classList.add('interview-active');
    interviewMode.hidden = false;
    document.querySelector('.intro').hidden = true;
    document.querySelector('.controls').hidden = false;
    document.querySelector('#levelBtn').closest('.dropdown-wrap').hidden = true;
    document.querySelector('#categoryBtn').closest('.dropdown-wrap').hidden = true;
    document.querySelector('.interview-style-wrap').hidden = false;
    document.querySelector('.topic-stack').hidden = true;
    document.querySelector('.actions').hidden = true;
    document.querySelector('#timer').hidden = true;
    return;
  }
  document.querySelector('.layout').classList.remove('interview-active');
  interviewMode.hidden = true;
  document.querySelector('.intro').hidden = false;
  document.querySelector('.controls').hidden = false;
  document.querySelector('.topic-stack').hidden = false;
  document.querySelector('.actions').hidden = false;
  document.querySelector('#timer').hidden = false;
  document.querySelector('#levelBtn').closest('.dropdown-wrap').hidden = false;
  document.querySelector('#categoryBtn').closest('.dropdown-wrap').hidden = false;
  document.querySelector('.interview-style-wrap').hidden = true;
  document.querySelector('#mainDuration').hidden = false;
  document.querySelector('#mainDuration').disabled = false;
  document.querySelector('#spinBtn').innerHTML = `<span>↻</span> ${language === 'en' ? 'Spin topic' : 'สุ่มหัวข้อ'}`;
  if (mode === 'speed') {
    document.querySelector('#mainDuration').value = '30';
    document.querySelector('#mainDuration').hidden = true;
    document.querySelector('#mainDuration').disabled = true;
    clearInterval(timerId);
    seconds = 30;
    renderTimer();
    document.querySelector('#previousTopic').textContent = language === 'en' ? 'Speed mode selected. Make every second count.' : 'เลือกโหมดสปีดแล้ว ทุกวินาทีมีความหมาย';
    document.querySelector('#nextTopic').textContent = language === 'en' ? 'Press Spin, then speak for 30 seconds' : 'กดสุ่ม แล้วพูดให้จบใน 30 วินาที';
  } else {
    document.querySelector('#previousTopic').textContent = language === 'en' ? 'Ready when you are.' : 'พร้อมไหม? หายใจลึก ๆ แล้วเริ่มพูด';
    document.querySelector('#nextTopic').textContent = language === 'en' ? 'Press Spin to draw a new topic' : 'กดสุ่มหัวข้อเพื่อเริ่มคำถามใหม่';
  }
}));
document.querySelector('#startInterview').addEventListener('click', () => {
  document.querySelector('.layout').classList.add('interview-active');
  document.querySelector('#interviewMode').hidden = false;
  document.querySelector('.intro').hidden = true;
  document.querySelector('.controls').hidden = false;
  document.querySelector('.topic-stack').hidden = false;
  document.querySelector('.actions').hidden = true;
  document.querySelector('#timer').hidden = true;
  document.querySelector('#levelBtn').closest('.dropdown-wrap').hidden = true;
  document.querySelector('#categoryBtn').closest('.dropdown-wrap').hidden = true;
  document.querySelector('.interview-style-wrap').hidden = false;
  document.querySelector('#mainDuration').hidden = false;
  document.querySelector('#mainDuration').disabled = false;
  document.querySelector('#mainDuration').value = '60';
  document.querySelector('#spinBtn').innerHTML = `<span>↻</span> ${language === 'en' ? 'Spin interview question' : 'สุ่มคำถามสัมภาษณ์'}`;
  pickTopic();
});
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
    if (option.dataset.target === 'langLabel') { language = option.dataset.value === 'ไทย' ? 'th' : 'en'; document.querySelector('#langEmoji').textContent = option.dataset.emoji; renderModeIntro(); renderInterviewCopy(); }
    if (option.dataset.level) selectedLevel = option.dataset.level;
    if (option.dataset.category) selectedCategory = option.dataset.category;
    if (option.dataset.interviewStyle) {
      selectedInterviewStyle = option.dataset.interviewStyle;
    }
    document.querySelector('#previousTopic').textContent = language === 'en' ? 'Settings saved. Ready when you are.' : 'ตั้งค่าแล้ว พร้อมเมื่อคุณพร้อม';
    document.querySelector('#nextTopic').textContent = language === 'en' ? 'Press Spin to draw a new topic' : 'กดสุ่มหัวข้อเพื่อเริ่มคำถามใหม่';
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
const feedbackModal = document.querySelector('#feedbackModal');
const recordBtn = document.querySelector('#recordBtn');
const recordStatus = document.querySelector('#recordStatus');
const transcriptEl = document.querySelector('#transcript');
const feedbackResult = document.querySelector('#feedbackResult');
let recognition, isListening = false, speechStartedAt = 0, finalTranscript = '';
let feedbackTimerId, feedbackSeconds = 60;
const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
document.querySelector('#analysisBtn').addEventListener('click', () => { feedbackModal.hidden = false; feedbackResult.hidden = true; document.querySelector('#feedbackTopic').textContent = topicEl.textContent; renderScoreHistory(); });
document.querySelector('#closeFeedback').addEventListener('click', () => { if (recognition && isListening) recognition.stop(); feedbackModal.hidden = true; });
feedbackModal.addEventListener('click', event => { if (event.target === feedbackModal) { if (recognition && isListening) recognition.stop(); feedbackModal.hidden = true; } });
function showFeedback() {
  const text = finalTranscript.trim();
  const secondsSpoken = Math.max(1, Math.round((Date.now() - speechStartedAt) / 1000));
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const fillers = (text.match(/(เอ่อ|อืม|แบบว่า|คือว่า|um|uh|like|you know)/gi) || []).length;
  const flow = Math.min(100, Math.round(35 + Math.min(secondsSpoken, 60) * .65 + Math.min(words, 100) * .18));
  const clarity = Math.max(20, Math.min(100, Math.round(58 + Math.min(words, 80) * .25 - fillers * 5)));
  const confidence = Math.max(20, Math.min(100, Math.round(45 + Math.min(secondsSpoken, 60) * .55 + (words > 25 ? 18 : 0) - fillers * 3)));
  const total = Math.round((flow + clarity + confidence) / 3);
  document.querySelector('#scoreValue').textContent = total;
  document.querySelector('#flowScore').textContent = flow;
  document.querySelector('#clarityScore').textContent = clarity;
  document.querySelector('#confidenceScore').textContent = confidence;
  document.querySelector('#feedbackComment').textContent = total >= 80 ? 'ลื่นไหลมาก! ลองเพิ่มตัวอย่างหรือมุมมองส่วนตัวให้คมขึ้นอีกนิด' : total >= 60 ? 'ทำได้ดีแล้ว ลองพูดให้ต่อเนื่องขึ้นและลดคำฟุ่มเฟือยลงอีกนิด' : 'เริ่มต้นได้ดี ลองพูดให้ยาวขึ้นอีกนิด แล้วค่อย ๆ เพิ่มรายละเอียด';
  saveScore({ topic: topicEl.textContent, score: total, flow, clarity, confidence, language, category: selectedCategory, level: selectedLevel, date: new Date().toISOString() });
  feedbackResult.hidden = false;
}
function saveScore(entry) { const history = JSON.parse(localStorage.getItem('poodThammaiScores') || '[]'); history.unshift(entry); localStorage.setItem('poodThammaiScores', JSON.stringify(history.slice(0, 20))); renderScoreHistory(); }
function renderScoreHistory() { const history = JSON.parse(localStorage.getItem('poodThammaiScores') || '[]'); const target = document.querySelector('#scoreHistory'); if (!history.length) { target.textContent = 'ยังไม่มีประวัติการพูด'; return; } target.innerHTML = history.slice(0, 8).map(item => `<div class="history-row"><span>${item.topic}<small>${new Date(item.date).toLocaleDateString('th-TH')} · ${item.language === 'en' ? 'English' : 'ไทย'}</small></span><strong>${item.score}</strong></div>`).join(''); }
function setupRecognition() {
  if (!SpeechRecognitionAPI) { transcriptEl.textContent = 'เบราว์เซอร์นี้ยังไม่รองรับการฟังเสียง ลองใช้ Google Chrome หรือ Microsoft Edge'; return false; }
  recognition = new SpeechRecognitionAPI(); recognition.continuous = true; recognition.interimResults = true; recognition.lang = language === 'en' ? 'en-US' : 'th-TH';
  recognition.onstart = () => { isListening = true; speechStartedAt = Date.now(); recordBtn.classList.add('stop'); recordBtn.innerHTML = '<span>■</span> หยุดฟัง'; recordStatus.classList.add('listening'); recordStatus.lastChild.textContent = ' กำลังฟังอยู่...'; };
  recognition.onresult = event => { let interim = ''; finalTranscript = ''; for (let i = 0; i < event.results.length; i++) { const text = event.results[i][0].transcript; if (event.results[i].isFinal) finalTranscript += text + ' '; else interim += text; } transcriptEl.textContent = (finalTranscript + interim) || 'กำลังฟัง...'; };
  recognition.onerror = event => { if (event.error === 'not-allowed') transcriptEl.textContent = 'กรุณาอนุญาตการใช้ไมโครโฟนเพื่อเริ่มประเมิน'; };
  recognition.onend = () => { if (isListening) { isListening = false; recordBtn.classList.remove('stop'); recordBtn.innerHTML = '<span>●</span> เริ่มพูด'; recordStatus.classList.remove('listening'); recordStatus.lastChild.textContent = ' พร้อมรับฟัง'; showFeedback(); } };
  return true;
}
recordBtn.addEventListener('click', () => { if (isListening) { recognition.stop(); return; } finalTranscript = ''; transcriptEl.textContent = 'กำลังเตรียมไมโครโฟน...'; if (setupRecognition()) recognition.start(); });
function renderFeedbackTimer() { document.querySelector('#feedbackTimerValue').textContent = `${String(Math.floor(feedbackSeconds / 60)).padStart(2, '0')}:${String(feedbackSeconds % 60).padStart(2, '0')}`; }
const feedbackDuration = document.querySelector('#feedbackDuration');
const mainDuration = document.querySelector('#mainDuration');
function syncDuration(value) { feedbackDuration.value = String(value); mainDuration.value = String(value); feedbackSeconds = Number(value); renderFeedbackTimer(); }
feedbackDuration.addEventListener('change', () => { clearInterval(feedbackTimerId); syncDuration(feedbackDuration.value); const button = document.querySelector('#feedbackTimerBtn'); button.dataset.running = 'false'; button.textContent = 'เริ่มจับเวลา'; });
mainDuration.addEventListener('change', () => { clearInterval(timerId); syncDuration(mainDuration.value); });
document.querySelector('#feedbackTimerBtn').addEventListener('click', event => { clearInterval(feedbackTimerId); if (event.currentTarget.dataset.running === 'true') { event.currentTarget.dataset.running = 'false'; event.currentTarget.textContent = 'เริ่มจับเวลา'; return; } event.currentTarget.dataset.running = 'true'; event.currentTarget.textContent = 'หยุดเวลา'; feedbackTimerId = setInterval(() => { feedbackSeconds--; renderFeedbackTimer(); if (feedbackSeconds <= 0) { clearInterval(feedbackTimerId); event.currentTarget.dataset.running = 'false'; event.currentTarget.textContent = 'เริ่มจับเวลา'; } }, 1000); });
document.querySelector('#feedbackTimerReset').addEventListener('click', () => { clearInterval(feedbackTimerId); feedbackSeconds = Number(feedbackDuration.value); renderFeedbackTimer(); const button = document.querySelector('#feedbackTimerBtn'); button.dataset.running = 'false'; button.textContent = 'เริ่มจับเวลา'; });
document.querySelector('#clearHistory').addEventListener('click', () => { localStorage.removeItem('poodThammaiScores'); renderScoreHistory(); });
function renderTimer(){ document.querySelector('#timerValue').textContent = `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`; }
document.querySelector('#timerBtn').addEventListener('click', () => { document.querySelector('#timer').hidden = false; clearInterval(timerId); seconds = Number(mainDuration.value); renderTimer(); timerId = setInterval(() => { seconds--; renderTimer(); if(seconds <= 0){ clearInterval(timerId); alert(language === 'en' ? 'Time is up! Great job.' : 'หมดเวลาแล้ว! ทำได้ดีมาก'); } }, 1000); });
document.querySelector('#stopTimer').addEventListener('click', () => { clearInterval(timerId); timerId = null; });
document.querySelector('#resetTimer').addEventListener('click', () => { clearInterval(timerId); seconds = mode === 'speed' ? 30 : Number(mainDuration.value); renderTimer(); document.querySelector('#timer').hidden = true; });
