const createElement = (arr) => {
  const htmlElements = arr.map((el) => `<span class = "btn">${el}</span>`);
  return htmlElements.join("");
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const manageSpinner = (status) => {
  if (status === true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all") // promise of response
    .then((response) => response.json()) // promise of json
    .then((json) => displayLesson(json.data));
};

const removeActive = () => {
  const lessonBtn = document.querySelectorAll(".lesson-btn");
  // console.log(lessonBtn);
  lessonBtn.forEach((btn) => btn.classList.remove("active"));
};

const loadLevelWord = (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((json) => {
      removeActive(); // will remve all active class
      // id = level_no
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      clickBtn.classList.add("active");
      displayLevelWord(json.data);
    });
};

const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();

  displayWordDetails(details.data);
};
const displayWordDetails = (word) => {
  console.log(word);

  // id: 5;
  // level: 1;
  // meaning: "আগ্রহী";
  // partsOfSpeech: "adjective";
  // points: 1;
  // pronunciation: "ইগার";
  // sentence: "The kids were eager to open their gifts.";
  // synonyms: (3)[("enthusiastic", "excited", "keen")];
  // word: "Eager";

  const detailsBox = document.getElementById("details-container");
  detailsBox.innerHTML = `
      <div>
        <h2 class="text-2xl font-bold">${
          word.word
        } (<i class="fa-solid fa-microphone-lines"></i> : ${
    word.pronunciation
  })</h2>
      </div>
      <div>
        <h2 class="font-bold">Meaning</h2>
        <p>${word.meaning}</p>
      </div>
      <div>
        <h2 class="font-bold">Example</h2>
        <p>${word.sentence}</p>
      </div>
      <div class=" space-y-3">
        <h2 class="font-bold">Synonyms</h2>
      <div class=" space-x-3">${createElement(word.synonyms)}      </div>  
      </div>
  `;
  document.getElementById("word_modal").showModal();
};

const displayLevelWord = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  if (words.length === 0) {
    wordContainer.innerHTML = `
  <div class="font-bangla text-center col-span-full py-8 space-y-5">
        <img class="mx-auto" src="./assets/alert-error.png" alt="">
        <p  class="text-xl font-medium text-gray-400">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h2 class="text-4xl font-bold">নেক্সট Lesson এ যান</h2>
    </div>
        `;
    manageSpinner(false);
    return;
  }
  words.forEach((word) => {
    const card = document.createElement("div");
    card.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm text-center py-8 px-5 space-y-4">
            <h2 class="font-bold text-3xl">${
              word.word ? word.word : "Word Not found"
            }</h2>
            <p class="font-semibold">Meaning /Pronunciation</p>
            <div class="text-bangla text-2xl font-medium">"
            ${word.meaning ? word.meaning : "word not found"} /${
      word.pronunciation ? word.pronunciation : "word not found"
    }" 
            </div>
            <div class="flex justify-between items-center">
                <button onclick="loadWordDetail(${
                  word.id
                })" class="btn bg-sky-50 hover:bg-slate-300"><i class="fa-solid fa-circle-info"></i></button>
                <button onclick="pronounceWord('${word.word}')"  class="btn bg-sky-50 hover:bg-slate-300"><i class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>
        `;
    wordContainer.append(card);
  });
  manageSpinner(false);
};

const displayLesson = (lessons) => {
  // 1. get the container & make it empty
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";
  // 2. get into every lessons with a loop
  for (const lesson of lessons) {
    // 3. create element & add innerHTML
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
        <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn">
        <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
         </button>
        
        `;
    // 4. append into container
    levelContainer.append(btnDiv);
  }
};

loadLessons();

document.getElementById("btn-search").addEventListener("click", () => {
  removeActive();
  const input = document.getElementById("input-search");
  const searchValue = input.value.trim().toLowerCase();
  // console.log(searchValue);
  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      const filterWords = allWords.filter(word => word.word.toLowerCase().includes(searchValue))
      displayLevelWord(filterWords)      
    });
});
