const CACHE_NAME = "spotify-playlists-v2";

const PLAYLIST_URL =
    "https://raw.githubusercontent.com/Vinayak-Gamerzz/Spotify/main/playlists.json";

async function getPlaylists() {

    const cache = await caches.open(CACHE_NAME);

    // ONLINE
    if (navigator.onLine) {

        try {

            const response = await fetch(PLAYLIST_URL, {
                
                cache: "no-store"

            });

            if (!response.ok) {

                throw new Error("Playlist fetch failed");

            }

            const playlists = await response.json();

            // Save playlist JSON locally
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

            console.log(

                "Online fetch failed, using cached playlists..."

            );

        }
    }

    try {

        const cachedResponse = await cache.match("playlists-data");

        if (cachedResponse) {

            const playlists = await cachedResponse.json();

            console.log("Loaded playlists from local cache");

            return playlists;
        }

    } catch (error) {

        console.log("Cache read failed:", error);

    }

    return [];

}