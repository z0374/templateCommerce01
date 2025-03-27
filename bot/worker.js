export default { //Exporta as variáveis de ambientes
  async fetch(request, env, ctx) { //Faz a requisição asincrona das variaveis de ambiente e da requisição
  if (request.headers.get('X-Telegram-Bot-Api-Secret-Token') === '5354wD0f0D0f054w705') { //Verifica se a requisição vem do bot do telegram
   return handleRequest(request, env); //Chama a função que trata a requisição do telegram
  }else if(request.headers.get('X-Page-Token')==='lrbb1lrp00wp1w3I1l70b4r8r570'){ //verifica se a página que esta solicitando esta autorizada a receber os dados
      //return handleJson(request, env);  //Chama a função que envia os dados para a hospedagem
  }else{ 
    /*await sendMessage('Acesso Negado',env);*/ return new Response('Acesso Negado',{status:200})} //Caso não for uma hospedagem autorizada ou o bot do telegram nega o acesso
  },
};

async function handleRequest(request, env) {  //Função que trata a requisição do Webhook
  await new Promise(resolve => setTimeout(resolve, 1000));  //Aguarda 1 segundo para começar a rodar o script
  const url = new URL(request.url)|| null;  //Captura a url da requisição
  if (!url) { //Verifica se a url é válida
    return new Response("URL inexistente", { status: 500 });  //Caso não seja válida retorna 'URL inesistente' e 'status:500'
  }else{ //Se URL for válida
    try{
      const update = await request.json();  //captura o Json da requisição
      const chatId = Number(update.message.chat.id);  //Captura o identificador do chat e define como number
      const userId = Number(update.message.from.id);  //captura o identificador do usuário que fez a requisição e define como number
      const userName = String(update.message.from.first_name + ' ' + update.message.from.last_name);  //captura o nome do usuário que fez a requisição e define como string
      let messageText = String(update.message.text);  //captura o texto da mensagem do emissor e define como String
   
    const  _data = []; //Recupera os dados do KV através da função assíncrona dados com o parâmetro de leitura e passando o env como parâmetro e salva na variável ' _data'
    let userState = await loadUserState(env, userId); //Recupera as informações da seção do usuário no bot da função assíncrona loadUserState passando o env como parâmetro e o identificador do usuário
    //await sendMessage('log1',env);
    if (!userState) { //Verifica se o estado do usuário existe
      userState = { //se não existir cria o estado do usuário
        proces: String(messageText).toLowerCase(),  //salva o processo iniciado no bot
        pin:'naoDefinido', //recebe o pin, valor padão null
        state: String('').toLowerCase(),  //salva o estado do usuário na seção do bot
        titulo: String(''), //salva o conteúdo da seção iniciada
        texto: String(''),  //salva o conteúdo da seção iniciada
        select: [], //salva os dados selecionados
        procesCont:0  //contador de processos em execução
      };
    }
    //await sendMessage('log2',env);
/*
if(users === null && messageText == '/index' || users === null && messageText == '/index'){	//Verifica se o usuário ja existe.
	userState.state='waiting_'+messageText;	//Se não existir inicia o processo de criação
	messageText = '';	//Muda a mensagem para vazio
	await saveUserState(env, userId, userState);  //Salva o estado do usuário usando a função saveUserState com a variável env como parâmetro o identificador do usuário eo array do userState.
	await processos('');	//Chama a função processos passando o string vazia da mensagem como parametro
}else{	  //Chama a função processos passando o texto da mensagem como parametro
     }*/
await processos(messageText);
    async function processos(messageText){  //Define a função processos com o texto da mensagem como parâmetro
      if(userState.procesCont>3){userState=null; await saveUserState(env, userId, userState);return new Response('Falha na requisição');} //Verifica se a quantidade de processos é maior que 3. Se for falha a requisição
      else{userState.procesCont++;} //Se não for adiciona 1 ao contador de processos
      //await sendMessage('log3',env);
      if(userState!==null || messageText!=='') {  //verifica se o estado do usuário e nulo ou se o texto da mensagem é vazio
        if(userState.state.includes("waiting_section") || userState.state.includes("waiting_comand")){  //Verifica se o estado do usuário é waiting_section ou waiting_comand
          userState.state += '_' + await normalize(messageText);  //Adiciona a mensagem do texto normalizada ao final do estado do usuário
          await saveUserState(env, userId, userState);  //Salva o estado do usuário usando a função saveUserState com a variável env como parâmetro o identificador do usuário eo array do userState.
        }
        //await sendMessage('log4',env);
        switch(messageText.toLowerCase()){  //abre uma chave passando a mensagem em minúsculo
          case '/encerrar': //caso o comando for /encerrar
            userState = null  //define o userState como nulo
            await saveUserState(env, userId, userState);  //chama a função assincrona saveUserState com o env como parâmetro o identificador do usuário eo estado da seção
            await sendMessage('Encerrado!\n /comandos',env)  //Envia para o chat a mensagem Encerrado quebra uma linha e envia / _data para reiniciar  o processo  _data
            return new Response('Encerrado!',{ status: 200 });  //retorna como nova resposta Encerrado! com status: 200

          case '/comandos': //caso o comando for /comando
              userState = null; //define o userState como nulo
              await saveUserState(env, userId, userState);  //Chama a função assincrona saveUserState com o env como parâmetro o identificador do usuário eo estado da seção
              const list = `
              /comandos - Lista de comandos do bot.
              /ajuda - Ajuda do bot.
              /portal - Adiciona um novo link ao portal.
              /index - Abre a edição do  index.
            `;  //variável com a lista de comandos do bot
              await sendMessage(list, env); //Envia para o chat uma mensagem com a lista de comandos
              return new Response('Comandos enviados!',{status:200});  //Retorna como resposta Comandos enviados! com status:200
              break;

          case '/portal':
              userState.procesCont = 0;
              userState.proces = messageText.toLowerCase();
              userState.state = 'waiting_comand_portal';
              await saveUserState(env, userId, userState);  //Chama a função assincrona saveUserState com o env como parâmetro o identificador do usuário eo estado da seção
              await sendMessage(`Olá ${userName}! Como posso ajudar?\n /Adicionar_link - /Editar_link\n /Remover_link - /Deletar_link\n\n /ver_meu_portal --- /encerrar`,env);
              break;

          case '/index':  //caso o comando for /index
            userState.procesCont=0; //zera o contador do processo
            userState.proces = messageText.toLowerCase(); //Define o processo do usuário para / _data
            userState.state = 'waiting_section'; //Define o status do usuário como 'waiting_comand'
            await saveUserState(env, userId, userState);  //Chama a função assincrona saveUserState com o env como parâmetro o identificador do usuário eo estado da seção
            await sendMessage(`Olá ${userName}! Como posso ajudar?\n /Cabecalho - /Apresentacao - /Imagens - /Horarios - /usuarios - /configuracao\n\n /ver_dados_da_pagina - /encerrar`, env); //Saúda o usuário é lista as tarefas que ele pode fazer com o BOT
            return new Response('Aguardando comando',{status:200}); //retorna a mensagem 'Aguardando comando' com status:200 e finaliza o script
        
            default:  //Caso não seja nenhuma das chaves anteriores passa para as chaves de seção do usuário
             if(userState.proces===''){return new Response('Nenhum processo iniciado')}
			
              switch (userState.state.toLowerCase()) {  //abre uma chave utilizando o estado do usuário em minúsculo
			      
                //CABEÇALHO DA PÁGINA
                  case 'waiting_section_cabecalho':
                    userState.state = 'waiting_logo_cabecalho';
                    await saveUserState(env, userId, userState);
                    await sendMessage(`Saudações sr. ${userName}!\n Vamos começar a configurar o cabeçalho da sua página web.\nPor favor me envie a imagem da logo da sua organização.:`,env);
                    break;

                  case 'waiting_logo_cabecalho':
					const img = await images(request, 'logoDoCabeçalho', env);
                    const logo = ['logoDoCabeçalho', img, 'img'];
					const coluns = ['nome', 'arquivo', 'tipo']
                    await dados('save',logo,['assets',logo],userId);  
                    userState.state = 'waiting_nome_cabecalho';	userState.dados.push(logo);
                    await saveUserState(env, userId, userState);  
                    await sendMessage(`Certo sr. ${userName}, vamos continuar com a configuração do cabeçalho do site!\n Me informe o nome da sua impresa.:`,env);
                      break;
					  
                  case 'waiting_nome_cabecalho':
                    await dados('save',messageText,'config',userId);  
                    userState.state = 'waiting_acessibilidade_cabecalho';  
                    await saveUserState(env, userId, userState);  
                    await sendMessage(`Ok sr. ${userName}, por fim me descreva a logo da sua impresa!\n(fins de acessibilidade).:`,env);
					  break;
					  
				case 'waiting_acessibilidade_cabecalho':
					userState.state = 'waiting_confirm_cabecalho';
					await saveUserState(env, userId, userState);
					await sendMessage(`Ok sr. ${userName}, `,env);
						break;
					  
			case 'waiting_confirm_cabecalho':
				await yesOrNo(messageText);
				await saveUserState(env, userId, null);
					break;

		      default:
				const mensagem = 'Comando ou estado de usuário desconhecido.';
			      	await sendMessage(mensagem, env);
			return new Response(mensagem, {status:200});
              }

        }
        return new Response('OK');
    }else{
      userState = null;
      await saveUserState(env, userId, userState); await sendMessage('Estado do usuário inesistente ou mensagem',env)
          return new Response('Estado do usuário inesistente',{status:500});
        }
	
}
    return new Response('OK');

    async function confirming(section){
      if (userState.select.array.length > 0 || userState.select.indice.length > 0) {
        let _indice = userState.select.indice;
        let subtitutos = `<b>${userState.titulo}</b>\n<i>${userState.texto}</i>`;
        let substituidos = `<b>${ _data[section][_indice][0]}</b>\n<i>${ _data[section][_indice][1]}</i>`;
        await sendMessage(`Deseja substituir:\n${substituidos}\n___\n<b><i>POR</i></b>\n___\n${subtitutos}`,env);
        await sendMessage("/SIM | /NAO",env);
        return new Response('ok')
    } else {
        await sendMessage(`<b>${userState.titulo}</b>\n<i>${userState.texto}</i>`,env);
        await sendMessage("Está correto?\n /SIM | /NAO",env);
        return new Response('ok')
    }
    }
    
    async function yesOrNo(section){
      if(section == 'bd' && userState.dados !== '' && await normalize(messageText) === 'sim'){
        const db = env.Data;
          const tabela = await normalize(userState.proces);
          const querySQL = `
            INSERT INTO ${String(tabela)} (id, titulo, legenda, apelido, url) 
            VALUES (?, ?, ?, ?, ?)  `;
            try{
              await sendMessage(userState.dados,env);
              await db.prepare(querySQL).bind(...userState.dados).run();
              userState=null;
              await saveUserState(env, userId, userState);
              await sendMessage('<b>salvo!</b> \n Reiniciar ( /comandos )?',env);
              return new Response('Salvo',{status:200});
              
            }catch (error){await sendMessage('Erro ao salvar dados',env); return new Response("Erro ao inserir dados:"+error.message, {status:500})}
          }else
	if(userState.state === 'waiting_ _data_dados_confirm'){
        
	   _data[section].push(...userState.dados); 
		await dados('save', [ _data,messageText], env, userId);
              return new Response('ok');
	}else
      if(userState.texto!=='' && await normalize(messageText) === 'sim'){
          if(userState.state === 'waiting_confirm_delet'){ //Verifica se o comando é para deletar os dados
              const {array, indice} = userState.select; //extrai o array eo indice armazenado no cache da seção

            if ( _data[array].length > indice) {
              const arrayLength =  _data[array].length; //Armazena o tamanho primário do array
               _data[array].splice(indice, 1); //Remove os dados e faz a reindexação o array
              await dados('save',  _data, env,userId); //Salva os dados no KV

              if( _data[array].length === arrayLength-1){ //Verifica se os dados foram deletados corretamente
                await sendMessage('<b>DELETADO!</b> / _data', env); //Envia a informação que os dados foram deletados 
                userState=null; //Reseta o cache carregado da seção
                await saveUserState(env, userId, userState); //Salva o cache da seção no arquivo KV 
                await processos('/ _data'); //chama o processo de reinicio da seção
              }else{await sendMessage('Falha ao deletar os dados!', env);} //Retorna a informção que houve falha ao deletar os dados
            }else{await sendMessage('Dados inexistentes', env);} //Retorna a informação que houve falha ao recuperar os dados

          }else
          if (userState.select.array.length > 0 || userState.select.indice.length > 0) {  
              let _indice = userState.select.indice;
              let _array = userState.select.array;
               _data[_array][_indice][0] = userState.titulo;
               _data[_array][_indice][1] = userState.texto;
          }else{
                   _data[section].push([String(userState.titulo), String(userState.texto)]);
                }
            
              await dados('save', [ _data,messageText], env,userId);
              return new Response('ok');
      }else
    if(await normalize(messageText) === 'nao'){
        userState.state = 'waiting_section_' + String(section);
        await saveUserState(env, userId, userState);
        await processos('');
        return new Response('ok');
    }else{await sendMessage('Comando desconhecido\n <i>Tente novamente</i>.', env)}
  }

}catch {console.log('Sem requisição WEBHOOK'); return new Response('ok',{status:200})}
}

	async function cep(numero) {
	    let numStr = numero.toString().replace(/\D/g, ''); // Converte o número para string e remove caracteres não numéricos
	return numStr.slice(0, 5) + '-' + numStr.slice(5);	// Formata como "XXXXX-XXX"
	}
	async function emailVerification(email) {
	    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	    return regex.test(email);
	}
	async function tel(numero) {
	    let digitos = numero.replace(/\D/g, '');
	    return `+${digitos.slice(0, 2)}(${digitos.slice(2, 4)})${digitos.slice(4, 9)}-${digitos.slice(9, 13)}`;
	}
	
  async function dados(mode,content,tabela,userId) {
    const _data = env.Data;
    try{
    switch(mode){
      
        case 'read':
          try{
              const query = `SELECT * FROM ${tabela[0]} LIMIT ? OFFSET ?`; //userName - dateAniversary - auth[PIN, PUK]
              const params = [10, tabela[1]];
              const results = await  _data.prepare(query).bind(...params).all();
              await sendMessage('<b>'+tabela[0]+'</b>\n'+results,env)
              return new Response('Dados recuperados e enviados para o usuário');}catch(error){await sendMessage('Erro ao ler banco de dados',env); return new Response('Erro ao ler banco de dados.',{status:422})}
                break;
              
                case 'save': // Inicia o case para a ação 'save'
                try {
                  if (!tabela || !tabela[0] || !tabela[1] || Object.keys(tabela[1]).length === 0) { // Verifica se a tabela e os dados são válidos
                    const mensagem = 'Dados ou tabela inválidos.'; // Mensagem de erro caso a tabela ou os dados sejam inválidos
                    await sendMessage(mensagem, env); // Envia a mensagem de erro
                    return new Response(mensagem, { status: 400 }); // Retorna uma resposta com status 400 (bad request)
                  }
              
                  const checkTableQuery = `SELECT name FROM sqlite_master WHERE type='table' AND name=?;`;  // Verifica se a tabela existe no banco de dados
                  const tableExists = await _data.prepare(checkTableQuery).bind(tabela[0]).all(); // Executa a consulta SQL
              
                  if (tableExists.length === 0) { // Se a tabela não existir, cria a tabela
                    const colunas = tabela[1].map(coluna => `${coluna} TEXT`).join(", ");
                    const createTableQuery = `
                      CREATE TABLE ${tabela[0]} (
                        id INTEGER PRIMARY KEY AUTOINCREMENT, // Criação de um campo 'id' como chave primária e autoincrementável
                        ${colunas} // As colunas criadas dinamicamente com base nos dados
                      );
                    `;
                    await _data.prepare(createTableQuery).run();  // Executa a criação da tabela
                    console.log(`Tabela ${tabela[0]} criada com sucesso.`); // Log no console indicando sucesso
                  }
              
                  // Prepara a consulta para inserir dados na tabela
                  const colunas = tabela[1].join(", ");
                  const valores = content.map(() => '?').join(", "); // Usando placeholders ('?') para os valores
              
                  // Comando SQL para inserção (não precisa se preocupar com o ID, o banco se encarrega disso)
                  const query = `
                    INSERT INTO ${tabela[0]} (${colunas})
                    VALUES (${valores});
                  `;
              
                  // Executa a inserção dos dados usando os valores fornecidos
                  await _data.prepare(query).run(tabela[1]); // Usa `Object.values` para passar os dados para os placeholders
              
                  const sucesso = 'Salvo com sucesso!';
                  await sendMessage(sucesso, env); // Envia a mensagem de sucesso para o usuário
                  return new Response(sucesso, { status: 200 }); // Retorna a resposta com status 200 para indicar sucesso
              
                } catch (error) { // Se ocorrer um erro, entra no bloco catch
                  const mensagem = 'Erro ao salvar dados no banco de dados'; // Mensagem de erro
                  console.error(error); // Log do erro para depuração
                  await sendMessage(mensagem, env); // Envia a mensagem de erro ao usuário
                  return new Response(mensagem, { status: 422 }); // Retorna uma resposta com status 422 (erro no processamento)
                }
                break;
              


  }
}catch(error){return new Response('Erro ao realizar a operação no banco de dados.',{status:422})}
  }
}	//Finaliza o handleRequest

