from calculadora import soma, subtracao, multiplicacao, divisao


def test_integracao_soma():
    resultado = soma(5, 5)
    assert resultado == 10


def test_integracao_subtracao():
    resultado = subtracao(10, 3)
    assert resultado == 7


def test_integracao_multiplicacao():
    resultado = multiplicacao(4, 2)
    assert resultado == 8


def test_integracao_divisao():
    resultado = divisao(20, 4)
    assert resultado == 5