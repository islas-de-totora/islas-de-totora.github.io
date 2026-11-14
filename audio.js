let audioActivo = false, silenciado = false;
let musica, remo, sfxAbrir;

function fade(a, destino, ms = 2000){
    clearInterval(a._f);
    if(destino > 0) a.play().catch(() => {});
    const paso = (destino - a.volume) / (ms / 50);
    a._f = setInterval(() => {
        const v = a.volume + paso;
        if((paso >= 0 && v >= destino) || (paso < 0 && v <= destino)){
            a.volume = destino;
            clearInterval(a._f);
            if(destino === 0) a.pause();
        }else a.volume = Math.max(0, Math.min(1, v));
    }, 50);
}

function iniciarAudio(){
    if(audioActivo) return;
    audioActivo = true;

    musica = new Audio("audio/musica.mp3");
    musica.loop = true;
    musica.volume = 0;

    remo = new Audio("audio/remo.mp3");
    remo.loop = true;
    remo.volume = 0;

    sfxAbrir = new Audio("audio/abrir.mp3");
    sfxAbrir.volume = 0.5;

    fade(musica, 0.18);
    remo.play().catch(() => {});
}

function sonar(){
    if(!audioActivo || silenciado) return;
    sfxAbrir.currentTime = 0;
    sfxAbrir.play().catch(() => {});
}

function sonidoBarco(){
    if(!audioActivo) return;
    const v = (modoNavegar && tarjetaAbierta < 0) ? Math.min(1, Math.abs(velBarco) / 0.25) * 0.1 : 0;
    remo.volume += (v - remo.volume) * 0.1;
}

function alternarSonido(){
    silenciado = !silenciado;
    [musica, remo].forEach(a => { if(a) a.muted = silenciado; });
    document.getElementById("btnSonido").innerText = silenciado ? "🔇" : "🔊";
}

["pointerdown", "keydown"].forEach(ev => window.addEventListener(ev, iniciarAudio, { once: true }));