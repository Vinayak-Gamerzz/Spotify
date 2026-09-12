const CACHE_NAME = "spotify-playlists-v1";

const PLAYLIST_URL =
    "https://raw.githubusercontent.com/Vinayak-Gamerzz/Spotify/main/playlists.json";


async function getPlaylists() {


    if (navigator.onLine) {

        try {

            const response = await fetch(PLAYLIST_URL);

            if (!response.ok) {

                throw new Error("Playlist fetch failed");

            }

            const playlists = await response.json();

            const cache = await caches.open(CACHE_NAME);

            await cache.put(

                "playlists-data",

                new Response(JSON.stringify(playlists), {

                    headers: {

                        "Content-Type": "application/json"

                    }

                })

            );

            return playlists;


        } catch (error) {

            console.log("Online fetch failed, checking local cache...");

        }

    }

    const cache = await caches.open(CACHE_NAME);


    const cachedResponse = await cache.match("playlists-data");


    if (cachedResponse) {

        return await cachedResponse.json();

    }

    return [];
}

export { getPlaylists };