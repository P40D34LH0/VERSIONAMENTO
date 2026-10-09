// Event listener ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarRespostasSalvas();
    configurarProgressoFormulario();
    window.addEventListener('scroll', checarBotaoTopo);
});

/* --- 1. Atualizar Barra de Progresso no Teste --- */
function configurarProgressoFormulario() {
    const inputs = document.querySelectorAll('#formTeste input[type="radio"]');
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            const totalPerguntas = 5;
            const respondidas = document.querySelectorAll('#formTeste input[type="radio"]:checked').length;
            const porcentagem = (respondidas / totalPerguntas) * 100;
            document.getElementById('barraProgresso').style.width = porcentagem + '%';
        });
    });
}

/* --- 2. Teste de Hábitos com Feedback e Salvamento LocalStorage --- */
function calcularTeste() {
    const form = document.getElementById('formTeste');
    const formData = new FormData(form);
    
    let pontuacao = 0;
    let totalPerguntas = 5;
    let respostas = {};

    for (let i = 1; i <= totalPerguntas; i++) {
        let val = formData.get('p' + i);
        if (val !== null) {
            pontuacao += parseInt(val);
            respostas['p' + i] = val;
        } else {
            alert('Por favor, responda a todas as perguntas antes de avaliar!');
            return;
        }
    }

    // Salvar respostas no localStorage (Desafio Extra)
    localStorage.setItem('respostasHabitos', JSON.stringify(respostas));

    const resultadoDiv = document.getElementById('resultadoTeste');
    let mensagem = '';
    let imagemSrc = '';

    // Lógica de feedback baseada na pontuação
    if (pontuacao >= 4) {
        mensagem = 'Parabéns! Você está cuidando muito bem da sua rotina de estudos e saúde!';
        imagemSrc = '../img/dave_desafiador.png';
    } else if (pontuacao === 2 || pontuacao === 3) {
        mensagem = 'Atenção! Você pode melhorar alguns hábitos para render mais e viver melhor.';
        imagemSrc = '../img/dave_preocupado.png';
    } else {
        mensagem = 'Cuidado extremo! Sua rotina precisa de ajustes urgentes para não prejudicar sua saúde!';
        imagemSrc = '../img/dave_mais_preocupado.png';
    }

    resultadoDiv.innerHTML = `
        <div class="resultado-box">
            <h3>Resultado do Teste</h3>
            <p>${mensagem}</p>
            <p><strong>Pontuação: ${pontuacao} / ${totalPerguntas}</strong></p>
            <img src="${imagemSrc}" alt="Feedback Dave">
        </div>
    `;
}

// Restaura as respostas do usuário salvas previamente
function carregarRespostasSalvas() {
    const salvas = localStorage.getItem('respostasHabitos');
    if (salvas) {
        const respostas = JSON.parse(salvas);
        for (let p in respostas) {
            const radio = document.querySelector(`#formTeste input[name="${p}"][value="${respostas[p]}"]`);
            if (radio) radio.checked = true;
        }
        // Atualiza a barra de progresso após restaurar
        const totalPerguntas = 5;
        const respondidas = Object.keys(respostas).length;
        document.getElementById('barraProgresso').style.width = ((respondidas / totalPerguntas) * 100) + '%';
    }
}

/* --- 3. Calculadora de Rotina --- */
function calcularRotina() {
    const sono = parseFloat(document.getElementById('horasSono').value);
    const estudo = parseFloat(document.getElementById('horasEstudo').value);
    const celular = parseFloat(document.getElementById('horasCelular').value);

    const resultadoDiv = document.getElementById('resultadoCalculadora');

    if (isNaN(sono) || isNaN(estudo) || isNaN(celular)) {
        resultadoDiv.innerHTML = '<p style="color: #ff0055;">Preencha todos os campos corretamente!</p>';
        return;
    }

    let orientacao = '';

    if (sono < 7) {
        orientacao += '<p>⚠️ Seu tempo de sono está baixo. Tente dormir pelo menos 7 a 8 horas.</p>';
    } else {
        orientacao += '<p>✅ A quantidade de sono está adequada.</p>';
    }

    if (celular > 4) {
        orientacao += '<p>⚠️ O tempo no celular está elevado. Tente reduzir o uso de telas.</p>';
    } else {
        orientacao += '<p>✅ Tempo de uso do celular controlado.</p>';
    }

    if (estudo > 8) {
        orientacao += '<p>⚠️ Cuidado com o excesso de estudos! Lembre-se de fazer pausas.</p>';
    } else if (estudo < 2) {
        orientacao += '<p>💡 Tente dedicar um pouco mais de tempo constante aos seus estudos.</p>';
    } else {
        orientacao += '<p>✅ Tempo de estudos bem equilibrado!</p>';
    }

    resultadoDiv.innerHTML = `
        <div class="resultado-box">
            <h3>Análise da sua Rotina</h3>
            ${orientacao}
        </div>
    `;
}

/* --- 4. Desafio 04: Função Conversora (Romano / Inteiro -> Decimal) --- */
function converterRomanoParaDecimal(inputStr) {
    if (!inputStr) return null;
    
    let str = inputStr.trim().toUpperCase();

    // Se for um número de dígitos decimais
    if (!isNaN(str) && str !== '') {
        return parseInt(str, 10);
    }

    // Tabela de valores romanos
    const mapaRomanos = {
        'I': 1, 'V': 5, 'X': 10, 'L': 50,
        'C': 100, 'D': 500, 'M': 1000
    };

    let totalDecimal = 0;

    for (let i = 0; i < str.length; i++) {
        let atual = mapaRomanos[str[i]];
        let proximo = mapaRomanos[str[i + 1]];

        if (!atual) return null; // Caractere inválido

        if (proximo && proximo > atual) {
            totalDecimal += (proximo - atual);
            i++; // Pulamos o próximo símbolo pois já foi subtraído
        } else {
            totalDecimal += atual;
        }
    }

    return totalDecimal;
}

function executarConversaoRomana() {
    const valor = document.getElementById('inputRomano').value;
    const resultadoDiv = document.getElementById('resultadoRomano');
    const valorConvertido = converterRomanoParaDecimal(valor);

    if (valorConvertido === null) {
        resultadoDiv.innerHTML = '<p style="color: #ff0055;">Número ou símbolo romano inválido!</p>';
    } else {
        resultadoDiv.innerHTML = `
            <div class="resultado-box">
                <p>Entrada: <strong>${valor}</strong></p>
                <p>Valor Decimal: <strong>${valorConvertido}</strong></p>
            </div>
        `;
    }
}

/* --- 5. Voltar ao Topo --- */
function checarBotaoTopo() {
    const btn = document.getElementById('btnTopo');
    if (window.scrollY > 300) {
        btn.style.display = 'block';
    } else {
        btn.style.display = 'none';
    }
}

function voltarAoTopo() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}