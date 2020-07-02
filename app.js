class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano,
            this.mes = mes,
            this.dia = dia,
            this.tipo = tipo,
            this.descricao = descricao,
            this.valor = valor
    }

    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }



}

class Bd {

    constructor() {
        let id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getProximoId() {
        let id = localStorage.getItem('id')

        return parseInt(id) + 1
    }

    gravar(e) {
        let id = this.getProximoId()
        // 1°parametro = obj, 2°JSON
        localStorage.setItem(id, JSON.stringify(e));

        localStorage.setItem('id', id);
    }

    recuperarTodosRegistros() {
        let despesas = Array()
        let id = localStorage.getItem('id')

        // recuperar todas despesas
        for (let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i))

            if (despesa === null) {
                // ignora as consições posteriores e consinua o laço
                continue
            }

            despesa.id = i
            despesas.push(despesa)
        }

        // console.log(despesas) 
        return despesas

    }

    pesquisar(despesa) {

        let despesasFiltradas = Array()

        despesasFiltradas = this.recuperarTodosRegistros()

        // ano
        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        if (despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        // filtro final
        return despesasFiltradas

    }

    remover(id) {
        localStorage.removeItem(id)
    }

}

let bd = new Bd()


function cadastrarDespesa() {

    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')


    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    );

    if (despesa.validarDados()) {
        bd.gravar(despesa)

        document.getElementById('titulo-modal').innerHTML = "Registro inserido com sucesso"
        document.getElementById('titulo-div').className = "modal-header text-success"
        document.getElementById('text-modal').innerHTML = "O registro foi cadastrado com sucesso!"
        document.getElementById('btn-modal').innerHTML = "Voltar"
        document.getElementById('btn-modal').className = "btn btn-success"
        $('#modalRegistroDespesa').modal('show')

        ano.value = '';
        mes.value = '';
        dia.value = '';
        tipo.value = '';
        descricao.value = '';
        valor.value = '';
    } else {
        // error
        document.getElementById('titulo-modal').innerHTML = "Ops! ocorreu um Erro!"
        document.getElementById('text-modal').innerHTML = "Campos obrigatórios não preenchidos!"
        document.getElementById('btn-modal').innerHTML = "Voltar e corrigir"
        document.getElementById('btn-modal').className = " btn btn-danger"
        document.getElementById('titulo-div').className = "modal-header text-danger"
        $('#modalRegistroDespesa').modal('show')

    }

}

function carregaListaDespesas(despesas = Array(), filtro = false) {

    if (despesas.length == 0 && filtro == false ) {
      despesas = bd.recuperarTodosRegistros()  
    }
    
    // body tabela
    var listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    despesas.forEach(function (d) {
        // console.log(d)
        // criar linha da tabela (tr)
        let linha = listaDespesas.insertRow()
        // criar coluna (td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        switch (d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break;
            case '2': d.tipo = 'Educação'
                break;
            case '3': d.tipo = 'Lazer'
                break;
            case '4': d.tipo = 'Saúde'
                break;
            case '5': d.tipo = 'Transporte'
                break;
        }

        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times" ></i>'
        btn.id = `id_despesa_${d.id}`
        // remover e despesa
        btn.onclick = function() {
            // remover a despesa
            let id = this.id.replace('id_despesa_', '')

            bd.remover(id)
            
            $('#modalRegistroDespesa').modal('show')

           
        }
        linha.insertCell(4).append(btn)

    })

}

function pesquisarDespesas() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    this.carregaListaDespesas(despesas, true)


}

function atualiza() {
    window.location.reload()
}