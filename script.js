const songul = document.querySelector(".library-songs").getElementsByTagName("ul")[0];
const ssong = document.querySelector(".ssong");
const play2 = document.getElementById("play2");
const timeInfo = document.querySelector(".timing");
const circle = document.getElementById("circle");
const line = document.getElementById("line");
const previous = document.getElementById("previous");
const next = document.getElementById("next");
const hamburger = document.getElementById("hamburger");
const left = document.getElementById("leftt");
const close = document.querySelector("#close");
const player = document.querySelector(".music-player");
const playbar = document.querySelector(".playbar");
const close2 = document.querySelector("#close2");
let Songs = [];

const currentsong = new Audio();
function playmusic(track) {
  currentsong.src = "/Songs/" + track + ".mp3";
  currentsong.play();
  player.style.animation = 'roll 3s linear infinite';
  ssong.innerHTML = track;
  play2.src = "icons/pause.svg";
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";
  seconds = Math.floor(seconds);
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}


fetch("/songs.json")
  .then(res => res.json())
  .then(data => {
    Songs = data.map(song => song.replace(".mp3", "")); 


    for (const song of Songs) {
      songul.innerHTML += `
        <li>
          <img src="icons/music.svg" alt="" class="invert">
          <div class="song">${song}</div>
          <img src="icons/play2.svg" alt="" class="invert playy">
        </li>`;
    }

    
    ssong.innerHTML = Songs[0];
    currentsong.src = "/Songs/" + Songs[0] + ".mp3";
  })
  .catch(err => console.log("Error loading songs:", err));


songul.addEventListener("click", (e) => {
  if (e.target.classList.contains("playy")) {
    let track = e.target.parentElement.querySelector(".song").innerHTML.trim();
    playmusic(track);
  }
});

play2.addEventListener("click", () => {


  if (!currentsong.src || ssong.innerHTML.trim() === "") {
    playmusic(Songs[0]);
    return;
  }

  if (currentsong.paused) {
    currentsong.play();
    player.style.animation = 'roll 3s linear infinite';
    play2.src = "icons/pause.svg";
  } else {
    currentsong.pause();
    play2.src = "icons/play2.svg";
    player.style.animation = 'none';
  }
});

currentsong.addEventListener("timeupdate", () => {
  timeInfo.innerHTML = `${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`;
  circle.style.left = `${(currentsong.currentTime / currentsong.duration) * 100}%`;
});

previous.addEventListener("click", () => {
  let currentName = ssong.innerHTML.trim();
  let index = Songs.indexOf(currentName);

  if (index > 0) playmusic(Songs[index - 1]);
});


next.addEventListener("click", () => {
  let currentName = ssong.innerHTML.trim();
  let index = Songs.indexOf(currentName);

  if (index < Songs.length - 1) playmusic(Songs[index + 1]);
});


hamburger.addEventListener("click", () => {
  left.style.left = "0%";
  left.style.backgroundColor = "black";
});

close.addEventListener("click", () => {
  left.style.left = "-110%";
});


player.addEventListener("click", () => {
  playbar.style.display = "block";
});

close2.addEventListener("click", () => {
  playbar.style.display = "none";
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 496) playbar.style.display = "block";
  else playbar.style.display = "none";
});


line.addEventListener('click', (e) => {
  let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
  circle.style.left = percent + '%';
  currentsong.currentTime = (currentsong.duration * percent) / 100;
});


