# Financas-Node.js
<h1>Documentação do Código</h1>
<p>Aqui está a documentação do código em questão, que foi criado utilizando o Node.js e o banco de dados PostgreSQL.</p>
<h2>Dependências</h2>
<p>Para a execução do código, são necessárias as seguintes dependências:</p>
<ul>
  <li>Express: framework para a criação de aplicações web em Node.js</li>
  <li>pg: biblioteca de banco de dados PostgreSQL para Node.js</li>
  <li>zod: biblioteca para validação de schemas em JavaScript</li>
  <li>dotenv: biblioteca para o carregamento de variáveis de ambiente a partir do arquivo .env</li>
</ul>
<p>Essas dependências podem ser instaladas a partir do terminal utilizando o comando npm install.</p>
<h2>Variáveis de Ambiente</h2>
<p>O código utiliza variáveis de ambiente para armazenar as informações de conexão com o banco de dados, como host, porta, usuário, senha e nome do banco de dados. Essas variáveis são carregadas a partir do arquivo .env na raiz do projeto utilizando a biblioteca dotenv.</p>
<h2>Rotas</h2>
<p>O código define as seguintes rotas:</p>
<h3>POST /CriarUsuario</h3>
<p>Cria um novo usuário na tabela contabilidade do banco de dados. Recebe as seguintes informações no corpo da requisição:</p>
<ul>
  <li>nome: string obrigatória com o nome do usuário</li>
  <li>salario: número obrigatório com o salário do usuário</li>
  <li>gastos: número obrigatório com os gastos do usuário</li>
  <li>entradas: número obrigatório com as entradas do usuário</li>
</ul>
<p>Respostas possíveis:</p>
<ul>
  <li>200 OK: a requisição foi bem sucedida e retorna os dados inseridos no banco;</li>
  <li>404 Not Found: ocorreu um erro ao tentar criar o registro no banco.</li>
</ul>
<h3>/inserirGasto/:id (POST)</h3>
<p>Atualiza o registro contábil com o ID especificado, adicionando o valor do gasto enviado no corpo da requisição ao valor atual de gastos. O novo saldo é calculado a partir da fórmula salario - gastos + entradas. Os campos necessários são:</p>
<ul>
  <li>gastos: número com o valor do gasto a ser adicionado.</li>
</ul>
<p>Exemplo de requisição:</p>
<pre>{ "gastos": 100 }</pre>
<p>Respostas possíveis:</p>
<ul>
  <li>200 OK: a requisição foi bem sucedida e retorna o novo saldo do registro atualizado;</li>
  <li>204 No Content: não há registro contábil com o ID especificado;</li>
  <li>404 Not Found: ocorreu um erro ao tentar atualizar o registro no banco.</li>
</ul>
<h3>/inserirEntradas/:id (POST)</h3>
<p>Atualiza o registro contábil com o ID especificado, adicionando o valor da entrada enviado no corpo da requisição ao valor atual de entradas. O novo saldo é calculado a partir da fórmula salario - gastos + entradas. Os campos necessários são:</p>
<ul>
  <li>entradas: número com o valor da entrada a ser adicionado.</li>
</ul>
<p>Exemplo de requisição:</p>
<pre>{ "entradas": 500 }</pre>
<p>Respostas possíveis:</p>
<ul>
  <li>200 OK: a requisição foi bem sucedida e retorna o novo saldo do registro atualizado;</li>
  <li>204 No Content: não há registro contábil com o ID especificado;</li>
  <li>404 Not Found: ocorreu um erro ao tentar atualizar o registro no banco.</li>
  <h3>/saldo/:id (GET)</h3>
<p>Retorna o saldo atual do registro contábil com o ID especificado. Respostas possíveis:</p>
<ul>
  <li>200 OK: a requisição foi bem sucedida e retorna o saldo do registro;</li>
  <li>404 Not Found: não há registro contábil com o ID especificado.</li>
</ul>
<h2>Esquema do Banco de Dados</h2>
<p>O banco de dados utilizado tem uma única tabela chamada "contabilidade", que possui as seguintes colunas:</p>
<ul>
  <li>id: número inteiro, chave primária, auto-incrementável;</li>
  <li>nome: string com o nome do usuário;</li>
  <li>salario: número com o salário do usuário;</li>
  <li>gastos: número com os gastos do usuário;</li>
  <li>entradas: número com as entradas do usuário.</li>
</ul>
<p>A tabela é criada automaticamente quando o servidor é iniciado e os registros são inseridos utilizando as rotas definidas no código.</p>
