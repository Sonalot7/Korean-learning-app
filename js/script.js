// js/quiz.js
// Single quiz script with embedded datasets so site is static (no external data files)
(function(){
  // helper: query string
  function qs(key){ return new URLSearchParams(location.search).get(key); }

  // datasets
  const KB_HANGUL = [
    { char: "ㄱ", rom: "g/k" }, { char: "ㄴ", rom: "n" }, { char: "ㄷ", rom: "d/t" },
    { char: "ㄹ", rom: "r/l" }, { char: "ㅁ", rom: "m" }, { char: "ㅂ", rom: "b/p" },
    { char: "ㅅ", rom: "s" }, { char: "ㅇ", rom: "ng / silent" }, { char: "ㅈ", rom: "j" },
    { char: "ㅊ", rom: "ch" }, { char: "ㅋ", rom: "k" }, { char: "ㅌ", rom: "t" },
    { char: "ㅍ", rom: "p" }, { char: "ㅎ", rom: "h" },
    { char: "ㅏ", rom: "a" }, { char: "ㅑ", rom: "ya" }, { char: "ㅓ", rom: "eo" },
    { char: "ㅕ", rom: "yeo" }, { char: "ㅗ", rom: "o" }, { char: "ㅛ", rom: "yo" },
    { char: "ㅜ", rom: "u" }, { char: "ㅠ", rom: "yu" }, { char: "ㅡ", rom: "eu" },
    { char: "ㅣ", rom: "i" }, { char: "ㅐ", rom: "ae" }, { char: "ㅒ", rom: "yae" },
    { char: "ㅔ", rom: "e" }, { char: "ㅖ", rom: "ye" }, { char: "ㅘ", rom: "wa" },
    { char: "ㅙ", rom: "wae" }, { char: "ㅚ", rom: "oe" }, { char: "ㅝ", rom: "wo" },
    { char: "ㅞ", rom: "we" }, { char: "ㅟ", rom: "wi" }, { char: "ㅢ", rom: "ui" }
  ];

  const KB_NUMBERS = (function(){
    const native = [
      "", "하나","둘","셋","넷","다섯","여섯","일곱","여덟","아홉",
      "열","열한","열두","열세","열네","열다섯","열여섯","열일곱","열여덟","열아홉",
      "스물","스물한","스물두","스물세","스물네","스물다섯","스물여섯","스물일곱","스물여덟","스물아홉",
      "서른","서른한","서른두","서른세","서른네","서른다섯","서른여섯","서른일곱","서른여덟","서른아홉",
      "마흔","마흔한","마흔두","마흔세","마흔네","마흔다섯","마흔여섯","마흔일곱","마흔여덟","마흔아홉"
    ];
    const sino = [
      "","일","이","삼","사","오","육","칠","팔","구",
      "십","십일","십이","십삼","십사","십오","십육","십칠","십팔","십구",
      "이십","이십일","이십이","이십삼","이십사","이십오","이십육","이십칠","이십팔","이십구",
      "삼십","삼십일","삼십이","삼십삼","삼십사","삼십오","삼십육","삼십칠","삼십팔","삼십구",
      "사십","사십일","사십이","사십삼","사십사","사십오","사십육","사십칠","사십팔","사십구"
    ];
    const english = [
      "", "one","two","three","four","five","six","seven","eight","nine",
      "ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen",
      "twenty","twenty-one","twenty-two","twenty-three","twenty-four","twenty-five","twenty-six","twenty-seven","twenty-eight","twenty-nine",
      "thirty","thirty-one","thirty-two","thirty-three","thirty-four","thirty-five","thirty-six","thirty-seven","thirty-eight","thirty-nine",
      "forty","forty-one","forty-two","forty-three","forty-four","forty-five","forty-six","forty-seven","forty-eight","forty-nine"
    ];
    const arr=[];
    for(let i=1;i<=49;i++) arr.push({num:i,native:native[i]||String(i),sino:sino[i]||String(i),english:english[i]||String(i)});
    arr.push({num:50,native:"쉰",sino:"오십",english:"fifty"});
    return arr;
  })();

  const KB_BODYPARTS = [
   {k:"머리", e:"head"}, {k:"얼굴", e:"face"}, {k:"눈", e:"eye"}, {k:"코", e:"nose"}, {k:"입", e:"mouth"},
   {k:"귀", e:"ear"}, {k:"목", e:"neck"}, {k:"어깨", e:"shoulder"}, {k:"팔", e:"arm"}, {k:"팔꿈치", e:"elbow"},
   {k:"손", e:"hand"}, {k:"손가락", e:"finger"}, {k:"가슴", e:"chest"}, {k:"배", e:"stomach"}, {k:"허리", e:"waist"},
   {k:"등", e:"back"}, {k:"엉덩이", e:"hip"}, {k:"다리", e:"leg"}, {k:"무릎", e:"knee"}, {k:"발", e:"foot"},
   {k:"발가락", e:"toe"}, {k:"치아", e:"tooth"}, {k:"혀", e:"tongue"}, {k:"피부", e:"skin"}, {k:"손목", e:"wrist"},
   {k:"발목", e:"ankle"}, {k:"손톱", e:"fingernail"}, {k:"발톱", e:"toenail"}, {k:"눈썹", e:"eyebrow"}, {k:"속눈썹", e:"eyelash"},
   {k:"턱", e:"chin"}, {k:"입술", e:"lip"}, {k:"이마", e:"forehead"}, {k:"기관", e:"throat"}, {k:"혈관", e:"vein"},
   {k:"심장", e:"heart"}, {k:"폐", e:"lung"}, {k:"간", e:"liver"}, {k:"신장", e:"kidney"}, {k:"소장", e:"small intestine"},
   {k:"대장", e:"large intestine"}, {k:"뼈", e:"bone"}, {k:"근육", e:"muscle"}, {k:"혈액", e:"blood"}, {k:"땀샘", e:"sweat gland"},
   {k:"손바닥", e:"palm"}, {k:"등골", e:"spine"}
  ];

  const KB_TRAVEL = [
   {k:"영수증 주세요", e:"Please give me a receipt"},
   {k:"포장해 주세요", e:"Please make it takeaway"},
   {k:"이곳은 어디예요?", e:"Where is this place?"},
   {k:"병원이 어디에요?", e:"Where is the hospital?"},
   {k:"화장실 어디예요?", e:"Where is the restroom?"},
   {k:"이것 얼마예요?", e:"How much is this?"},
   {k:"카드 돼요?", e:"Do you accept card?"},
   {k:"현금만 돼요", e:"Cash only"},
   {k:"추천해 주세요", e:"Please recommend something"},
   {k:"메뉴 영어로 있어요?", e:"Is the menu in English?"},
   {k:"예약했어요", e:"I have a reservation"},
   {k:"택시 불러 주세요", e:"Please call a taxi"},
   {k:"공항까지 가주세요", e:"Please take me to the airport"},
   {k:"문 닫았어요?", e:"Is it closed?"},
   {k:"열려 있나요?", e:"Is it open?"},
   {k:"도와주세요", e:"Help me"},
   {k:"죄송합니다, 길을 잃었어요", e:"Sorry, I'm lost"},
   {k:"영어 할 수 있어요?", e:"Can you speak English?"},
   {k:"사진 찍어 주세요", e:"Please take a photo"},
   {k:"사진 찍어 드릴까요?", e:"Shall I take your photo?"},
   {k:"왼쪽이에요", e:"It's on the left"},
   {k:"오른쪽이에요", e:"It's on the right"},
   {k:"똑바로 가세요", e:"Go straight"},
   {k:"언제 출발하나요?", e:"When does it depart?"},
   {k:"몇 시에 도착하나요?", e:"What time does it arrive?"},
   {k:"표 한 장 주세요", e:"Please give me one ticket"},
   {k:"예약 확인해 주세요", e:"Please confirm the reservation"},
   {k:"짐 보관소 있나요?", e:"Is there a baggage storage?"},
   {k:"짐을 잃어버렸어요", e:"I lost my luggage"},
   {k:"무료 와이파이 있어요?", e:"Is there free Wi-Fi?"},
   {k:"와이파이 비밀번호가 뭐예요?", e:"What's the Wi-Fi password?"},
   {k:"물 한 잔 주세요", e:"Please give me a glass of water"},
   {k:"메뉴 추천해 주세요", e:"Please recommend a dish"},
   {k:"채식 메뉴 있어요?", e:"Do you have vegetarian options?"},
   {k:"계산서 부탁해요", e:"Could I have the bill?"}, 
   {k:"다음 정류장은 어디예요?", e:"What is the next stop?"}, 
   {k:"좌석 예약 되었나요?", e:"Is my seat reserved?"}, 
   {k:"창가 좌석 주세요", e:"Window seat please"}, 
   {k:"복도 좌석 주세요", e:"Aisle seat please"}, 
   {k:"무릎 공간이 넉넉한 좌석 주세요", e:"Seat with more legroom please"}, 
   {k:"안전벨트 착용하세요", e:"Please fasten your seatbelt"}, 
   {k:"짐을 위에 올려주세요", e:"Please put the luggage above"}, 
   {k:"도착 전에 알려 주세요", e:"Please notify me before arrival"}, 
   {k:"짐 무게가 얼마예요?", e:"How much does the luggage weigh?"}, 
   {k:"환전 어디서 하나요?", e:"Where can I exchange money?"}, 
   {k:"영수증을 분실했어요", e:"I lost the receipt"}
  ];

  const KB_DAILY = [
   {k:"안녕하세요", e:"Hello"}, {k:"좋은 아침이에요", e:"Good morning"}, {k:"잘 자요", e:"Good night"}, {k:"감사합니다", e:"Thank you"},
   {k:"천만에요", e:"You're welcome"}, {k:"죄송합니다", e:"Sorry"}, {k:"괜찮아요", e:"It's okay"}, {k:"사랑해요", e:"I love you"},
   {k:"배고파요", e:"I'm hungry"}, {k:"목말라요", e:"I'm thirsty"}, {k:"피곤해요", e:"I'm tired"}, {k:"화장실 가고 싶어요", e:"I need to go to the bathroom"},
   {k:"몇 시예요?", e:"What time is it?"}, {k:"도와주세요", e:"Help me"}, {k:"천천히 말해 주세요", e:"Please speak slowly"}, {k:"다시 말해 주세요", e:"Please say it again"},
   {k:"이해했어요", e:"I understand"}, {k:"이해하지 못했어요", e:"I don't understand"}, {k:"어디에요?", e:"Where is it?"}, {k:"얼마예요?", e:"How much is it?"},
   {k:"괜찮습니다", e:"No problem"}, {k:"축하합니다", e:"Congratulations"}, {k:"힘내세요", e:"Cheer up / Stay strong"}, {k:"조심하세요", e:"Be careful"},
   {k:"잘 했어요", e:"Well done"}, {k:"맛있어요", e:"It's delicious"}, {k:"배불러요", e:"I'm full"}, {k:"늦어서 죄송해요", e:"Sorry I'm late"},
   {k:"오늘 날씨 어때요?", e:"How's the weather today?"}, {k:"맛있게 드세요", e:"Enjoy your meal"}, {k:"생일 축하해요", e:"Happy Birthday"}, {k:"잘 다녀오세요", e:"Have a good trip"},
   {k:"조용히 해 주세요", e:"Please be quiet"}, {k:"문을 닫아 주세요", e:"Please close the door"}, {k:"문을 열어 주세요", e:"Please open the door"}, {k:"전화해 주세요", e:"Please call me"},
   {k:"기다려 주세요", e:"Please wait"}, {k:"바쁘세요?", e:"Are you busy?"}, {k:"천천히 드세요", e:"Eat slowly"}, {k:"사진 촬영 금지", e:"No photography"},
   {k:"금연", e:"No smoking"}, {k:"도착했습니다", e:"I have arrived"}, {k:"출발합니다", e:"We are departing"}, {k:"예약되어 있나요?", e:"Is it reserved?"},
   {k:"표를 보여 주세요", e:"Please show your ticket"}, {k:"다음에 봐요", e:"See you next time"}, {k:"잘 부탁드립니다", e:"Please take care of me"}, {k:"행복하세요", e:"Be happy"}
  ];

  // mapping
  const mapping = {
    hangul: { data: KB_HANGUL, type: 'hangul' },
    numbers: { data: KB_NUMBERS, type: 'numbers' },
    bodyparts: { data: KB_BODYPARTS, type: 'vocab' },
    travel: { data: KB_TRAVEL, type: 'vocab' },
    daily: { data: KB_DAILY, type: 'vocab' }
  };

  const cat = (qs('cat') || 'travel').toLowerCase();
  const mode = qs('mode') || null;
  const chosen = mapping[cat] || mapping['travel'];
  let pool = chosen.data.slice();

  // pool size logic
  if(mode === '20timed') pool = pool.slice(0,20);
  else if(mode === '40mixed') pool = pool.slice(0,40);
  else pool = pool.slice(0, Math.min(30, pool.length));

  function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]] } }
  shuffle(pool);

  // UI elements
  const meta = document.getElementById('meta');
  const qEl = document.getElementById('question');
  const optsEl = document.getElementById('options');
  const scoreEl = document.getElementById('score');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  let idx = 0, score = 0;
  meta.textContent = `Category: ${cat} · ${pool.length} questions`;

  function makeChoices(correct){
    const choices = [correct];
    const candidates = pool.filter(p=>p!==correct).slice();
    shuffle(candidates);
    while(choices.length<4 && candidates.length) choices.push(candidates.shift());
    // pad from other sets if needed
    const global = [].concat(KB_TRAVEL, KB_DAILY, KB_BODYPARTS, KB_NUMBERS, KB_HANGUL);
    let gi=0;
    while(choices.length<4 && gi<global.length){
      const c = global[gi++]; if(!choices.includes(c)) choices.push(c);
    }
    shuffle(choices);
    return choices;
  }

  function render(i){
    const item = pool[i];
    optsEl.innerHTML='';
    if(!item){ qEl.textContent='No question'; return; }

    if(chosen.type === 'hangul'){
      qEl.textContent = item.char;
      const choices = makeChoices(item);
      choices.forEach(c=>{
        const d = document.createElement('div'); d.className='choice'; d.textContent = c.rom;
        d.onclick = () => select(d, c.rom === item.rom);
        optsEl.appendChild(d);
      });
    } else if(chosen.type === 'numbers'){
      qEl.textContent = `${item.sino || item.native} — ${item.english || ''}`;
      const choices = makeChoices(item);
      choices.forEach(c=>{
        const d = document.createElement('div'); d.className='choice';
        d.textContent = (typeof c.num !== 'undefined') ? String(c.num) : (c.english || c.sino || c.native);
        d.onclick = () => select(d, c.num === item.num);
        optsEl.appendChild(d);
      });
    } else { // vocab
      qEl.textContent = item.k;
      const choices = makeChoices(item);
      choices.forEach(c=>{
        const d = document.createElement('div'); d.className='choice'; d.textContent = c.e;
        d.onclick = () => select(d, c.e === item.e);
        optsEl.appendChild(d);
      });
    }
    scoreEl.textContent = `Score: ${score}`;
  }

  function select(div, ok){
    const all = optsEl.querySelectorAll('.choice');
    all.forEach(x=>x.style.pointerEvents='none');
    if(ok){ div.classList.add('correct'); score++; }
    else { div.classList.add('wrong'); }
    scoreEl.textContent = `Score: ${score}`;
  }

  prevBtn.addEventListener('click', ()=>{ if(idx>0){ idx--; render(idx); } });
  nextBtn.addEventListener('click', ()=>{
    if(idx < pool.length-1){ idx++; render(idx); } else {
      // finished
      alert(`Quiz finished — Score ${score} / ${pool.length}`);
      location.href = 'index.html';
    }
  });

  render(0);
})();

