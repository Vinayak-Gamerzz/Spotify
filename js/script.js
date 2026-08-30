console.log("Lets listen to music");

let currentSong = new Audio();
let songs = [];
let currPlaylist = null;
let playlists = [];

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}


// Load songs from online songs.json
async function getSongs(playlist) {

    try {

        currPlaylist = playlist;

        let response = await fetch(playlist.songs);

        if (!response.ok) {
            throw new Error("songs.json load nahi hua");
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

        console.log("Songs load nahi hue:", error);

        songs = [];

        return songs;
    }
}


// Play song
const playMusic = (song, pause = false) => {

    currentSong.src = song.url;

    document.querySelector(".songinfo").innerHTML = song.name;

    document.querySelector(".songtime").innerHTML =
        "00:00 / 00:00";

    document.querySelector(".circle").style.left = "0%";

    if (!pause) {

        currentSong.play();

        document.querySelector("#play").src =
            "img/pause.svg";
    }
};


// Load playlists from online playlists.json
async function displayAlbums() {

    try {

        let response = await fetch(
            "https://raw.githubusercontent.com/Vinayak-Gamerzz/Spotify/main/playlists.json"
        );

        if (!response.ok) {
            throw new Error("playlists.json load nahi hua");
        }

        playlists = await response.json();

        let cardContainer =
            document.querySelector(".cardContainer");

        cardContainer.innerHTML = "";


        // Spotify Playlist Cards

        for (const playlist of playlists) {

            cardContainer.innerHTML += `

                <div class="card" data-index="${playlists.indexOf(playlist)}">

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

                    <img src="${playlist.cover}" alt="">

                    <h2>${playlist.title}</h2>

                    <p>${playlist.description}</p>

                </div>
            `;
        }


        // Card click

        document.querySelectorAll(".card").forEach(card => {

            card.addEventListener("click", async () => {

                let playlist =
                    playlists[Number(card.dataset.index)];

                console.log(
                    "Playlist open:",
                    playlist.title
                );

                songs = await getSongs(playlist);

                if (songs.length > 0) {
                    playMusic(songs[0]);
                }

            });

        });


        // Library

        let songUL =
            document.querySelector(".songList ul");

        songUL.innerHTML = "";


        playlists.forEach((playlist, index) => {

            songUL.innerHTML += `

                <li class="libraryPlaylist"
                    data-index="${index}">

                    <img
                        class="invert"
                        width="34"
                        src="img/music.svg"
                        alt=""
                    >

                    <div class="info">

                        <div>${playlist.title}</div>

                        <div>${playlist.description}</div>

                    </div>

                    <div class="playnow">

                        <span>Open</span>

                        <img
                            class="invert"
                            src="img/play.svg"
                            alt=""
                        >

                    </div>

                </li>
            `;
        });


        // Library playlist click

        document
            .querySelectorAll(".libraryPlaylist")
            .forEach(playlistElement => {

                playlistElement.addEventListener(
                    "click",
                    async () => {

                        let playlist =
                            playlists[
                                Number(
                                    playlistElement.dataset.index
                                )
                            ];

                        console.log(
                            "Library se playlist open:",
                            playlist.title
                        );

                        songs = await getSongs(playlist);

                        if (songs.length > 0) {
                            playMusic(songs[0]);
                        }

                    }
                );

            });

    } catch (error) {

        console.log(
            "Playlists load nahi hui:",
            error
        );
    }
}


async function main() {

    // Load playlists first
    await displayAlbums();


    // Play button

    document
        .querySelector("#play")
        .addEventListener("click", () => {

            if (currentSong.paused) {

                currentSong.play();

                document.querySelector("#play").src =
                    "img/pause.svg";

            } else {

                currentSong.pause();

                document.querySelector("#play").src =
                    "img/play.svg";
            }

        });


    // Time update

    currentSong.addEventListener("timeupdate", () => {

        if (!currentSong.duration) {
            return;
        }

        document.querySelector(".songtime").innerHTML =
            `${secondsToMinutesSeconds(currentSong.currentTime)}
             / ${secondsToMinutesSeconds(currentSong.duration)}`;

        document.querySelector(".circle").style.left =
            (currentSong.currentTime /
                currentSong.duration) * 100 + "%";
    });


    // Seekbar

    document
        .querySelector(".seekbar")
        .addEventListener("click", e => {

            if (!currentSong.duration) {
                return;
            }

            let rect =
                e.currentTarget.getBoundingClientRect();

            let percent =
                ((e.clientX - rect.left) /
                    rect.width) * 100;

            document.querySelector(".circle").style.left =
                percent + "%";

            currentSong.currentTime =
                (currentSong.duration * percent) / 100;
        });


    // Previous

    document
        .querySelector("#previous")
        .addEventListener("click", () => {

            let index =
                songs.indexOf(
                    songs.find(song =>
                        song.url === currentSong.src
                    )
                );

            if (index > 0) {
                playMusic(songs[index - 1]);
            }
        });


    // Next

    document
        .querySelector("#next")
        .addEventListener("click", () => {

            let index =
                songs.indexOf(
                    songs.find(song =>
                        song.url === currentSong.src
                    )
                );

            if (index + 1 < songs.length) {
                playMusic(songs[index + 1]);
            }
        });


    // Auto next

    currentSong.addEventListener("ended", () => {

        document.querySelector("#next").click();

    });


    // Volume slider

    document
        .querySelector(".range input")
        .addEventListener("input", e => {

            currentSong.volume =
                Number(e.target.value) / 100;

            if (currentSong.volume === 0) {

                document.querySelector(".volume img").src =
                    "img/mute.svg";

            } else {

                document.querySelector(".volume img").src =
                    "img/volume.svg";
            }
        });


    // Mute button

    document
        .querySelector(".volume img")
        .addEventListener("click", e => {

            if (currentSong.volume > 0) {

                currentSong.dataset.volume =
                    currentSong.volume;

                currentSong.volume = 0;

                document
                    .querySelector(".range input")
                    .value = 0;

                e.src = "img/mute.svg";

            } else {

                let volume =
                    currentSong.dataset.volume || 0.1;

                currentSong.volume = volume;

                document
                    .querySelector(".range input")
                    .value =
                    volume * 100;

                e.src = "img/volume.svg";
            }
        });


    // Mobile menu

    document
        .querySelector(".hamburger")
        .addEventListener("click", () => {

            document.querySelector(".left")
                .style.left = "0";
        });


    document
        .querySelector(".close")
        .addEventListener("click", () => {

            document.querySelector(".left")
                .style.left = "-120%";
        });

}

main();