async function sendMessage(message, env) {
  await new Promise(resolve => setTimeout(resolve, 500));
  const mensagem = encodeURIComponent(message);
  const telegramUrl = `https://api.telegram.org/bot${env.bot_Token}/sendMessage?chat_id=-4624902460&text=${mensagem}`;

  try {
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: -4624902460,
        text: message,
        parse_mode: "HTML",
      }),
    });

    const json = await response.json();
    if (!json.ok) {
      console.error("Erro ao enviar mensagem:", json);
      return new Response("Erro ao sendMessage mensagem", { status: 500 });
    }

    return new Response("Mensagem enviada com sucesso!", { status: 200 });
  } catch (error) {
    console.error("Erro ao conectar com a API do Telegram:", error);
    return new Response("Erro ao conectar com a API do Telegram", { status: 500 });
  }
}

async function loadUserState(env, userId) {
  const state = await env.sessionState.get(userId);  
  return state ? JSON.parse(state) : null;
}

async function saveUserState(env, userId, state) {
  await env.sessionState.put(userId, JSON.stringify(state));
}

async function recUser(userId, update, env) {
    const db = env.Data;
    const userState = loadUserState(env,userId);
    const userName = String(update.message.from.first_name + ' ' + update.message.from.last_name);
    try {
      // Consulta SQL para buscar dados do usuário com base no ID
      const result = await db.prepare('SELECT * FROM usuarios WHERE id = ?').bind(userId).all() || null; //userName - dateAniversary - auth[PIN, PUK]
  
      // Se o resultado não retornar nada, lança um erro
      if (result.rows.length === 0) {
        await saveUserState(env, userId, 'waiting_user_name')
        await sendMessage(`Olá sr.${userName} Vamos cadastra-lo no nosso banco de usuários!\nInforme seu nome completo.:`,env);
      }
  
      // Retorna os dados do usuário encontrado
      return result.rows[0]; // Retorna os dados do primeiro usuário encontrado
    } catch (error) {
      // Aqui podemos capturar qualquer erro que tenha ocorrido
      console.error('Erro ao recuperar dados do usuário:', error.message);
      // Retorna uma mensagem personalizada ou null em caso de erro
      return { error: error.message }; // Retorna uma mensagem de erro
    }
  }

