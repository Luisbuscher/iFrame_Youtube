const video = window.document.getElementById('video')
const pesquisar = window.document.getElementById('pesquisar')
const botoes = window.document.getElementById('botoes')
const tempo = window.document.getElementById('tempo')
const estatiscas = window.document.getElementById('stats')
const tabela = window.document.getElementById('tabela')
var tempo_video = []
var link_videos = []
var cod = ''
var player;

//1. Esse código/evento vai pegar somente o id do video e descartar o restante da URL.
pesquisar.addEventListener("click", () => {

    let link = window.document.getElementById('link').value
    let validar = false

    for (i = 0; i < link.length; i++){
        if (validar == true && link[i] != '&'){
            cod += link[i]
        }
        if (link[i] == '='){
            validar = true
        }else if(link[i] == '&'){
            validar = false
            break
        }
    }

    link_videos.push(link) //Usado para salvar o link do video em um array
    tempo_video.push('0')//Usado pra adicionar um tempo inicial pra esse video, assim na hora de atualizar ele atualiza diretamente esse tempo e não o do video anterior, caso haja algum.

    //0. Esse código carrega o IFrame Player API code assincronamente.
    //OBRIGATÓRIO!
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    //Gerar os botões (Uikit):
    botoes.innerHTML =  `<button class="uk-button uk-button-default uk-button-large" id="aumentar" onclick="pauseVideo()">Pausar video</button>
    <button class="uk-button uk-button-primary uk-button-large" id="diminuir" onclick="retomarVideo()">Retomar video</button>
    <button class="uk-button uk-button-secondary uk-button-large" id="full" onclick="mutarVideo()">Mutar video</button>
    <button class="uk-button uk-button-secondary uk-button-large" id="full" onclick="desmutarVideo()">Desmutar video</button>
    <button class="uk-button uk-button-secondary uk-button-large" id="full" onclick="tempoVideo()">Tempo de video</button>`

})

// 3. Essa função cria um <iframe> (e Youtube player)
//    Depois a API baixa o codigo.
// OBRIGATÓRIO!
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '360',
    width: '640',
    videoId: `${cod}`,
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// 4. API vai chamar a função quando o video estiver pronto.
//Essa função faz o video puxado iniciar diretamente.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. A API chama essa função quando o estado do player mudar.
//    função indica que ao reproduzir um vídeo (state=1)
//Não faz sentido, mas se tira essa porra da problema.
var done = false;
function onPlayerStateChange(event) {
    return;
}

//Função usada para contabilizar tempo de video:
var intervalId = window.setInterval(function(){
    if(YT.PlayerState.PLAYING){
        tempoVideo()
    }else{
        return;
    }
  }, 5000); //clearInterval(intervalId) - Para parar o loop

    // FUNÇÕES AUTODESCRITIVAS:

function pauseVideo() {
  player.pauseVideo();
}

function retomarVideo(){
    player.playVideo()
}

function mutarVideo(){
    player.mute()
}

function desmutarVideo(){
    player.unMute()
}

function tempoVideo(){
    let time = player.getCurrentTime()
    let timeFormat = ''
    let cont = 0
    time = String(time)

    try{
        for(i = 0; i <= 6; i++){
            timeFormat += time[i]
            if (time[i] == '.'){
                i = 4
            }
        }
        tempo.innerHTML = `<h2>O tempo de video atual é: ${timeFormat} segundos</h2>`
        tempo_video.pop()
        tempo_video.push(timeFormat)
    }catch{
        tempo.innerHTML = `<h2>Algo saiu errado</h2>`
    }
    return;

}


//Trabalhando nisso para aparecer uma tabela com as estatiscas do tempo que parou nos ultimos videos que assistiu, mas ignora isso, as vezes empolgo:
function estatisticas(){

    clearInterval(intervalId)

    tabela.innerHTML = `<tr class="titulos">
        <td>Link&nbsp;&nbsp;&nbsp;</td>
        <td>Tempo&nbsp;&nbsp;&nbsp;</td>
    </tr>`

    for (i = 0; i < link_videos.length; i++){
        tabela.innerHTML += `<tr>
        <td>${i} - ${link_videos[i]}&nbsp;&nbsp;</td>
        <td>${tempo_video[i]}&nbsp;&nbsp;</td>
    </tr>`
    }

    //Função usada para contabilizar tempo de video: To usando novamente porque interrompi ela, no inicio da função, pra função rodar sem erro
    var intervalId = window.setInterval(function(){
        if(YT.PlayerState.PLAYING){
            tempoVideo()
        }else{
            return;
        }
    }, 5000);

}