const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/esm-COlvBzwL.js","assets/rolldown-runtime-Czjbc987.js","assets/dist-DVHcxGh8.js","assets/plugin-Bt2CEIjo.js"])))=>i.map(i=>d[i]);
import{n as e,t}from"./rolldown-runtime-Czjbc987.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var n,r,i,a,o=e((()=>{n=`modulepreload`,r=function(e){return`/`+e},i={},a=function(e,t,a){let o=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),s=document.querySelector(`meta[property=csp-nonce]`),c=s?.nonce||s?.getAttribute(`nonce`);function l(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function u(e){return import.meta.resolve?import.meta.resolve(e):new URL(e,import.meta.url).href}o=l(t.map(t=>{if(t=r(t,a),t=u(t),t in i)return;i[t]=!0;let o=t.endsWith(`.css`);for(let n=e.length-1;n>=0;n--){let r=e[n];if(r.href===t&&(!o||r.rel===`stylesheet`))return}let s=document.createElement(`link`);if(s.rel=o?`stylesheet`:n,o||(s.as=`script`),s.crossOrigin=``,s.href=t,c&&s.setAttribute(`nonce`,c),document.head.appendChild(s),o)return new Promise((e,n)=>{s.addEventListener(`load`,e),s.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function s(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return o.then(t=>{for(let e of t||[])e.status===`rejected`&&s(e.reason);return e().catch(s)})}}));t((()=>{o();var e=null,t=null,n=null,r=null,i=!1;async function s(){if(window.Capacitor===void 0){console.log(`Running in browser`);return}try{if(e=window.Capacitor,i=e.isNativePlatform(),i){let e=await a(()=>import(`./esm-COlvBzwL.js`),__vite__mapDeps([0,1,2])),i=await a(()=>import(`./plugin-Bt2CEIjo.js`),__vite__mapDeps([3,1,2]));t=e.Filesystem,n=e.Directory,r=i.FileTransfer}}catch(e){console.error(`Capacitor initialization failed:`,e),i=!1}}console.log(`Lets listen to music`);var c=new Audio,l=[],u=[];function d(e){if(isNaN(e)||e<0)return`00:00`;let t=Math.floor(e/60),n=Math.floor(e%60);return`${String(t).padStart(2,`0`)}:${String(n).padStart(2,`0`)}`}function f(e){return e.replace(/[<>:"/\\|?*]/g,``).replace(/\s+/g,` `).trim()+`.mp3`}async function p(e){if(!i)return!1;try{let r=f(e.name);return await t.stat({path:`songs/${r}`,directory:n.Data}),!0}catch{return!1}}async function m(e,i){try{if(i.disabled=!0,i.innerText=`⏳`,await p(e)){i.innerText=`✓`,i.disabled=!1;return}let a=f(e.name);console.log(`Downloading:`,e.name);let o=await t.getUri({path:`songs/${a}`,directory:n.Data});await r.downloadFile({url:e.url,path:o.uri,progress:!0}),i.innerText=`✓`,i.disabled=!1,console.log(`Downloaded:`,e.name)}catch(e){console.error(`Download failed:`,e),i.innerText=`⬇`,i.disabled=!1,alert(`Download failed. Please try again.`)}}async function h(r){if(!i)return null;try{let i=f(r.name);await t.stat({path:`songs/${i}`,directory:n.Data});let a=await t.getUri({path:`songs/${i}`,directory:n.Data});return e.convertFileSrc(a.uri)}catch{return null}}async function g(e){try{let t=await fetch(e.songs);if(!t.ok)throw Error(`songs.json load nahi hua`);l=await t.json();let n=document.querySelector(`.songList ul`);n.innerHTML=``;for(let e=0;e<l.length;e++){let t=l[e];n.innerHTML+=`
                <li>
                    <img class="invert" width="34" src="img/music.svg" alt="">

                    <div class="info">
                        <div>${t.name}</div>
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
                            data-song-index="${e}"
                            title="Download"
                        >
                            ⬇
                        </button>
                    </div>
                </li>
            `}return Array.from(n.getElementsByTagName(`li`)).forEach((e,t)=>{e.addEventListener(`click`,e=>{e.target.classList.contains(`downloadSong`)||_(l[t])})}),Array.from(n.querySelectorAll(`.downloadSong`)).forEach(e=>{let t=Number(e.dataset.songIndex),n=l[t];p(n).then(t=>{t&&(e.innerText=`✓`)}),e.addEventListener(`click`,async t=>{t.stopPropagation(),await m(n,e)})}),l}catch(e){return console.log(`Songs load nahi hue:`,e),l=[],l}}var _=async(e,t=!1)=>{let n=await h(e);n?(c.src=n,console.log(`Playing downloaded:`,e.name)):(c.src=e.url,console.log(`Playing online:`,e.name)),document.querySelector(`.songinfo`).innerHTML=e.name,document.querySelector(`.songtime`).innerHTML=`00:00 / 00:00`,document.querySelector(`.circle`).style.left=`0%`,t||(c.play(),document.querySelector(`#play`).src=`img/pause.svg`)};async function v(){try{let e=await fetch(`https://raw.githubusercontent.com/Vinayak-Gamerzz/Spotify/main/playlists.json`);if(!e.ok)throw Error(`playlists.json load nahi hua`);u=await e.json();let t=document.querySelector(`.cardContainer`);t.innerHTML=``;for(let e=0;e<u.length;e++){let n=u[e];t.innerHTML+=`
                <div class="card" data-index="${e}">
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

                    <img src="${n.cover}" alt="">

                    <h2>${n.title}</h2>

                    <p>${n.description}</p>
                </div>
            `}document.querySelectorAll(`.card`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=u[Number(e.dataset.index)];console.log(`Playlist open:`,t.title),l=await g(t),l.length>0&&_(l[0])})});let n=document.querySelector(`.songList ul`);n.innerHTML=``,u.forEach((e,t)=>{n.innerHTML+=`
                <li
                    class="libraryPlaylist"
                    data-index="${t}"
                >
                    <img
                        class="invert"
                        width="34"
                        src="img/music.svg"
                        alt=""
                    >

                    <div class="info">
                        <div>${e.title}</div>
                        <div>${e.description}</div>
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
            `}),document.querySelectorAll(`.libraryPlaylist`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=u[Number(e.dataset.index)];console.log(`Library se playlist open:`,t.title),l=await g(t),l.length>0&&_(l[0])})})}catch(e){console.log(`Playlists load nahi hui:`,e)}}async function y(){await s(),await v(),document.querySelector(`#play`).addEventListener(`click`,()=>{c.paused?(c.play(),document.querySelector(`#play`).src=`img/pause.svg`):(c.pause(),document.querySelector(`#play`).src=`img/play.svg`)}),c.addEventListener(`timeupdate`,()=>{c.duration&&(document.querySelector(`.songtime`).innerHTML=`${d(c.currentTime)} / ${d(c.duration)}`,document.querySelector(`.circle`).style.left=c.currentTime/c.duration*100+`%`)}),document.querySelector(`.seekbar`).addEventListener(`click`,e=>{if(!c.duration)return;let t=e.currentTarget.getBoundingClientRect(),n=(e.clientX-t.left)/t.width*100;document.querySelector(`.circle`).style.left=n+`%`,c.currentTime=c.duration*n/100}),document.querySelector(`#previous`).addEventListener(`click`,()=>{let e=l.indexOf(l.find(e=>e.url===c.src));e>0&&_(l[e-1])}),document.querySelector(`#next`).addEventListener(`click`,()=>{let e=l.indexOf(l.find(e=>e.url===c.src));e+1<l.length&&_(l[e+1])}),c.addEventListener(`ended`,()=>{document.querySelector(`#next`).click()}),document.querySelector(`.range input`).addEventListener(`input`,e=>{c.volume=Number(e.target.value)/100,c.volume===0?document.querySelector(`.volume img`).src=`img/mute.svg`:document.querySelector(`.volume img`).src=`img/volume.svg`}),document.querySelector(`.volume img`).addEventListener(`click`,e=>{if(c.volume>0)c.dataset.volume=c.volume,c.volume=0,document.querySelector(`.range input`).value=0,e.src=`img/mute.svg`;else{let t=c.dataset.volume||.1;c.volume=t,document.querySelector(`.range input`).value=t*100,e.src=`img/volume.svg`}}),document.querySelector(`.hamburger`).addEventListener(`click`,()=>{document.querySelector(`.left`).style.left=`0`}),document.querySelector(`.close`).addEventListener(`click`,()=>{document.querySelector(`.left`).style.left=`-120%`})}y()}))();export{o as n,a as t};