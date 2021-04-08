// const deleteBtn = document.querySelectorAll('.del')
// const todoItem = document.querySelectorAll('.todoItem span')
// const todoComplete = document.querySelectorAll('.todoItem span.completed')

// Array.from(deleteBtn).forEach((el)=>{
//     el.addEventListener('click', deleteTodo)
// })

// Array.from(todoItem).forEach((el)=>{
//     el.addEventListener('click', markComplete)
// })

// Array.from(todoComplete).forEach((el)=>{
//     el.addEventListener('click', undo)
// })

// async function deleteTodo(){
//     const todoText = this.parentNode.childNodes[1].innerText
//     try{
//         const response = await fetch('deleteTodo', {
//             method: 'delete',
//             headers: {'Content-type': 'application/json'},
//             body: JSON.stringify({
//                 'rainbowUnicorn': todoText
//             })
//         })
//         const data = await response.json()
//         console.log(data)
//         location.reload()
//     }catch(err){
//         console.log(err)
//     }
// }

// async function markComplete(){
//     const todoText = this.parentNode.childNodes[1].innerText
//     try{
//         const response = await fetch('markComplete', {
//             method: 'put',
//             headers: {'Content-type': 'application/json'},
//             body: JSON.stringify({
//                 'rainbowUnicorn': todoText
//             })
//         })
//         const data = await response.json()
//         console.log(data)
//         location.reload()
//     }catch(err){
//         console.log(err)
//     }
// }

// async function undo(){
//     const todoText = this.parentNode.childNodes[1].innerText
//     try{
//         const response = await fetch('undo', {
//             method: 'put',
//             headers: {'Content-type': 'application/json'},
//             body: JSON.stringify({
//                 'rainbowUnicorn': todoText
//             })
//         })
//         const data = await response.json()
//         console.log(data)
//         location.reload()
//     }catch(err){
//         console.log(err)
//     }
// }

const delBtn = document.querySelectorAll('.del')

Array.from(delBtn).forEach(item => {
    item.addEventListener('click', deleteTodo)
})

async function deleteTodo(){
    const todoText = await this.parentNode.childNodes[1].innerText
    try {
        const response = await fetch('deleteTodo' , {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'delItem': todoText
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

const compBtn = document.querySelectorAll('.item')

Array.from(compBtn).forEach(item => {
    item.addEventListener('click', markComplete)
})

async function markComplete(){
    const todoText = await this.innerText
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'updateItem': todoText
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

const undoBtn = document.querySelectorAll('.completed')

Array.from(undoBtn).forEach(item => {
    item.addEventListener('click', undoItem)
})
console.log(undoBtn)

async function undoItem() {
    const undoText = await this.innerText
    try{
        const response = await fetch('markIncomplete' , {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'updateItem': undoText
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}