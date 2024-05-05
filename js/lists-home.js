// Inicializar o Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCkNPnRVpxAvMBBoqWUlTA5aIofG2HWvss",
    authDomain: "animaalley-tv.firebaseapp.com",
    databaseURL: "https://animaalley-tv-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "animaalley-tv",
    storageBucket: "animaalley-tv.appspot.com",
    messagingSenderId: "441876450757",
    appId: "1:441876450757:web:23f14baf5c10ecc46acfac",
    measurementId: "G-BCH5BV87FN"
};

firebase.initializeApp(firebaseConfig);

// Verificar se o usuário está autenticado
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        console.log("Usuário autenticado:", user);
        const userRef = firebase.database().ref(`accounts/${user.uid}`);
        
        // Obter os dados do usuário no banco de dados em tempo real
        userRef.on('value', (snapshot) => {
            const userData = snapshot.val();

            if (userData) {
                // Preencher a foto de perfil com a foto do usuário, se disponível
                const profilePicElement = document.getElementById('userImage');
                profilePicElement.src = userData.photo || 'images/user-icon.jpg'; // Define o src da imagem

                // Preencher a foto de perfil com a foto do usuário, se disponível
                const profilePicDrawerElement = document.getElementById('userImageDrawer');
                profilePicDrawerElement.src = userData.photo || 'images/user-icon.jpg'; // Define o src da imagem

                // Preencher o nome do usuário no perfil
                const userNameElement = document.querySelector('.user-name');
                userNameElement.textContent = userData.username || 'Nome do Usuário'; // Define o nome do usuário

                // Verificar o status do usuário
                const userStatus = userData.status;
                const statusDialog = document.getElementById('statusDialog');

                if (userStatus === 'online') {
                    statusDialog.style.display = 'none'; // Ocultar o diálogo de status se o usuário estiver online
                } else if (userStatus === 'offline') {
                    statusDialog.style.display = 'flex'; // Exibir o diálogo de status se o usuário estiver offline
                }
            }
        });
    } else {
        console.log("Usuário não autenticado. Redirecionando para a página de login...");
        window.location.href = 'sign.html';
    }
});


// Referências ao banco de dados do Firebase
const database = firebase.database();
const itensRef = database.ref('popular/popular/list');
const itensRef2 = database.ref('top10/top10/list');
const itensRef3 = database.ref('tendence/tendence/list');
var sliderRef = database.ref('slider/slider/list');
var mylistRef = database.ref('users/user1/mylist');
var dbRef = firebase.database().ref("episodes");
const animsRef = database.ref('covers');

// Função para preencher a lista com os dados do banco de dados em tempo real
function preencherLista(snapshot, listaId) {
    const lista = document.getElementById(listaId);
    lista.innerHTML = ''; // Limpa a lista antes de preenchê-la novamente

    if (!snapshot.exists()) {
        console.log('Dados não encontrados.');
        return;
    }

    const listaString = snapshot.val(); // Obtém a string JSON da lista diretamente
    try {
        const listaObjeto = JSON.parse(listaString); // Converte a string JSON para um objeto JavaScript
        listaObjeto.forEach((item) => {
            const li = document.createElement('li');
            li.innerHTML = `<img src="${item.poster}" alt="${item.name}"><br><span>${item.name}</span>`;
            li.addEventListener('click', () => {
                window.location.href = `details.html?id=${item.id}`;
            });

            lista.appendChild(li);
        });
    } catch (error) {
        console.error('Erro ao parsear JSON:', error);
    }
}





// Função para converter a string de data para um objeto Date
function convertStringToDate(dateString) {
    var parts = dateString.split(" ");
    if (parts.length === 2) {
        var dateParts = parts[0].split("/");
        var timeParts = parts[1].split(":");
        return new Date("20" + dateParts[2], dateParts[1] - 1, dateParts[0], timeParts[0], timeParts[1], timeParts[2]);
    } else {
        return null; // Retorna null se a string de data estiver em um formato inválido
    }
}

