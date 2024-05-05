

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

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database(); // Adicionado para acessar o Realtime Database

// Mostra o diálogo personalizado ao clicar na imagem
document.getElementById('dialog-image').addEventListener('click', function() {
    document.getElementById('custom-dialog').style.display = 'block';
});

// Fecha o diálogo ao clicar no ícone de fechar
document.getElementById('close-dialog').addEventListener('click', function() {
    document.getElementById('custom-dialog').style.display = 'none';
});

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // Verifica o status no Realtime Database antes de fazer o login
    database.ref('status/status/status').once('value').then((snapshot) => {
        const status = snapshot.val();

        if (status === 'online') {
            // Se estiver online, faz o login
            loginWithEmailAndPassword();
        } else {
            // Senão, exibe mensagem de erro personalizada
            showDialog('Erro de Acesso', 'O site não está disponível no momento. Por favor, tente novamente mais tarde.');
        }
    }).catch((error) => {
        console.error('Erro ao obter status:', error);
    });
});

function loginWithEmailAndPassword() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            document.getElementById('error-message').textContent = '';
            document.getElementById('success-message').textContent = 'Login realizado com sucesso.';
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            window.location.href = 'home.html?authenticated=true';
        })
        .catch((error) => {
            document.getElementById('error-message').textContent = error.message;
        });
}

document.getElementById('create-account-link').addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = 'sign_up.html';
});

document.getElementById('forgot-password-link').addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = 'reset_pass.html';
});

function showDialog(title, message) {
    document.getElementById('custom-dialog').style.display = 'block';
    document.getElementById('dialog-image').src = '';
    document.getElementById('close-dialog').style.display = 'none';
    document.getElementById('custom-dialog').innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
            <div style="text-align: center;">
                <h2>${title}</h2>
                <p>${message}</p>
                <button onclick="closeDialog()" style="padding: 10px 20px; background-color: #800080; color: #fff; border: none; border-radius: 5px; cursor: pointer;">OK</button>
            </div>
        </div>
    `;
}
function closeDialog() {
    document.getElementById('custom-dialog').style.display = 'none';
}

const checkDevTools = () => {
    if (window.outerWidth - window.innerWidth > 100 || window.outerHeight - window.innerHeight > 100) {
        document.body.innerHTML = '#';
    }
};
setInterval(checkDevTools, 1);