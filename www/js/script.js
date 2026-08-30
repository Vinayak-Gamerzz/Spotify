console.log("Lets listen to music");

let currentSong = new Audio();
let songs = [];
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

async function getSongs(folder) {
    currFolder = folder;

    try {
        let response = await fetch(`/${folder}/songs.json`);

        if (!response.ok) {
            throw new Error("songs.json nahi mila");
        }

        songs = await response.json();

        let songUL = document.querySelector(".songList ul");
        songUL.innerHTML = "";

        for (const song of songs) {
            songUL.innerHTML += `
                <li>
                    <img class="invert" width="34" src="img/music.svg" alt="">
                    <div class="info">
                        <div>${song.name}</div>
                        <div>Vinayak</div>
                    </div>
                    <div class="playnow">
                        <span>Play Now</span>
                        <img class="invert" src="img/play.svg" alt="">
                    </div>
                </li>
            `;
        }

        Array.from(songUL.getElementsByTagName("li")).forEach((e, index) => {
            e.addEventListener("click", () => {
                playMusic(songs[index]);
            });
        });

        return songs;

    } catch (error) {
        console.log("songs load nahi hue:", error);
        songs = [];
        return songs;
    }
}

const playMusic = (song, pause = false) => {
    currentSong.src = song.url;

    document.querySelector(".songinfo").innerHTML = song.name;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
    document.querySelector(".circle").style.left = "0%";

    if (!pause) {
        currentSong.play();
        document.querySelector("#play").src = "img/pause.svg";
    }
};

async function displayAlbums() {

    let cardContainer = document.querySelector(".cardContainer");

    cardContainer.innerHTML = "";

    let response = await fetch("/songs/");
    let text = await response.text();

    let div = document.createElement("div");
    div.innerHTML = text;

    let links = Array.from(div.getElementsByTagName("a"));

    for (let link of links) {

        let url = new URL(link.href);
        let parts = url.pathname.split("/").filter(Boolean);

        if (parts.length !== 2 || parts[0] !== "songs") {
            continue;
        }

        let folder = parts[1];

        try {

            let infoResponse = await fetch(`/songs/${folder}/info.json`);

            if (!infoResponse.ok) {
                console.log("info.json nahi mila:", folder);
                continue;
            }

            let info = await infoResponse.json();

            cardContainer.innerHTML += `
                <div class="card" data-folder="${folder}">

                    <div class="play">

                        <svg width="16" height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">

                            <path
                                d="M5 20V4L19 12L5 20Z"
                                stroke="#141B34"
                                fill="#000"
                                stroke-width="1.5"
                                stroke-linejoin="round"
                            />

                        </svg>

                    </div>

                    <img src="/songs/${folder}/cover.jpg" alt="">

                    <h2>${info.title}</h2>

                    <p>${info.description}</p>

                </div>
            `;

        } catch (error) {
            console.log("playlist load nahi hui:", folder, error);
        }
    }

    let cards = document.querySelectorAll(".card");

    cards.forEach(card => {

        card.addEventListener("click", async () => {

            let folder = card.dataset.folder;

            console.log("playlist open:", folder);

            songs = await getSongs(`songs/${folder}`);

            if (songs.length > 0) {
                playMusic(songs[0]);
            }
        });
    });

    let songUL = document.querySelector(".songList ul");

    songUL.innerHTML = "";

    cards.forEach(card => {

        let folder = card.dataset.folder;
        let title = card.querySelector("h2").innerText;
        let description = card.querySelector("p").innerText;

        songUL.innerHTML += `
            <li class="libraryPlaylist" data-folder="${folder}">
                <img class="invert" width="34" src="img/music.svg" alt="">

                <div class="info">
                    <div>${title}</div>
                    <div>${description}</div>
                </div>

                <div class="playnow">
                    <span>Open</span>
                    <img class="invert" src="img/play.svg" alt="">
                </div>
            </li>
        `;
    });

    Array.from(document.getElementsByClassName("libraryPlaylist")).forEach(playlist => {

        playlist.addEventListener("click", async () => {

            let folder = playlist.dataset.folder;

            console.log("Library se playlist open:", folder);

            songs = await getSongs(`songs/${folder}`);

            if (songs.length > 0) {
                playMusic(songs[0]);
            }
        });
    });
}

async function main() {

    await displayAlbums();

    let cards = document.querySelectorAll(".card");

    if (cards.length > 0) {
        let firstFolder = cards[0].dataset.folder;

        songs = await getSongs(`songs/${firstFolder}`);

        if (songs.length > 0) {
            playMusic(songs[0], true);
        }
    }

    document.querySelector("#play").addEventListener("click", () => {

        if (currentSong.paused) {
            currentSong.play();
            document.querySelector("#play").src = "img/pause.svg";
        } else {
            currentSong.pause();
            document.querySelector("#play").src = "img/play.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {

        if (!currentSong.duration) {
            return;
        }

        document.querySelector(".songtime").innerHTML =
            `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;

        document.querySelector(".circle").style.left =
            (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {

        if (!currentSong.duration) {
            return;
        }

        let rect = e.currentTarget.getBoundingClientRect();

        let percent =
            ((e.clientX - rect.left) / rect.width) * 100;

        document.querySelector(".circle").style.left =
            percent + "%";

        currentSong.currentTime =
            (currentSong.duration * percent) / 100;
    });

    document.querySelector("#previous").addEventListener("click", () => {

        let currentIndex = songs.findIndex(song => song.url === currentSong.src);

        if (currentIndex > 0) {
            playMusic(songs[currentIndex - 1]);
        }
    });

    document.querySelector("#next").addEventListener("click", () => {

        let currentIndex = songs.findIndex(song => song.url === currentSong.src);

        if (currentIndex + 1 < songs.length) {
            playMusic(songs[currentIndex + 1]);
        }
    });

    currentSong.addEventListener("ended", () => {
        document.querySelector("#next").click();
    });

    document.querySelector(".range input").addEventListener("input", e => {

        currentSong.volume = Number(e.target.value) / 100;

        if (currentSong.volume === 0) {
            document.querySelector(".volume img").src = "img/mute.svg";
        } else {
            document.querySelector(".volume img").src = "img/volume.svg";
        }
    });

    document.querySelector(".volume img").addEventListener("click", e => {

        if (currentSong.volume > 0) {

            currentSong.dataset.volume = currentSong.volume;
            currentSong.volume = 0;

            document.querySelector(".range input").value = 0;
            e.src = "img/mute.svg";

        } else {

            let volume = currentSong.dataset.volume || 0.1;

            currentSong.volume = volume;
            document.querySelector(".range input").value = volume * 100;

            e.src = "img/volume.svg";
        }
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });
}

main();