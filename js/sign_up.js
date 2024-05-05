
// Configurações do Firebase
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

// Inicialize o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Adicione um evento de envio ao formulário de criação de conta
document.getElementById('create-account-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o envio padrão do formulário
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Criar uma conta com e-mail e senha
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Limpar mensagens de erro
            document.getElementById('error-message').textContent = '';
            // Exibir mensagem de sucesso
            document.getElementById('success-message').textContent = 'Conta criada com sucesso.';
            // Limpar campos de entrada
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';

            // Obter o ID de usuário gerado pelo Firebase
            const userId = userCredential.user.uid;

            // Dados a serem escritos no Realtime Database
            const userData = {
                username: name,
                photo: '',
                localization: ''
            };

            // Gravar os dados no Realtime Database
            firebase.database().ref('accounts/' + userId).set(userData)
                .then(() => {
                    console.log('Dados gravados no Realtime Database:', userData);
                    // Redirecionar para a página de login após criar a conta
                    window.location.href = 'sign.html';
                })
                .catch((error) => {
                    console.error('Erro ao gravar dados no Realtime Database:', error);
                });
        })
        .catch((error) => {
            // Exibir mensagem de erro
            document.getElementById('error-message').textContent = error.message;
        });
});
