const btn_submit = document.querySelector('.btn-submit')
const btn_hobbies = document.querySelector('.btn-hobbies')
const select_el = document.querySelector('#GET-METHOD')
let hobbies = []
const hobbies_el = document.querySelector('.hobbies')
const proxy = 'http://127.0.0.1:8080'
const output = document.querySelector('.output')
const nameHandler = document.querySelector('#name')
const ageHandler = document.querySelector('#age')
const hobbieHandler = document.querySelector('#hobbies')
const form_fields = document.querySelector('.form-fields')
const output_code = document.querySelector('.output-code')

let counter = 0


btn_submit.addEventListener('click', async(e) => {
    const url = document.querySelector('#url').value
    const method = select_el.value
    if (method === "GET") {
        const data = await fetch(`${proxy}${url}`, { method }).then(res => {
            output_code.innerHTML = res.status
            return res.json()
        })
        output.innerHTML = JSON.stringify(data, null, 2)
    }
    if (method === "POST") {
        for (let i = 0; i < hobbies_el.children.length; i++) {
            console.log(hobbies_el.children.length);
            const element = hobbies_el.children[i];
            hobbies.push(element.querySelector('span').innerText)
        }
        const body = JSON.stringify({ name: nameHandler.value, age: ageHandler.value, hobbies })
        hobbies = []
        const data = await fetch(`${proxy}${url}`, {
            method,
            body,
        }).then(res => {
            output_code.innerHTML = res.status
            return res.json()
        })
        output.innerHTML = JSON.stringify(data, null, 2)
    }
    if (method === "PUT") {
        for (let i = 0; i < hobbies_el.children.length; i++) {
            console.log(hobbies_el.children.length);
            const element = hobbies_el.children[i];
            hobbies.push(element.querySelector('span').innerText)
        }
        const body = JSON.stringify({ name: nameHandler.value, age: ageHandler.value, hobbies })
        hobbies = []
        const data = await fetch(`${proxy}${url}`, {
            method,
            body,
        }).then(res => {
            output_code.innerHTML = res.status
            return res.json()
        })
        output.innerHTML = JSON.stringify(data, null, 2)
    }
    if (method === "DELETE") {

        const data = await fetch(`${proxy}${url}`, {
            method,
        }).then(res => {
            output_code.innerHTML = res.status
            return res.json()
        })
        output.innerHTML = JSON.stringify(data, null, 2)
    }
})

btn_hobbies.addEventListener('click', (e) => {
    if (!hobbieHandler.value.length)
        return
    hobbies_el.innerHTML += getHobbiTemplate(hobbieHandler.value)
    hobbieHandler.value = ''
})

select_el.addEventListener('change', () => {
    if (select_el.value === 'GET') {
        form_fields.classList.add('hide')
    } else if (select_el.value === 'DELETE') {
        form_fields.classList.add('hide')
    } else {
        form_fields.classList.remove('hide')
    }
})

function getHobbiTemplate(text) {
    return `<div id="${counter++}"><span>${text}</span><button class="btn btn-hobbies-remove" onclick="(()=>{
        const id = this.parentNode
        this.parentNode.parentNode.removeChild(id)
    })()">remove</button></div>`
}