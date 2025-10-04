# 📧 Classificador de Emails Inteligente

> Projeto desenvolvido como solução para o desafio proposto pela AutoU. O objetivo é criar uma aplicação web que utiliza Inteligência Artificial para automatizar a leitura e classificação de emails corporativos, sugerindo a categoria (Produtivo ou Improdutivo) e uma resposta apropriada, liberando tempo da equipe de tarefas manuais e repetitivas.

---

## 🚀 Acesso à Aplicação

A versão publicada da aplicação está disponível no seguinte link:

**https://classifier-app-wdl9.vercel.app/** ---

## ✨ Funcionalidades

* **Classificação Inteligente:** Utiliza um modelo de Processamento de Linguagem Natural (NLP) para categorizar emails em "Produtivo" ou "Improdutivo".
* **Sugestão de Resposta:** Fornece respostas básicas e contextuais para cada categoria de email.
* **Upload de Arquivos:** Permite a análise de emails a partir de arquivos `.txt` e `.pdf`.
* **Entrada de Texto Direta:** Oferece uma área de texto para colar o conteúdo do email diretamente.
* **Exibição de Confiança:** Mostra a pontuação de confiança da IA na classificação, com um indicador visual colorido.
* **Filtro Heurístico:** Aumenta a precisão e eficiência ao lidar com emails muito curtos ou triviais através de regras pré-definidas, evitando chamadas desnecessárias à API.
* **Interface Limpa e Responsiva:** Layout intuitivo e agradável para o usuário final.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias:

* **Frontend:**
    * HTML5
    * CSS3
    * JavaScript (ES6+)

* **Backend:**
    * Python 3
    * Flask (para a criação da API)

* **Inteligência Artificial:**
    * Hugging Face Inference API
    * Modelo de Classificação: `facebook/bart-large-mnli`

* **Deploy (Publicação):**
    * Vercel

* **Bibliotecas Python Principais:**
    * `requests`
    * `PyPDF2`
    * `python-dotenv`
    * `gunicorn`

---

## ⚙️ Como Executar Localmente

Siga os passos abaixo para rodar o projeto na sua máquina.

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/iurilin/classifier-app/tree/main
    cd seu-repositorio
    ```

2.  **Crie e ative um ambiente virtual:**
    ```bash
    # Cria o ambiente
    python -m venv venv

    # Ativa o ambiente
    # No Windows:
    venv\Scripts\activate
    # No Mac/Linux:
    source venv/bin/activate
    ```

3.  **Instale as dependências:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure as variáveis de ambiente:**
    * Crie um arquivo chamado `.env` na raiz do projeto.
    * Dentro dele, adicione sua chave da API do Hugging Face:
        ```ini
        HF_API_TOKEN="hf_SUA_CHAVE_AQUI"
        ```

5.  **Rode a aplicação Flask:**
    ```bash
    flask run
    ```
    * Acesse `http://127.0.0.1:5000` no seu navegador.

---

## 👨‍💻 Autor

Desenvolvido por **Iuri Patryk Lima de Sousa**.

* **LinkedIn:** https://www.linkedin.com/in/iuri-lima-0176072b7/
* **GitHub:** https://github.com/iurilin
* **Email:** `iurilime@gmail.com`