// Função principal que lida com o processamento de imagens recebidas do Telegram e envio para o Mega.nz
async function images(update, fileName, env) {
  const BOT_TOKEN = env.bot_Token; // Recupera o token do bot do Telegram da variável de ambiente
  const MEGA_EMAIL = env.mega_email; // E-mail do Mega.nz da variável de ambiente
  const MEGA_PASSWORD = env.mega_password; // Senha do Mega.nz da variável de ambiente

  // Verifica se a mensagem contém uma foto
  if (!update.message || !update.message.photo) {
      console.error("Nenhuma imagem recebida.");
      return null; // Retorna null se não houver imagem na mensagem
  }

  // Pega a última foto na lista (melhor qualidade)
  let photos = update.message.photo;
  let file_id = photos[photos.length - 1].file_id; // Obtém o file_id da última imagem na lista (melhor qualidade)

  try {
      // 1️⃣ Obtém a URL do arquivo usando a API do Telegram
      let fileResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${file_id}`);
      let fileData = await fileResponse.json(); // Converte a resposta em JSON

      // Verifica se a resposta da API foi bem-sucedida
      if (!fileData.ok) {
          console.error("Erro ao obter o caminho do arquivo.");
          return null; // Retorna null se não conseguir obter a URL do arquivo
      }

      // Extrai o caminho do arquivo da resposta
      let file_path = fileData.result.file_path;
      // Constroi a URL completa para o arquivo
      let file_url = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file_path}`;

      // 2️⃣ Baixa a imagem do Telegram
      let imageResponse = await fetch(file_url); // Faz a requisição para obter a imagem
      let imageBlob = await imageResponse.blob(); // Converte a resposta em Blob (arquivo binário)
      let buffer = await imageBlob.arrayBuffer(); // Usa arrayBuffer diretamente no lugar do Buffer

      // 3️⃣ Realiza o login no Mega.nz
      const client = await loginToMega(MEGA_EMAIL, MEGA_PASSWORD); // Faz o login usando o e-mail e senha

      // 4️⃣ Envia a imagem para o Mega
      const uploadResult = await uploadFileToMega(client, buffer, fileName); // Faz o upload do arquivo para o Mega

      // Exibe o link do arquivo carregado no Mega
      console.log("Imagem salva no Mega:", uploadResult);

      return uploadResult; // Retorna o link do arquivo no Mega.nz

  } catch (error) {
      // Captura qualquer erro durante o processo
      console.error("Erro no processamento:", error);
      return null; // Retorna null em caso de erro
  }
}