function preencherListaAnims(snapshot, listaId) {
    const lista = document.getElementById(listaId);
    lista.innerHTML = ''; // Limpa a lista antes de preenchê-la novamente

    if (!snapshot.exists()) {
        console.log('Dados não encontrados.');
        return;
    }

    const animsArray = []; // Array para armazenar os itens
    snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.val();
        if (item.post && item.cover && item.name && item.id) {
            animsArray.push(item);
        } else {
            console.log('Item incompleto:', item);
        }
    });

    // Ordena os itens pela data mais recente
    animsArray.sort((a, b) => {
        const dateA = convertStringToDate(a.post);
        const dateB = convertStringToDate(b.post);
        if (dateA && dateB) {
            return dateB.getTime() - dateA.getTime();
        } else {
            return 0; // Mantém a ordem atual se as datas forem inválidas
        }
    });

    // Limita a lista a 15 itens ou ao tamanho total, o que for menor
    const limit = Math.min(animsArray.length, 15);
    for (let i = 0; i < limit; i++) {
        const item = animsArray[i];
        const li = document.createElement('li');
        li.innerHTML = `<img src="${item.cover}" alt="${item.name}"><br><span>${item.name}</span>`;
        li.addEventListener('click', () => {
            window.location.href = `details.html?id=${item.id}`;
        });

        lista.appendChild(li);
    }
}

// Uso da função com a referência 'anims/covers'
animsRef.on('value', (snapshot) => {
    preencherListaAnims(snapshot, 'lista-itens-4');
});



// Escutar por mudanças no banco de dados e chamar a função de preenchimento da lista
itensRef.on('value', (snapshot) => {
    preencherLista(snapshot, 'lista-itens');
});

itensRef2.on('value', (snapshot) => {
    preencherLista(snapshot, 'lista-itens-2');
});

itensRef3.on('value', (snapshot) => {
    preencherLista(snapshot, 'lista-itens-3');
});

// Botão de próximo para a primeira lista
document.getElementById('nextButton1').addEventListener('click', () => {
    const lista = document.getElementById('lista-itens');
    lista.scrollBy({
        left: lista.offsetWidth + 15, // 20 é a margem direita do li
        behavior: 'smooth'
    });
});

// Botão de anterior para a primeira lista
document.getElementById('prevButton1').addEventListener('click', () => {
    const lista = document.getElementById('lista-itens');
    lista.scrollBy({
        left: -(lista.offsetWidth + 15), // 20 é a margem direita do li
        behavior: 'smooth'
    });
});

// Botão de próximo para a segunda lista
document.getElementById('nextButton2').addEventListener('click', () => {
    const lista = document.getElementById('lista-itens-2');
    lista.scrollBy({
        left: lista.offsetWidth + 15, // 20 é a margem direita do li
        behavior: 'smooth'
    });
});

// Botão de anterior para a segunda lista
document.getElementById('prevButton2').addEventListener('click', () => {
    const lista = document.getElementById('lista-itens-2');
    lista.scrollBy({
        left: -(lista.offsetWidth + 15), // 20 é a margem direita do li
        behavior: 'smooth'
    });
});

// Botão de próximo para a segunda lista 3
document.getElementById('nextButton3').addEventListener('click', () => {
    const lista = document.getElementById('lista-itens-3');
    lista.scrollBy({
        left: lista.offsetWidth + 15, // 20 é a margem direita do li
        behavior: 'smooth'
    });
});

// Botão de anterior para a segunda lista
document.getElementById('prevButton3').addEventListener('click', () => {
    const lista = document.getElementById('lista-itens-3');
    lista.scrollBy({
        left: -(lista.offsetWidth + 15), // 20 é a margem direita do li
        behavior: 'smooth'
    });
});


// Botão de próximo para a segunda lista 3
document.getElementById('nextButton4').addEventListener('click', () => {
    const lista = document.getElementById('lista-itens-4');
    lista.scrollBy({
        left: lista.offsetWidth + 15, // 20 é a margem direita do li
        behavior: 'smooth'
    });
});

