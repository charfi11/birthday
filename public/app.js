const ul = document.getElementById('list');
const fb = document.getElementById('formBirthday');
const fbdiv = document.getElementById('fbirth')
const form = document.getElementById('formUpdate');
const birth = document.getElementById('birth');
const upd = document.getElementById('updatefr');
const closes = document.getElementById('close');
const closesup = document.getElementById('close2');
const divM = document.getElementById('divM');

closes.addEventListener('click', (event) => {
    fbdiv.style.display = 'none';
    birth.style.display = 'block';
});

closesup.addEventListener('click', (event) => {
    form.style.display = 'none';
    birth.style.display = 'block';
});

//function for create element
function renderBirthday(childSnapshot) {
    var li = document.createElement('li');
    var div = document.createElement('div');
    var del = document.createElement('div');
    var up = document.createElement('div');
    var pname = document.createElement('p');
    var pdate = document.createElement('p');
    div.setAttribute('class', 'blockcrud');
    del.setAttribute('class', 'delete');
    up.setAttribute('class', 'update');

    li.setAttribute('data-id', childSnapshot.id);
    pname.textContent = childSnapshot.data().name;
    pdate.textContent = childSnapshot.data().date;

    del.innerHTML = "<i class='fas fa-trash-alt' data-toggle='tooltip' data-placement='top' title='cliquez pour supprimer un anniversaire'></i>";
    up.innerHTML = '<i class="fas fa-edit" data-toggle"tooltip" data-placement="top" title="cliquez pour modifier un anniversaire"></i>';

    li.appendChild(pname);
    li.appendChild(pdate);
    li.appendChild(div);
    div.appendChild(del);
    div.appendChild(up);
    ul.appendChild(li);

    //event to delete data
    del.addEventListener("click", (event) => {
        event.stopPropagation();
        var id = event.target.parentElement.parentElement.parentElement.getAttribute('data-id');
        db.collection('one').doc(id).delete();
        event.target.parentElement.parentElement.parentElement.remove();
    });

    //event to replace data in form
    up.addEventListener('click', (event) => {
        event.stopPropagation();
        var id = event.target.parentElement.parentElement.parentElement.getAttribute('data-id');
        var parent = event.target.parentElement.parentElement.parentElement;
        var input = document.getElementById('hid1');
        fbdiv.style.display = 'none';
        birth.style.display = 'block';
        upd.style.display = 'block';
        input.setAttribute('data-id', id);
        form.name.value = parent.children[0].textContent;
        form.date.value = parent.children[1].textContent;
    });

    //form for update data
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        var id = document.getElementById('hid1').getAttribute('data-id');
        
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
}

birth.addEventListener('click', (event) => {
    fbdiv.style.display = 'flex';
    upd.style.display = 'none';
    birth.style.display = 'none';
});