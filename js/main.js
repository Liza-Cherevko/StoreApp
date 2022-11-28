


// Добавить счетчик числа товаров в локальное хранилище
if (!localStorage.getItem('goods')) {
    localStorage.setItem('goods', JSON.stringify([]))
}
  // Модальное окно
let myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {
    keyboard: false
})

// поиск

let options = {
    valueNames:['name', 'price']
}
let userList;








  // Сохранение нового товара
document.querySelector('button.add_new').addEventListener('click', (e)=> {
    const name = document.getElementById('good_name').value
    const price = document.getElementById('good_price').value
    const inventory = +document.getElementById('good_inventory').value
    if (name && price && inventory) {
        document.getElementById('good_name').value = ''
        document.getElementById('good_price').value = ''
        document.getElementById('good_inventory').value = '1'
        let goods = JSON.parse(localStorage.getItem('goods'))
        goods.push(['good_' + goods.length, name, price, inventory, 0, 0, 0])
        localStorage.setItem('goods', JSON.stringify(goods))
        updateGoods()
       
        myModal.hide()
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
        })
    }
})
// Обновление отображаемых товаров
updateGoods()
function updateGoods() {
    let resultPrice = 0;
    const tBody = document.querySelector('.list');
    tBody.innerHTML = '';
    document.querySelector('.cards').innerHTML = '';
    let goods = JSON.parse(localStorage.getItem('goods'))
    if (goods.length) {
        table1.hidden = false;
        table2.hidden = false;
        for (let i = 0; i < goods.length; i++) {
            tBody.insertAdjacentHTML('beforeend',
                `
                <tr class="align-middle">
                <td>${i+1}</td>
                <td class="name">${goods[i][1]}</td>
                <td class="price">${goods[i][2]}</td>
                <td>${goods[i][3]}</td>
                <td><button class="good_delete btn-danger" data-delete="${goods[i][0]}">&#10006;</button></td>
                <td><button class="good_delete btn-primary" data-goods="${goods[i][0]}">&#10149;</button></td>
              </tr>
                `)
            if (goods[i][4] > 0) {
                // Расчитать цену с учетом скидки
                goods[i][6] = goods[i][4] * goods[i][2] - goods[i][4] * goods[i][2] * goods[i][5] * 0.01
                // Сумировать цену в общий результат
                resultPrice += goods[i][6]
                document.querySelector('.cards').insertAdjacentHTML('beforeend',
                `
                <tr class="align-middle">
                  <td>${i+1}</td>
                  <td class="price_name">${goods[i][1]}</td>
                  <td class="price_one">${goods[i][2]}</td>
                  <td class="price_count">${goods[i][4]}</td>
                  <td class="price_discount"><input data-goodid="${goods[i][0]}" type="text" value="${goods[i][5]}" min="0" max="100"></td>
                  <td>${goods[i][6]}</td>
                  <td><button class="good_delete btn-danger" data-delete="${goods[i][0]}">&#10006;</button></td>
                </tr>
                `)
            }
        }
            userList = new List('goods', options);
    } else {
        table1.hidden = true
        table2.hidden = true
    }
    document.querySelector('.price_result').innerHTML=resultPrice+`&#8372;`
}

// удаление товаров

document.querySelector('.list').addEventListener('click', (e) => {
    if (!e.target.dataset.delete) {
        return
    }
    Swal.fire({
        title: 'Attention',
        text: 'Are you sure you want to delete the item?',
        icon: 'warming',
        showCancelButton: true,
        cancelButtonColor: '#30856',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            let goods = JSON.parse(localStorage.getItem('goods'))
            for (let i = 0; i < goods.length; i++) {
                if (goods[i][0] == e.target.dataset.delete) {
                    goods.splice(i, 1)
                    localStorage.setItem('goods', JSON.stringify(goods))
                    updateGoods()
                }
            }
            Swal.fire(
                'The product has been removed'
            )
  }
})
})
// добавление товара
document.querySelector('.list').addEventListener('click', (e) => {
    if (!e.target.dataset.goods) {
        return
    }
    let goods = JSON.parse(localStorage.getItem('goods'))
    for (let i = 0; i < goods.length; i++) {
        if (goods[i][3] >0 &&goods[i][0]==e.target.dataset.goods) {
            goods[i].splice(3, 1, goods[i][3] - 1)
            goods[i].splice(4, 1, goods[i][4] + 1)
            localStorage.setItem('goods', JSON.stringify(goods))
            updateGoods()
        }
       
    }
})
// удаление товара 
document.querySelector('.cards').addEventListener('click', (e) => {
    if (!e.target.dataset.delete) {
        return
    }
    let goods = JSON.parse(localStorage.getItem('goods'))
    for (let i = 0; i < goods.length; i++) {
        if (goods[i][4] >0 &&goods[i][0]==e.target.dataset.delete) {
            goods[i].splice(3, 1, goods[i][3] + 1)
            goods[i].splice(4, 1, goods[i][4] - 1)
            localStorage.setItem('goods', JSON.stringify(goods))
            updateGoods()
        }
       
    }
})


// сортировка таблиц 
function sortTable(colNum, type, id) { 
    let elem = document.getElementById(id)
    let tBody = elem.querySelector('tbody')
    let rowsArray = Array.from(tBody.rows)
    let compare

    switch (type) {
        case 'number':
            compare = function (rowA, rowB) { 
                return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML
            }
            break;
            case 'string':
                compare = function (rowA, rowB) { 
                    return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1:-1
                }
                break;
    }
    rowsArray.sort(compare)
    tBody.append(...rowsArray)
}

table1.onclick = function (e) { 
    if (e.target.tagName != 'TH') return
    let th = e.target
    sortTable(th.cellIndex, th.dataset.type, 'table1')
}

table2.onclick = function (e) { 
    if (e.target.tagName != 'TH') return
    let th = e.target
    sortTable(th.cellIndex, th.dataset.type, 'table2')
}

// скидка 
document.querySelector('.cards').addEventListener('input', function(e) {  
    if(!e.target.dataset.goodid) {
      return
    }
    let goods = JSON.parse(localStorage.getItem('goods'))
    for(let i=0; i<goods.length; i++) {
      if(goods[i][0] == e.target.dataset.goodid) {
        // Скидка
        goods[i][5] = e.target.value
        // Цена со скидкой
        goods[i][6] = goods[i][4]*goods[i][2] - goods[i][4]*goods[i][2]*goods[i][5]*0.01
        localStorage.setItem('goods', JSON.stringify(goods))
        updateGoods()
        // Поставить фокус в поле скидки и передвинуть курсор в конец
        let input = document.querySelector(`[data-goodid="${goods[i][0]}"]`)
        input.focus()
        input.selectionStart = input.value.length;
      }
    }
  })