// Botão de anterior para a segunda lista
document.getElementById('prevButton4').addEventListener('click', () => {
    const lista = document.getElementById('lista-itens-4');
    lista.scrollBy({
        left: -(lista.offsetWidth + 15), // 20 é a margem direita do li
        behavior: 'smooth'
    });
});


// JavaScript para controlar a abertura e fechamento do drawer
const drawerOpener = document.getElementById('drawerOpener');
const myDrawer = document.getElementById('myDrawer');

drawerOpener.addEventListener('click', () => {
    myDrawer.classList.toggle('open');
});

// Função para o botão de sair
function logout() {
    // Lógica para fazer logout aqui
    alert('Você saiu!');
}

// Função para atualizar o slide com base na largura da tela
function atualizarSlide(listaObjeto) {
    const sliderWrapper = document.getElementById('slider-wrapper');
    let slideHTML = '';

    listaObjeto.forEach(function(slide) {
        const screenSize = window.innerWidth;
        let posterKey = 'poster'; // Chave padrão

        // Verifica se a tela é menor ou igual a 370 pixels de largura
        if (screenSize <= 350) {
            posterKey = 'poster_mobile'; // Chave para a versão mobile da imagem de capa
        }

        slideHTML += '<div class="swiper-slide">';
        slideHTML += '<img class="slide-background" src="' + slide[posterKey] + '" alt="' + slide.name + '">';
        slideHTML += '<div class="shadow-overlay"></div>';
        slideHTML += '<div class="slide-content">';
        slideHTML += '<div class="slide-info">';
        slideHTML += '<h3>' + slide.name + '</h3>';
        slideHTML += '<p>' + slide.sinopse + '</p>';
        slideHTML += '<p>Genres: ' + slide.genres + '</p>';
        slideHTML += '</div>';
        slideHTML += '<div class="watch-button-container">';
        slideHTML += '<div class="watch-button-slider">Assistir</div>';
        slideHTML += '<div class="icon-container-slider" data-id="' + slide.id + '">';
        slideHTML += '<svg class="icon bookmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">';
        slideHTML += '<path d="M0 0h24v24H0z" fill="none"/>';
        slideHTML += '<path d="M19 12l-7 5v-3H4V8h8V5z"/>';
        slideHTML += '</svg>';
        slideHTML += '</div>';
        slideHTML += '</div>';
        slideHTML += '</div>';
        slideHTML += '</div>';
    });

    sliderWrapper.innerHTML = slideHTML;
}

// Obtém os dados do Firebase e insere no carousel
sliderRef.on('value', function(snapshot) {
    const listaString = snapshot.val();
    try {
        const listaObjeto = JSON.parse(listaString);
        atualizarSlide(listaObjeto);

        var mySwiper = new Swiper('.swiper-container', {
            loop: false,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            slidesPerView: 'auto',
        });

        mySwiper.on('slideChange', function() {
            const nextButton = document.querySelector('.swiper-button-next');
            const prevButton = document.querySelector('.swiper-button-prev');
            if (mySwiper.isEnd) {
                nextButton.style.opacity = '0';
            } else {
                nextButton.style.opacity = '0.5';
            }
            if (mySwiper.isBeginning) {
                prevButton.style.opacity = '0';
            } else {
                prevButton.style.opacity = '0.5';
            }
        });

        document.querySelectorAll('.watch-button').forEach(function(button) {
            button.addEventListener('click', function() {
                const id = button.nextElementSibling.dataset.id;
                window.location.href = `details.html?id=${id}`;
            });
        });

        // Verifica se o anime está na lista de favoritos do usuário e exibe o ícone de bookmark preenchido se estiver
        mylistRef.once('value', function(snapshot) {
            const mylist = snapshot.val();
            document.querySelectorAll('.icon-container-slider').forEach(function(icon) {
                if (mylist && mylist[icon.dataset.id]) {
                    icon.querySelector('.bookmark').classList.add('bookmarked');
                }
            });
        });

        // Adiciona um evento de clique ao ícone do bookmark para adicionar/remover da lista de favoritos
        document.querySelectorAll('.icon-container-slider').forEach(function(icon) {
            icon.addEventListener('click', function() {
                const id = icon.dataset.id;
                mylistRef.child(id + firebase.auth().currentUser.uid).once('value', function(snapshot) {
                    if (snapshot.exists()) {
                        // Anime já está na lista de favoritos, então remova
                        mylistRef.child(id + firebase.auth().currentUser.uid).remove();
                        icon.querySelector('.bookmark').classList.remove('bookmarked');
                    } else {
                        // Adicione o anime à lista de favoritos
                        mylistRef.child(id + firebase.auth().currentUser.uid).set(true);
                        icon.querySelector('.bookmark').classList.add('bookmarked');
                    }
                });
            });
        });

        // Função para clicar no botão "Assistir" e redirecionar para a página de detalhes do anime
        document.querySelectorAll('.watch-button-slider').forEach(function(button) {
            button.addEventListener('click', function() {
                const id = button.nextElementSibling.dataset.id;
                window.location.href = `details.html?id=${id}`;
            });
        });

    } catch (error) {
        console.error('Erro ao parsear JSON:', error);
    }
});

