from calculadora import soma, subtracao, multiplicacao, divisao
from entrada_dados import receber_numeros


def executar_calculadora():

    num1, num2 = receber_numeros()

    print("\nEscolha a operação:")
    print("+ -> Soma")
    print("- -> Subtração")
    print("* -> Multiplicação")
    print("/ -> Divisão")

    operacao = input("Operação: ")

    if operacao == '+':
        resultado = soma(num1, num2)

    elif operacao == '-':
        resultado = subtracao(num1, num2)

    elif operacao == '*':
        resultado = multiplicacao(num1, num2)

    elif operacao == '/':
        resultado = divisao(num1, num2)

    else:
        resultado = "Operação inválida"

    print("Resultado:", resultado)


if __name__ == "__main__":
    executar_calculadora()