// Função para realizar o login no Mega.nz e retornar os dados de autenticação
async function loginToMega(email, password) {
    const loginUrl = 'https://g.api.mega.nz/cs?id=0'; // URL de login da API do Mega.nz
    const payload = {
        "a": "us", // Ação de login (us) para autenticar o usuário
        "user": email, // E-mail do Mega.nz
        "password": password // Senha do Mega.nz
    };
    
    // Faz uma requisição POST para o Mega API para realizar o login
    const response = await fetch(loginUrl, {
        method: 'POST', // Método POST para enviar dados
        headers: {
            'Content-Type': 'application/json' // Cabeçalho indicando que o corpo da requisição é JSON
        },
        body: JSON.stringify(payload) // Corpo da requisição (os dados de login)
    });

    const data = await response.json(); // Converte a resposta da requisição em JSON
    
    // Verifica se a resposta contém um timestamp, indicando que o login foi bem-sucedido
    if (data.ts) {
        return data; // Retorna os dados de autenticação (token e chave)
    } else {
        throw new Error("Falha na autenticação."); // Lança erro se o login falhar
    }
}

// Função para fazer o upload de um arquivo para o Mega.nz
async function uploadFileToMega(authData, fileBuffer, fileName) {
    const uploadUrl = 'https://g.api.mega.nz/cs?id=0'; // URL de upload da API do Mega.nz
    
    // Monta o payload para enviar o arquivo (informações do arquivo e de autenticação)
    const uploadPayload = {
        "a": "up", // Ação de upload
        "n": fileName, // Nome do arquivo a ser enviado
        "s": fileBuffer.length, // Tamanho do arquivo (em bytes)
        "t": authData.t, // Token de autenticação retornado no login
        "k": authData.k // Chave de sessão retornada no login
    };

    // Faz a requisição POST para realizar o upload do arquivo
    const uploadResponse = await fetch(uploadUrl, {
        method: 'POST', // Método POST para enviar dados
        headers: {
            'Content-Type': 'application/json' // Cabeçalho indicando que o corpo da requisição é JSON
        },
        body: JSON.stringify(uploadPayload) // Corpo da requisição com os dados de upload
    });

    const uploadData = await uploadResponse.json(); // Converte a resposta da requisição em JSON
    
    // Verifica se o upload foi bem-sucedido (se "ok" estiver presente na resposta)
    if (uploadData && uploadData.ok) {
        return uploadData; // Retorna os dados de upload (incluindo o link do arquivo)
    } else {
        throw new Error("Erro no upload."); // Lança erro caso o upload falhe
    }
}



async function normalize(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/\s+/g, "_") // Substitui espaços por "_"
    .replace(/\//g, ""); // Remove barras
}