// Adiciona um listener para o evento de redimensionamento da janela
window.addEventListener('resize', function() {
    // Obtém novamente os dados do Firebase e atualiza o slide
    sliderRef.once('value', function(snapshot) {
        const listaString = snapshot.val();
        try {
            const listaObjeto = JSON.parse(listaString);
            atualizarSlide(listaObjeto);
        } catch (error) {
            console.error('Erro ao parsear JSON:', error);
        }
    });
});

 // Função para converter a string de data para um objeto Date
 function parseDate(dateString) {
    var parts = dateString.split(" ");
    if (parts.length === 2) {
      var dateParts = parts[0].split("/");
      var timeParts = parts[1].split(":");
      return new Date("20" + dateParts[2], dateParts[1] - 1, dateParts[0], timeParts[0], timeParts[1], timeParts[2]);
    } else {
      return null; // Retorna null se a string de data estiver em um formato inválido
    }
  }

  // Função para carregar e exibir os episódios com limite de 12 itens
  function carregarEpisodios() {
    dbRef.once("value", function(snapshot) {
      document.getElementById("grid").innerHTML = "";

      var episodes = [];
      snapshot.forEach(function(childSnapshot) {
        var episode = childSnapshot.val();
        if (episode.post) { // Verifica se a chave 'post' existe no episódio
          episodes.push(episode);
        }
      });

      // Ordena os episódios pela data mais recente
      episodes.sort((a, b) => {
        var dateA = parseDate(a.post);
        var dateB = parseDate(b.post);
        if (dateA && dateB) {
          return dateB - dateA;
        } else {
          return 0; // Retorna 0 se as datas forem inválidas
        }
      });

      // Limita a exibição a 12 itens
      var limitedEpisodes = episodes.slice(0, 10);

      limitedEpisodes.forEach(function(episode) {
        var gridItem = document.createElement("div");
        gridItem.classList.add("grid-item");

        var posterImg = document.createElement("img");
        posterImg.src = episode.banner; // Usando a chave "banner" para definir a imagem
        posterImg.alt = episode.name;

        var episodeTime = document.createElement("div");
        episodeTime.classList.add("episode-time");
        episodeTime.textContent = episode.time;

        var episodeTitle = document.createElement("div");
        episodeTitle.classList.add("episode-title");
        episodeTitle.textContent = episode.name;

        gridItem.appendChild(posterImg);
        gridItem.appendChild(episodeTime);
        gridItem.appendChild(episodeTitle);
        document.getElementById("grid").appendChild(gridItem);
      });
    });
  }

  // Chamada para carregar os episódios ao carregar a página
  window.onload = carregarEpisodios;
