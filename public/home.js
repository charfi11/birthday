const nav = document.getElementById('blocknav');
nav.style.display = 'none';

//trace user status changed
auth.onAuthStateChanged(user => {
    if (user) {
        if (user != null) {
            document.getElementById('profilmail').innerHTML = user.email;
        };

        const blockB = document.getElementById('blockB');
        const blockH = document.getElementById('blockH');
        const fb = document.getElementById('formBirthday');
        const nav = document.getElementById('blocknav');
        const uid = user.uid;
        const inputid = document.createElement('input');
        inputid.setAttribute('type', 'hidden');
        inputid.setAttribute('value', uid);
        inputid.setAttribute('name', 'userid');
        inputid.setAttribute('id', 'uid');
        fb.appendChild(inputid);

        blockH.style.display = 'none';
        blockB.style.display = 'block';
        nav.style.display = 'block';

        // form for send data
        fb.addEventListener("submit", (event) => {
            event.preventDefault();
            var id = Math.random();
            var data = {
                name: fb.name.value,
                date: fb.date.value,
                userid: fb.userid.value,
                id: id,
            };
            divM.style.display = 'none';
            db.collection('one').add(data);
            fbdiv.style.display = 'none';
            birth.style.display = 'block';
            db.collection('one').where('userid', '==', user.uid).orderBy('name').get().then((snapshot => {
                snapshot.docs.forEach(childSnapshot => {
                    renderBirthday(childSnapshot);
                });
            }));
        });
        
        //loop for read data
        db.collection('one').where('userid', '==', user.uid).orderBy('name').get().then((snapshot => {
            if (snapshot.docs.length >= 1) {
                const dm = document.getElementById('divMore');
                if (dm != null) {
                    dm.remove();
                }
                snapshot.docs.forEach(childSnapshot => {
                    renderBirthday(childSnapshot);
                });
            } else {
                const createDm = document.createElement('div');
                createDm.setAttribute('id', 'divMore');
                divM.appendChild(createDm);
                const dm = document.getElementById('divMore');
                dm.innerHTML = "<h5 class='message'>Ajouter un anniversaire en cliquant sur le gâteau en haut.</h5><i class='fas fa-arrow-up ml-2'></i>";
            }
        }));
    } else {
        blockH.style.display = 'block';
        blockB.style.display = 'none';
        nav.style.display = 'none';
    }
});

const signupForm = document.getElementById('signupForm');

//signup user
signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const mail = signupForm['mail'].value;
    const password = signupForm['password'].value;
    auth.createUserWithEmailAndPassword(mail, password).then(cred => {
            $('#exampleModalCenter').modal('hide');
            signupForm.reset();
        })
        .catch((error) => {
            var errorMessage = error.message;
            console.log();
            signupForm.querySelector('.error').textContent = errorMessage;
        });
});

//logout
const logout = document.getElementById('logout');
logout.addEventListener('click', (event) => {
    event.preventDefault();
    const ul = document.getElementById('list').children;

    auth.signOut().then(() => {
        const dm = document.getElementById('divMore');
        if (dm != null) {
            dm.remove();
        }
        const arr = Array.from(ul);
        arr.forEach(element => element.remove());
    });
    var id = document.getElementById('uid');
    id.remove();
});

//login
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const mail = loginForm['mailLogin'].value;
    const password = loginForm['passwordLogin'].value;

    auth.signInWithEmailAndPassword(mail, password).then(cred => {
            $('#exampleModalCenter1').modal('hide');
            loginForm.reset();
        })
        .catch((error) => {
            var errorMessage = error.message;
            loginForm.querySelector('.error').textContent = errorMessage;
        });
});

var userp = document.getElementById('userp');
var back = document.getElementById('back');
var closeu = document.getElementById('closeuser');

userp.addEventListener('click', (event) => {
    var profil = document.getElementById('profile');
    var back = document.getElementById('back');

    profil.style.display = 'block';
    back.style.display = 'block';
});

back.addEventListener('click', (event) => {
    var profil = document.getElementById('profile');

    profil.style.display = 'none';
    back.style.display = 'none';
});

closeu.addEventListener('click', (event) => {
    var profil = document.getElementById('profile');

    profil.style.display = 'none';
    back.style.display = 'none';
});