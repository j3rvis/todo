function init() {
    let infoText = document.getElementById('infoText')
    infoText.innerHTML = 'Ladataan tehtävälista palvelimelta, odota...'
    let button = document.querySelector('button');
    button.addEventListener('click',addTodo)
    loadTodos()
  }

  async function loadTodos() {
    let response = await fetch('http://localhost:3000/todos')
    let todos = await response.json()
    console.log(todos)
    showTodos(todos)
  }

  function createTodoListItem(todo) {
    // luodaan uusi LI-elementti
    let li = document.createElement('li')
      // luodaan uusi id-attribuutti
    let li_attr = document.createAttribute('id')
      // kiinnitetään tehtävän/todon id:n arvo luotuun attribuuttiin 
    li_attr.value= todo._id
      // kiinnitetään attribuutti LI-elementtiin
    li.setAttributeNode(li_attr)
      // luodaan uusi tekstisolmu, joka sisältää tehtävän/todon tekstin
    let text = document.createTextNode(todo.text)
      // lisätään teksti LI-elementtiin
    li.appendChild(text)

      // luodaan uusi SPAN-elementti, käytännössä x-kirjan, jotta tehtävä saadaan poistettua
    let span_edit = document.createElement('span')
      // luodaan uusi class-attribuutti
    let span_edit_attr = document.createAttribute('class')
      // kiinnitetään attribuuttiin delete-arvo, ts. class="edit", jotta saadaan tyylit tähän kiinni
    span_edit_attr.value = 'edit'
      // kiinnitetään SPAN-elementtiin yo. attribuutti
    span_edit.setAttributeNode(span_edit_attr)
      // luodaan tekstisolmu arvolla EDIT
    let edit = document.createTextNode(' EDIT ')
      // kiinnitetään x-tekstisolmu SPAN-elementtiin (näkyville)
    span_edit.appendChild(edit)
      // määritetään SPAN-elementin onclick-tapahtuma kutsumaan removeTodo-funkiota
    span_edit.onclick = function() { editTodo(todo._id) }
      // lisätään SPAN-elementti LI-elementtin
    li.appendChild(span_edit)
      // palautetaan luotu LI-elementti
      // on siis muotoa: <li id="mongoIDXXXXX">Muista soittaa...<span class="edit">EDIT</span></li>

    let span_del = document.createElement('span')
      // luodaan uusi class-attribuutti
    let span_del_attr = document.createAttribute('class')
      // kiinnitetään attribuuttiin delete-arvo, ts. class="delete", jotta saadaan tyylit tähän kiinni
    span_del_attr.value = 'delete'
      // kiinnitetään SPAN-elementtiin yo. attribuutti
    span_del.setAttributeNode(span_del_attr)
      // luodaan tekstisolmu arvolla x
    let x = document.createTextNode(' X ')
      // kiinnitetään x-tekstisolmu SPAN-elementtiin (näkyville)
    span_del.appendChild(x)
      // määritetään SPAN-elementin onclick-tapahtuma kutsumaan removeTodo-funkiota
    span_del.onclick = function() { removeTodo(todo._id) }
      // lisätään SPAN-elementti LI-elementtin
    li.appendChild(span_del)
      // palautetaan luotu LI-elementti
      // on siis muotoa: <li id="mongoIDXXXXX">Muista soittaa...<span class="edit"> EDIT </span><span class="delete"> x </span></li>
    return li
  }

  function showTodos(todos) {
    let todosList = document.getElementById('todosList')
    let infoText = document.getElementById('infoText')
    // no todos
    if (todos.length === 0) {
      infoText.innerHTML = 'Ei tehtäviä'
    } else {    
      todos.forEach(todo => {
          let li = createTodoListItem(todo)        
          todosList.appendChild(li)
      })
      infoText.innerHTML = ''
    }
  }

  async function addTodo() {
    let newTodo = document.getElementById('newTodo')
    const data = { 'text': newTodo.value }
    const response = await fetch('http://localhost:3000/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    let todo = await response.json()
    let todosList = document.getElementById('todosList')
    let li = createTodoListItem(todo)
    todosList.appendChild(li)
  
    let infoText = document.getElementById('infoText')
    infoText.innerHTML = ''
    newTodo.value = ''
  }

  async function removeTodo(id) {
    const response = await fetch('http://localhost:3000/todos/'+id, {
      method: 'DELETE'
      
    })
    let responseJson = await response.json()
    let li = document.getElementById(id)
    li.parentNode.removeChild(li)
  
    let todosList = document.getElementById('todosList')
    if (!todosList.hasChildNodes()) {
      let infoText = document.getElementById('infoText')
      infoText.innerHTML = 'Ei tehtäviä'
    }
  }

  async function editTodo(id) {
    //Haetaan kannasta klikatun editin id:tä vastaava arvo
    const response = await fetch('http://localhost:3000/todos/'+id)

    //Muutetaan fetchaus jsoniksi
    todo = await response.json()

    //Haetaan UI:lta input elementti ja asetetaan sen arvoksi haetun ID:n text-arvo
    let newTodo = document.getElementById('newTodo')
    newTodo.value = todo.text


    //Jos käyttäjä vaihtaa muokkauksessa muokattavaa niin edeltävältä poistetaan update-class
    const li_list = document.getElementsByTagName('li')
    for(let i=0;i < li_list.length;i++){
      li_list[i].removeAttribute('class')
    }

    //Haetaan UI:lta button, vaihdetaan sen text value ja class, sekä muutetaan onclick-funktio
    const li = document.getElementById(id);
    const all_li = document.querySelectorAll('li')
    let update_Attr = document.createAttribute('class')
    update_Attr.value = 'li_update'
    li.setAttributeNode(update_Attr)
    let updateButton = document.querySelector('button');
    updateButton.innerText = "Tallenna";
    let Button_Attr = document.createAttribute('class');
    Button_Attr.value = "update";
    updateButton.setAttributeNode(Button_Attr);
    updateButton.removeEventListener('click',addTodo)
    updateButton.addEventListener('click', updateTodo)
  } 


  async function updateTodo() {
    //Haetaan input kentän arvo
    const updatedValue = document.getElementById('newTodo')

    //Queryselectorille haetaan se li mihin asetimmet li_update classin, jotta voimme hyödyntää kyseisen taskin ID:tä
    const li = document.querySelector('li.li_update')
    
    const data = { 'text':updatedValue.value }

    const response = await fetch('http://localhost:3000/todos/'+li.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    response_update = await response.json()
    li.firstChild.textContent = response_update.text
    console.log(li.firstChild.textContent)

    //Poistetaan editointia indikoivat tyylittelyt
    const li_list = document.getElementsByTagName('li')
    for(let i=0;i < li_list.length;i++){
      li_list[i].removeAttribute('class')
    }
    let updateButton = document.querySelector('button');

    updateButton.innerText = "Lisää";
    updateButton.removeAttribute('class')
    updatedValue.value = "";
    updateButton.removeEventListener('click',updateTodo)
    updateButton.addEventListener('click',addTodo)
  }

