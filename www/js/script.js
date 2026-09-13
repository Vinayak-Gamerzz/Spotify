import { getPlaylists } from "./cache.js";

let Capacitor = null;
let Filesystem = null;
let Directory = null;
let FileTransfer = null;
let isNative = false;

async function initCapacitor() {
    try {
        Capacitor = window.Capacitor;

        if (!Capacitor) {
            
            console.log("Running in browser");

            return;

        }

        isNative = Capacitor.isNativePlatform();

        if (!isNative) {

            console.log("Running in browser");

            return;

        }

        Filesystem = Capacitor.Plugins.Filesystem;

        FileTransfer = Capacitor.Plugins.FileTransfer;

        Directory = {

            Data: "DATA",

            Documents: "DOCUMENTS",

            Cache: "CACHE"

        };

        if (!Filesystem || !FileTransfer) {

            throw new Error("Capacitor plugins not available");

        }

        console.log("Capacitor initialized successfully");

    } catch (error) {

        console.error("Capacitor initialization failed:", error);

        isNative = false;

    }

}

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

function getSafeFileName(name) {
    return name
        .replace(/[<>:"/\\|?*]/g, "")
        .replace(/\s+/g, " ")
        .trim() + ".mp3";
}

async function isSongDownloaded(song) {

    if (!isNative) {
        return false;
    }

    try {
        const fileName = getSafeFileName(song.name);

        await Filesystem.stat({
            path: `songs/${fileName}`,
            directory: Directory.Data
        });

        return true;
    } catch {
        return false;
    }
}

async function downloadSong(song, button) {
    try {
        button.disabled = true;
        button.innerText = "⏳";

        if (await isSongDownloaded(song)) {
            button.innerText = "✓";
            button.disabled = false;
            return;
        }

        const fileName = getSafeFileName(song.name);

        console.log("Downloading:", song.name);

        const fileUri = await Filesystem.getUri({
            path: `songs/${fileName}`,
            directory: Directory.Data
        });

        await FileTransfer.downloadFile({
            url: song.url,
            path: fileUri.uri,
            progress: true
        });

        button.innerText = "✓";
        button.disabled = false;

        console.log("Downloaded:", song.name);
    } catch (error) {
        console.error("Download failed:", error);

        button.innerText = "⬇";
        button.disabled = false;

        alert("Download failed. Please try again.");
    }
}

async function getLocalSongUri(song) {

    if (!isNative) {
        return null;
    }

    try {
        const fileName = getSafeFileName(song.name);

        await Filesystem.stat({
            path: `songs/${fileName}`,
            directory: Directory.Data
        });

        const file = await Filesystem.getUri({
            path: `songs/${fileName}`,
            directory: Directory.Data
        });

        return Capacitor.convertFileSrc(file.uri);

    } catch {
        return null;
    }
}

async function getSongs(playlist) {

    try {

        currPlaylist = playlist;

        const SONG_CACHE_NAME = "spotify-songs-v1";

        const cache = await caches.open(SONG_CACHE_NAME);

        let response;

        
        if (navigator.onLine) {

            try {

                response = await fetch(playlist.songs);

                if (!response.ok) {
                    throw new Error("songs.json load nahi hua");
                }


                await cache.put(
                    playlist.songs,
                    response.clone()
                );

                console.log("Songs cached:", playlist.songs);

            } catch (error) {

                console.log(
                    "Online songs fetch failed, checking cache..."
                );

                response = await cache.match(playlist.songs);

            }

        } 
        

        else {

            console.log("Offline: loading songs from cache...");

            response = await cache.match(playlist.songs);

        }


        if (!response) {

            throw new Error(
                "Songs offline available nahi hain. Pehle online playlist open karo."
            );

        }


        songs = await response.json();

        if (navigator.onLine) {

            const audioCache = await caches.open("spotify-songs-v1");

            songs.forEach(async (song) => {

                if (!song.url) return;

                try {

                    const existing = await audioCache.match(song.url);

                    if (!existing) {

                        const audioResponse = await fetch(song.url);

                        if (audioResponse.ok) {

                            await audioCache.put(

                                song.url,

                                audioResponse.clone()

                            );

                            console.log(

                                "Audio cached:",

                                song.name

                            );

                        }

                    }

                } catch (error) {

                    console.log(
                        
                        "Audio cache failed:",

                        song.name

                    );

                }

            });

        }

        console.log("Songs loaded:", songs);


        let songUL = document.querySelector(".songList ul");

        songUL.innerHTML = "";


        for (let index = 0; index < songs.length; index++) {

            const song = songs[index];

            songUL.innerHTML += `
                <li>

                    <img
                        class="invert"
                        width="34"
                        src="img/music.svg"
                        alt=""
                    >

                    <div class="info">

                        <div>${song.name}</div>

                        <div>Vinayak</div>

                    </div>

                    <div class="playnow">

                        <span>Play Now</span>

                        <img
                            class="invert"
                            src="img/play.svg"
                            alt=""
                        >

                        <button
                            class="downloadSong"
                            data-song-index="${index}"
                            title="Download"
                        >
                            ⬇
                        </button>

                    </div>

                </li>
            `;

        }


        Array.from(
            songUL.getElementsByTagName("li")
        ).forEach((e, index) => {

            e.addEventListener("click", (event) => {

                if (
                    event.target.classList.contains("downloadSong")
                ) {
                    return;
                }

                playMusic(songs[index]);

            });

        });


        Array.from(
            songUL.querySelectorAll(".downloadSong")
        ).forEach(button => {

            const index = Number(
                button.dataset.songIndex
            );

            const song = songs[index];


            isSongDownloaded(song).then(downloaded => {

                if (downloaded) {

                    button.innerText = "✓";

                }

            });


            button.addEventListener(
                "click",
                async (event) => {

                    event.stopPropagation();

                    await downloadSong(
                        song,
                        button
                    );

                }
            );

        });


        return songs;


    } catch (error) {

        console.log(
            "Songs load nahi hue:",
            error
        );

        songs = [];

        return songs;

    }

}

const playMusic = async (song, pause = false) => {

    const localUri = await getLocalSongUri(song);

    if (localUri) {

        currentSong.src = localUri;

        console.log("Playing downloaded:", song.name);

    } else if (!navigator.onLine) {

        const cache = await caches.open("spotify-songs-v1");

        const cachedSong = await cache.match(song.url);

        if (cachedSong) {

            const blob = await cachedSong.blob();

            const localUrl = URL.createObjectURL(blob);

            currentSong.src = localUrl;

            console.log("Playing cached:", song.name);

        } else {

            console.log(

                "Song offline available nahi hai:",

                song.name

            );

            alert(

                `"${song.name}" offline available nahi hai.`

            );

            return;
        }

    } else {

        currentSong.src = song.url;

        console.log("Playing online:", song.name);

    }


    document.querySelector(".songinfo").innerHTML = song.name;

    document.querySelector(".songtime").innerHTML =

        "00:00 / 00:00";

    document.querySelector(".circle").style.left = "0%";


    if (!pause) {

        try {

            await currentSong.play();

            document.querySelector("#play").src =

                "img/pause.svg";

        } catch (error) {

            console.log("Playback failed:", error);

        }

    }

};

async function displayAlbums() {
    try {
        playlists = await getPlaylists();

        let cardContainer =
            document.querySelector(".cardContainer");

        cardContainer.innerHTML = "";

        for (let index = 0; index < playlists.length; index++) {
            const playlist = playlists[index];

            cardContainer.innerHTML += `
                <div class="card" data-index="${index}">
                    <div class="play">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
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

        let songUL =
            document.querySelector(".songList ul");

        songUL.innerHTML = "";

        playlists.forEach((playlist, index) => {
            songUL.innerHTML += `
                <li
                    class="libraryPlaylist"
                    data-index="${index}"
                >
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

    await initCapacitor();

    await displayAlbums();

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

    currentSong.addEventListener("timeupdate", () => {
        if (!currentSong.duration) {
            return;
        }

        document.querySelector(".songtime").innerHTML =
            `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;

        document.querySelector(".circle").style.left =
            (currentSong.currentTime /
                currentSong.duration) * 100 + "%";
    });

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

    document
        .querySelector("#previous")
        .addEventListener("click", () => {
            let index =
                songs.indexOf(
                    songs.find(
                        song =>
                            song.url === currentSong.src
                    )
                );

            if (index > 0) {
                playMusic(songs[index - 1]);
            }
        });

    document
        .querySelector("#next")
        .addEventListener("click", () => {
            let index =
                songs.indexOf(
                    songs.find(
                        song =>
                            song.url === currentSong.src
                    )
                );

            if (index + 1 < songs.length) {
                playMusic(songs[index + 1]);
            }
        });

    currentSong.addEventListener("ended", () => {
        document.querySelector("#next").click();
    });

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

    document
        .querySelector(".volume img")
        .addEventListener("click", e => {
            if (currentSong.volume > 0) {
                currentSong.dataset.volume =
                    currentSong.volume;

                currentSong.volume = 0;

                document.querySelector(
                    ".range input"
                ).value = 0;

                e.src = "img/mute.svg";
            } else {
                let volume =
                    currentSong.dataset.volume || 0.1;

                currentSong.volume = volume;

                document.querySelector(
                    ".range input"
                ).value = volume * 100;

                e.src = "img/volume.svg";
            }
        });

    document
        .querySelector(".hamburger")
        .addEventListener("click", () => {
            document.querySelector(".left").style.left = "0";
        });

    document
        .querySelector(".close")
        .addEventListener("click", () => {
            document.querySelector(".left").style.left = "-120%";
        });
}

const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("input", function () {

        const searchText = searchInput.value.toLowerCase().trim();

        const cards = document.querySelectorAll(".cardContainer .card");

        cards.forEach(card => {

            const title =
                card.querySelector("h2")?.innerText.toLowerCase() || "";

            const description =
                card.querySelector("p")?.innerText.toLowerCase() || "";

            if (
                title.includes(searchText) ||
                description.includes(searchText)
            ) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }

        });

    });

}

let favouriteSongs =
    JSON.parse(localStorage.getItem("favouriteSongs")) || [];

let favouriteBtn = document.getElementById

main();