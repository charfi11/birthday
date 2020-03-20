const nav = document.getElementById('blocknav');
nav.style.display = 'none';

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

//trace user status changed
auth.onAuthStateChanged(user => {
    if (user) {
        if (user != null) {
            document.getElementById('profilmail').innerHTML = user.email;
        };

        //user form email update
        document.getElementById('oldmail').textContent = "Votre email: " + user.email;
        const formMail = document.getElementById('updatemail');
        formMail.addEventListener('submit', (event) => {
            event.preventDefault();
            var data = formMail.mail.value;
            if (user.email === data) {
                var sameMail = document.getElementById('samemail');
                sameMail.textContent = "L'email est le même ! Veuillez recommencer.";
                setTimeout(function () {
                    sameMail.textContent = "";
                }, 2000);
            } else {
                user.updateEmail(data).then(function () {
                    var credential = firebase.auth.EmailAuthProvider.credential(
                        user.email,
                        user.providerData[0].providerId
                    );
                    user.reauthenticateWithCredential(credential).then(function () {
                        var userblock = document.getElementById('userblockup');
                        userblock.style.display = 'none';
                        formMail.reset();
                    }).catch(function (error) {
                        sameMail.textContent = "Veuillez vous reconnecter pour changer votre email vous êtes connecter depuis trop longtemps.";
                    });
                }).catch((error) => {
                    console.log(error);
                });
            }
        });

        //user update password
        const formPass = document.getElementById('updatepassword');
        formPass.addEventListener('submit', (event) => {
            event.preventDefault();

            var password = formPass.password.value;

            user.updatePassword(password).then(function () {
                var credential = firebase.auth.EmailAuthProvider.credential(
                    user.email,
                    user.providerData[0].providerId
                );
                user.reauthenticateWithCredential(credential).then(function () {
                    var userblock = document.getElementById('userblockup');
                    userblock.style.display = 'none';
                    formMail.reset();
                }).catch(function (error) {
                    document.getElementById('errorpass').textContent = "Veuillez vous reconnecter pour changer votre password vous êtes connecter depuis trop longtemps.";
                });
            }).catch((error) => {
                //document.getElementById('errorpass').textContent = 'Votre mot de passe doit contenir minimum 6 charactères.'
            });
        });


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
            var ul = document.getElementById('list');
            var li = document.createElement('li');
            var pname = document.createElement('p');
            var pdate = document.createElement('p');
            var del = document.createElement('div');
            var up = document.createElement('div');
            var div = document.createElement('div');
            div.setAttribute('class', 'blockcrud');
            del.setAttribute('class', 'delete');
            up.setAttribute('class', 'update');

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

            pname.textContent = data.name;
            pdate.textContent = data.date;
            li.setAttribute('id', id);
            li.appendChild(pname);
            li.appendChild(pdate);
            li.appendChild(div);
            ul.appendChild(li);
            div.appendChild(del);
            div.appendChild(up);

            del.innerHTML = "<i class='fas fa-trash-alt' data-toggle='tooltip' data-placement='top' title='cliquez pour supprimer un anniversaire'></i>";
            up.innerHTML = '<i class="fas fa-edit" data-toggle"tooltip" data-placement="top" title="cliquez pour modifier un anniversaire"></i>';

            //event to delete data
            del.addEventListener("click", (event) => {
                event.stopPropagation();
                var id = event.target.parentElement.parentElement.parentElement.getAttribute('id');
                db.collection('one').doc(id).delete();
                event.target.parentElement.parentElement.parentElement.remove();
            });

            //event to replace data in form
    up.addEventListener('click', (event) => {
        event.stopPropagation();
        var id = event.target.parentElement.parentElement.parentElement.getAttribute('id');
        var parent = event.target.parentElement.parentElement.parentElement;
        var input = document.getElementById('hid1');
        fbdiv.style.display = 'none';
        birth.style.display = 'block';
        upd.style.display = 'block';
        input.setAttribute('data-id', id);
        form.name.value = parent.children[0].textContent;
        form.date.value = parent.children[1].textContent;
        
        //form for update data
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            var name = form.name.value;
            var date = form.date.value;
            var data = {
                name: name,
                date: date
            }
            db.collection('one').doc(id).update(data);
            var f = document.getElementById('updatefr');
            f.style.display = 'none';
            parent.children[0].textContent = data.name;
            parent.children[1].textContent = data.date;
        });
    });

        });

        //form for update data
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            var id = document.getElementById('hid1').getAttribute('id');

            var name = form.name.value;
            var date = form.date.value;
            var data = {
                name: name,
                date: date
            }
            db.collection('one').doc(id).update(data);
            var f = document.getElementById('updatefr');
            f.style.display = 'none';
        });

        function dateCall(dateStr) {
            var d = new Date();
            var date = d.getDate();
            var month = ("0" + (d.getMonth() + 1)).slice(-2);
            var dateStr = month + "-" + date;

            return dateStr;
        }

        //loop for read data
        db.collection('one').where('userid', '==', user.uid).orderBy('name').get().then((snapshot => {
            if (snapshot.docs.length >= 1) {
                document.getElementById('countb').textContent = "Vous avez enregistré " + snapshot.docs.length + " anniversaires";
                const dm = document.getElementById('divMore');
                if (dm != null) {
                    dm.remove();
                }

                snapshot.docs.forEach(childSnapshot => {
                    renderBirthday(childSnapshot);
                    var tm = childSnapshot.cp.proto.fields.date.stringValue.slice(5);

                    if (tm == dateCall()) {
                        var id = childSnapshot.id;
                        var ob = document.getElementById(id);
                        var ln = document.getElementById('listnamemodal');
                        var li = document.createElement('li');
                        ln.appendChild(li);
                        li.setAttribute('class', 'listn');

                        li.textContent = childSnapshot.data().name;
                        ob.style.background = '#FFD700';
                        $('#modalbirthday').modal('show');
                    } else {}
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

var userp = document.getElementById('userp');
var back = document.getElementById('back');
var closeu = document.getElementById('closeuser');
var usercog = document.getElementById('usercog');
var closeuserup = document.getElementById('closeblockup')

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

usercog.addEventListener('click', (event) => {
    var profil = document.getElementById('profile');
    var userblock = document.getElementById('userblockup');

    userblock.style.display = 'block';
    profil.style.display = 'none';
    back.style.display = 'none';
});

closeuserup.addEventListener('click', (event) => {
    var blockup = document.getElementById('userblockup');

    blockup.style.display = 'none';
});