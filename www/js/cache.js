const CACHE_NAME = "spotify-playlists-v2";
const SONG_CACHE_NAME = "spotify-songs-v1";

const PLAYLIST_URL =
    "https://raw.githubusercontent.com/Vinayak-Gamerzz/Spotify/main/playlists.json";


export async function getPlaylists() {

    const cache = await caches.open(CACHE_NAME);

    if (navigator.onLine) {

        try {

            const response = await fetch(PLAYLIST_URL);

            if (!response.ok) {

                throw new Error("Playlist fetch failed");

            }

            const playlists = await response.json();

            await cache.put(

                "playlists-data",

                new Response(JSON.stringify(playlists), {

                    headers: {

                        "Content-Type": "application/json"

                    }

                })

            );

            console.log("Playlists saved to local cache");

            return playlists;

        } catch (error) {

            console.log("Online playlist fetch failed");

        }
    }

    const cachedResponse = await cache.match("playlists-data");

    if (cachedResponse) {

        console.log("Loaded playlists from local cache");

        return await cachedResponse.json();

    }

    return [];
}


async function cacheSongs(playlist) {

    if (!navigator.onLine) {

        return;

    }

    try {

        const response = await fetch(playlist.songs);

        if (!response.ok) {

            throw new Error("songs.json load nahi hua");

        }

        const songs = await response.json();

        const cache = await caches.open(SONG_CACHE_NAME);

        for (const song of songs) {

            if (!song.url) continue;

            try {

                const alreadyCached = await cache.match(song.url);

                if (!alreadyCached) {

                    console.log("Caching:", song.name);

                    const songResponse = await fetch(song.url);

                    if (songResponse.ok) {

                        await cache.put(

                            song.url,

                            songResponse

                        );

                    }

                }

            } catch (error) {

                console.log(

                    "Song cache nahi hua:",

                    song.name,

                    error

                );

            }

        }

        console.log(

            "Playlist songs cached:",

            playlist.name

        );

    } catch (error) {

        console.log(

            "Songs cache failed:",

            error

        );

    }

}


async function getCachedSong(url) {

    const cache = await caches.open(SONG_CACHE_NAME);

    const response = await cache.match(url);

    if (response) {

        return await response.blob();

    }

    return null;

}