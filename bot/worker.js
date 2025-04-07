export default { //Exporta as variáveis de ambientes
 
  async fetch(request, env, ctx) { //Faz a requisição asincrona das variaveis de ambiente e da requisição
    if (request.headers.get('X-Telegram-Bot-Api-Secret-Token') === '5354wD0f0D0f054w705') { //Verifica se a requisição vem do bot do telegram
    return handleRequest(request, env); //Chama a função que trata a requisição do telegram
  }else if(request.headers.get('X-Page-Token')==='lrbb1lrp00wp1w3I1l70b4r8r570'){ //verifica se a página que esta solicitando esta autorizada a receber os dados
     // return handleJson(request, env);  //Chama a função que envia os dados para a hospedagem
  }else{ 
    /*await sendMessage('Acesso Negado',env);*/ return new Response('Acesso Negado',{status:200})} //Caso não for uma hospedagem autorizada ou o bot do telegram nega o acesso
  },
};

async function handleRequest(request, env) {  //Função que trata a requisição do Webhook
  await new Promise(resolve => setTimeout(resolve, 1000));  //Aguarda 1 segundo para começar a rodar o script
 // await sendMessage('promise OK',env);
  const url = new URL(request.url)|| null;  //Captura a url da requisição
  if (!url) { //Verifica se a url é válida
    //await sendMessage('URL fail',env);
    return new Response("URL inexistente", { status: 500 });  //Caso não seja válida retorna 'URL inesistente' e 'status:500'
  }else{ //Se URL for válida
    try{
     // await sendMessage('url OK',env);
      const update = await request.json();  //captura o Json da requisição
     // await sendMessage('request OK',env);
      const chatId = Number(update.message.chat.id);  //Captura o identificador do chat e define como number
      const userId = Number(update.message.from.id);  //captura o identificador do usuário que fez a requisição e define como number
      const userName = String(update.message.from.first_name + ' ' + update.message.from.last_name);  //captura o nome do usuário que fez a requisição e define como string
      let messageText;
      if (update.message.photo) {
        //await sendMessage('Contain image', env);  // Corrected typo
        const photos = update.message.photo;
        messageText = photos[photos.length - 1].file_id;  // Get the highest quality photo
       //await sendMessage(messageText + ' OK', env);  // Send the file_id with "OK"
    }else{
        messageText = String(update.message.text);    //captura o texto da mensagem do emissor e define como String
      }

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
   //await sendMessage('log2', env);
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
      if(userState.procesCont>3){await sendMessage('falha na requisição', env); await saveUserState(env, userId, null);return new Response('Falha na requisição');} //Verifica se a quantidade de processos é maior que 3. Se for falha a requisição
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
             if(userState.proces===''){return new Response('Nenhum processo iniciado'); await sendMessage('inicie um processo',env);}
			
              switch (userState.state.toLowerCase()) {  //abre uma chave utilizando o estado do usuário em minúsculo
			      
                //CABEÇALHO DA PÁGINA
                  case 'waiting_section_cabecalho':
                    userState.procesCont = 0;
                    userState.state = 'waiting_logo_cabecalho';
                    await saveUserState(env, userId, userState);
                    await sendMessage(`Saudações sr. ${userName}!\n Vamos começar a configurar o cabeçalho da sua página web.\nPor favor me envie a imagem da logo da sua organização.:`,env);
                    break;

                  case 'waiting_logo_cabecalho':
                    userState.procesCont = 0;
                    //await sendMessage(messageText,env);

                      const agora = new Date();
                      const img = await image(messageText, 'logoDoCabeçalho'+ await normalize(agora.toISOString().split('T')[0].replace(/-/g, '') + agora.getMinutes().toString().padStart(2, '0')), env);
                      const logo = [img, 'img'];
                      const coluns = 'nome,tipo';
                      userState.select.push(await dados('save',logo,['assets',coluns],userId));
                      userState.state = 'waiting_nome_cabecalho';	//userState.dados.push(logo);
                      await saveUserState(env, userId, userState);  
                      await sendMessage(`Certo sr. ${userName}, vamos continuar com a configuração do cabeçalho do site!\n Me informe o nome da sua impresa.:`,env);
                        break;
					  
                  case 'waiting_nome_cabecalho':
                    userState.procesCont = 0;
                      const nome = [messageText, 'text'];
                      userState.select.push(await dados('save', nome, ['assets','nome, tipo'], userId));
                      userState.state = 'waiting_acessibilidade_cabecalho';  
                      await saveUserState(env, userId, userState);  
                      await sendMessage(`Ok sr. ${userName}, por fim me descreva a logo da sua impresa!\n(fins de acessibilidade).:`,env);
                        break;

                  case 'waiting_acessibilidade_cabecalho':
                    userState.procesCont = 0;
                      const acessibilidade = [messageText, 'text'];
                      userState.select.push(await dados('save', acessibilidade, ['assets','nome, tipo'], userId));
                      userState.state = 'waiting_botao_cabecalho';
                      await saveUserState(env, userId, userState);// null
                      await sendMessage(`${userName}\n, o sr. Deseja adicionar um novo botão ao menu?\n /adicionarBotao | /continuar`, env);
                        break;
                  
                  case 'waiting_botao_cabecalho':
                    userState.procesCont = 0;
                    switch(messageText){

                      case '/adicionarBotao':
                        userState.state = 'waiting_nome_botao_cabecalho';
                        await saveUserState(env, userId, userState);
                        await sendMessage(`Certo srª. ${userName}\n Informe o nome do botão que deseja adicionar.:`,env);
                          break;
                      
                          case '/continuar':
                            //await sendMessage('log', env);
                            userState.state = 'waiting_confirm_cabecalho';
                            const dataId = userState.select;
                          
                            try {
                              // Logo
                              const logoId = (await dados('read', dataId[0], 'assets', userId)).nome; //await sendMessage('Id logo OK: ' + logoId, env);
                                  const dataLogo = await downloadGdrive(logoId, env); // Descomente se for usar
                              const dataName = (await dados('read', dataId[1], 'assets', userId)).nome; //await sendMessage('Nome OK: ' + dataName, env);
                              const dataAcss = (await dados('read', dataId[2], 'assets', userId)).nome; //await sendMessage('Acessibilidade OK: ' + dataAcss, env);
                          
                              // Botões
                              let databtn = '';
                              if (Array.isArray(dataId[3])) {
                                for (let i = 0; i < dataId[3].length; i++) {
                                  const resultado = await dados('read', dataId[3][i], 'assets', userId);
                                  const nome = resultado?.nome;
                          
                                  if (typeof nome === 'string' && nome.includes(',')) {
                                    const [rotulo, url] = nome.split(',').map(s => s.trim());
                                    databtn += `${i + 1} - Rótulo: ${rotulo} - URL: ${url}\n`;
                                  } else {
                                    await sendMessage(`❗ Botão ${i + 1}: nome inválido no ID ${dataId[3][i]}`, env);
                                  }
                                }
                              }
                          
                              const dataHeader = `Nome = ${dataName}\nBotões = [\n${databtn}]`;
                              await sendMessage(`Sr. ${userName}, por gentileza confirme os dados do cabeçalho.\n\n${dataHeader}`, env);
                          
                              // Enviar mídias se estiver ativado
                              await sendMidia([dataLogo, dataAcss], env);
                          
                            } catch (error) {
                              await sendMessage(`❌ Erro: ${error.message || error}`, env);
                            }
                          
                            await sendMessage(`Está correto? /SIM | /NAO`, env);
                            await saveUserState(env, userId, userState);
                            break;
                          
                      
                          default:
                            await sendMessage(`${userName}\n, o sr. Deseja adicionar um novo botão ao menu?\n /adicionarBotao | /continuar`, env);
                    }
                        break;

                    case 'waiting_nome_botao_cabecalho':
                      userState.procesCont = 0;
                      userState.titulo = messageText+', ';
                      userState.state = 'waiting_url_botao_cabecalho';
                      await saveUserState(env, userId, userState);
                      await sendMessage(`Certo srª. ${userName}\n Informe a URL do botão que deseja adicionar.:`,env);
                          break;
                    
                    case 'waiting_url_botao_cabecalho':
                      userState.procesCont = 0;
                      userState.titulo += messageText;
                      const [rotulo, url] = userState.titulo.split(',');
                      userState.state = 'waiting_confirm_botao_cabecalho';
                      await saveUserState(env, userId, userState);
                      await sendMessage(`Certo srª. ${userName}\n Por gentileza confirme se o botão esta correto.:\nRótulo - ${rotulo}\nURL - ${url}`,env);
                      await sendMessage(`Esta correto? /SIM | /NAO`,env);
                          break;

                    case 'waiting_confirm_botao_cabecalho':
                      userState.procesCont = 0;
                      switch(messageText){
                        case '/SIM':
                          const btData = await dados('save', [userState.titulo,'btn'], ['assets','nome, tipo'], userId);
                          if(!userState.select[3]){
                                userState.select.push([]);
                            }
                          userState.select[3].push(btData);
                          userState.state = 'waiting_botao_cabecalho';
                          userState.titulo = '';
                          await saveUserState(env, userId, userState);
                          await sendMessage(`Deseja adicionar outro botão?\n /adicionarBotao /continuar`, env);
                            break;
                        
                        case '/NAO':
                          await sendMessage(`Sr. ${userName}, deseja /cancelar ou /reiniciar ?`, env)
                            break;
                        
                        case '/reiniciar':
                          const bt = userState.select.length - 1;
                          userState.select[bt]=[];
                          userState.state = 'waiting_nomeBotao_cabecalho';
                          await saveUserState(env, userId, userState);
                          await sendMessage(`Certo srª. ${userName}\n Informe o nome do botão que deseja adicionar.:`, env);
                            break;

                            default:
                              userState.state = 'waiting_botao_cabecalho';
                              userState.titulo = '';
                              await saveUserState(env, userId, userState);
                              await sendMessage(`Certo srª. ${userName}\n Por gentileza confirme se o botão esta correto.:\nRótulo - ${userState.select[bt][0]}\nURL - ${userState.select[bt][1]}`,env);
                            }
                        break;
                          
                    case 'waiting_confirm_cabecalho':
                      userState.procesCont = 0;
                      const dataHeader = [(JSON.stringify(userState.select)),'indexHeader']
                      await yesOrNo(dataHeader,['config','nome,tipo']);
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
      await saveUserState(env, userId, null); await sendMessage('Estado do usuário inesistente ou mensagem',env)
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
    
    async function yesOrNo(content, tabela){
      switch(messageText){
        case '/SIM':
         try{
          const result = await dados('save',content,tabela,userId);
              await sendMessage('Salvo com sucesso!',env)
              }catch(error){await sendMessage('Erro ao salvar dados:'+error, env);}
            break;

        case '/NAO':

      }
  }

}catch {await sendMessage('Sem requisição WEBHOOK'); return new Response('ok',{status:200})}
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
        try {
            const messageErro = 'Nenhum dado encontrado';
            const _tabela = Array.isArray(tabela) ? tabela[0] : tabela; // Garantindo que é uma string válida
            if (!_tabela) throw new Error('Nome da tabela inválido');
    
            const query = `SELECT * FROM ${_tabela} WHERE id = ?`;
            const data = await _data.prepare(query).bind(content).first();
    
            if (!data) throw new Error(messageErro);
            return data;
        } catch (error) {
            await sendMessage(`Erro ao buscar dados: ${error.message}`, env);
            return { success: false, message: error.message };
        }
          break;
    


        case 'readLimit':
          try{
              const query = `SELECT * FROM ${tabela[0]} LIMIT ? OFFSET ?`; //userName - dateAniversary - auth[PIN, PUK]
              const params = [10, tabela[1]];
              const results = await  _data.prepare(query).bind(...params).all();
              await sendMessage('<b>'+tabela[0]+'</b>\n'+results,env)
              return new Response('Dados recuperados e enviados para o usuário');}catch(error){await sendMessage('Erro ao ler banco de dados',env); return new Response('Erro ao ler banco de dados.',{status:422})}
                break;
              
        case 'save': // Inicia o case para a ação 'save'
          try {
            // Verifica se a tabela e os dados são válidos
            if (!tabela || !tabela[0] || !tabela[1] || Object.keys(tabela[1]).length === 0) {
              const mensagem = 'Dados ou tabela inválidos.'; // Mensagem de erro caso a tabela ou os dados sejam inválidos
              await sendMessage(mensagem, env); // Envia a mensagem de erro
              return new Response(mensagem, { status: 400 }); // Retorna uma resposta com status 400 (bad request)
            }

            // Verifica se a tabela existe
const tableExists = await _data.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?;`).bind(tabela[0]).all();

// Se a tabela não existir, cria a tabela
if (tableExists.results.length === 0) {  // Verifica se a tabela existe
  try {
    // Formata as colunas para a criação da tabela
    const colunas = tabela[1].split(',').map(coluna => `"${coluna.trim()}" TEXT`).join(", ");

    // Criação da query para a tabela diretamente no prepare
    await _data.prepare(`
      CREATE TABLE "${tabela[0]}" (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        ${colunas}
      );
    `).run();  
    
    await sendMessage(`Tabela "${tabela[0]}" criada com sucesso.`, env);
  } catch (error) {
    // Caso haja algum erro ao tentar criar a tabela
    const mensagemErro = `Erro ao criar a tabela ${tabela[0]}.`;
    console.error(mensagemErro, error);
    await sendMessage(`${mensagemErro} - ${error.message}`, env);
    return new Response(`${mensagemErro} - ${error.message}`, { status: 500 }); // Retorna erro de servidor
  }
} else {
  // A tabela já existe, envia uma mensagem de confirmação
 // await sendMessage(`Tabela "${tabela[0]}" já existe.`, env);
}


            // Cria a string de placeholders para inserção (um "?" para cada valor)
            const valores = content.map(() => '?').join(", ");
                    if (content.length !== tabela[1].split(',').length) {
                      const mensagem = 'Número de valores e colunas não batem.';
                      await sendMessage(mensagem, env);
                      return new Response(mensagem, { status: 400 }); // Retorna resposta com erro
                    }
            // Cria a consulta SQL para inserir os dados
            const query = "INSERT INTO " + tabela[0] + " (" + tabela[1] + ") VALUES (" + valores + ")";
            ;

            // Envia as informações para o envio colunas
           // await sendMessage(`${valores} - ${tabela[1]}\n - ${content}\n\n${query}`, env);

            // Executa a inserção dos dados usando os valores fornecidos
            await _data.prepare(query).bind(...content).run(); // Usa `content` para passar os dados para os placeholders

            const sucesso = 'Salvo com sucesso!';
            await sendMessage(sucesso, env); // Envia a mensagem de sucesso para o usuário
            const lastInsertId = await _data.prepare("SELECT last_insert_rowid() AS id").first()
            return lastInsertId.id.toString();

          } catch (error) { // Se ocorrer um erro, entra no bloco catch
            const mensagem = 'Erro ao salvar dados no banco de dados'; // Mensagem de erro
            console.error(error); // Log do erro para depuração
            await sendMessage(`${mensagem} - ${error.message}`, env); // Envia a mensagem de erro ao usuário
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
  const [botToken, chatId] = env.bot_Token.join(',')
  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=-4774731816&text=${mensagem}`;

  try {
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    const json = await response.json();
    if (!json.ok) {
      console.error("Erro ao enviar mensagem:", json);
      return new Response("Erro ao enviar mensagem", { status: 500 });
    }

    return new Response("Mensagem enviada com sucesso!", { status: 200 });
  } catch (error) {
    console.error("Erro ao conectar com a API do Telegram:", error);
    return new Response("Erro ao conectar com a API do Telegram", { status: 500 });
  }
}

async function sendMidia(midia, env) {
  await new Promise(resolve => setTimeout(resolve, 500));

  const isArray = Array.isArray(midia);
  const file = isArray ? midia[0] : midia;
  const caption = isArray ? midia[1] || '' : '';
  const [botToken, chatId] = env.bot_Token.join(',')

  const formData = new FormData();
  formData.append('chat_id', chatId);
  formData.append('document', new Blob([file.buffer], { type: file.mimeType }), file.name);
  formData.append('caption', caption);
  formData.append('parse_mode', 'HTML');

  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendDocument`;

  try {
    const response = await fetch(telegramUrl, {
      method: 'POST',
      body: formData // ❗ NÃO adicione Content-Type aqui
    });

    const result = await response.json();

    if (!result.ok) {
      console.error("Erro ao enviar arquivo:", result);
      return new Response("Erro ao enviar arquivo", { status: 500 });
    }

    return new Response("✅ Arquivo enviado com sucesso!", { status: 200 });

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

  async function image(fileId, name, env){
    try{  
     // await sendMessage('recuperando imagem...', env);
        const fileBuffer = await recFile(fileId, env);
     // await sendMessage('Arquivo recuperado com sucesso!', env);

      //await sendMessage('convertendo arquivo...',env);
      //  const webpBuffer = await convertToWebP(fileBuffer,env);
      //await sendMessage('Convertido com sucesso!',env);

      //await sendMessage('Enviando para o armazenamento...', env);
      const gDrive =  await uploadGdrive(fileBuffer, name, 'image/png', env);
      //await sendMessage('Arquivo salvo com sucesso!', env);

      return gDrive.toString();
    }catch(error){  await sendMessage('Alerta.: ' + error, env); return new Response('Alerta.: '+error, {status:400}); }
  }

  async function recFile(fileId, env) {
   try{
    const botToken = (env.bot_Token.split(','))[1];
    const fileUrl = `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`;
    const fileResponse = await fetch(fileUrl);
    const fileData = await fileResponse.json();
    
    if (!fileData.result || !fileData.result.file_path) {
        throw new Error("Erro ao obter arquivo do Telegram");
    }

    return `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
  }catch(error){  await sendMessage('Erro: ' + error, env); return new Response('Erro: ' + error,{status: 400});  }
}

async function getAccessToken(env) {
  const tokensG = env.tokens_G;
  const [GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, DRIVE_FOLDER_ID] = tokensG.split(',');
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: GOOGLE_REFRESH_TOKEN,
        grant_type: 'refresh_token'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to retrieve access token');
    }

    const data = await response.json();
    //await sendMessage('Access token retrieved successfully', env);
    return data.access_token || null;
  } catch (error) {
    await sendMessage(`Error retrieving access token: ${error.message}`, env);
    return null;
  }
}

async function uploadGdrive(fileUrl, filename, mimeType, env) {
  
  const DRIVE_FOLDER_ID = (env.tokens_G.split(','))[3];
        const MAX_UPLOAD_ATTEMPTS = 3;
        const accessToken = await getAccessToken(env);
//  bot_Token
        if (!accessToken) {
          return new Response(JSON.stringify({ success: false, message: 'Failed to retrieve access token' }), { status: 500 });
        }

        // Baixar o arquivo do link
        //await sendMessage(`Baixando arquivo de: ${fileUrl}`, env);
        const fileResponse = await fetch(fileUrl);
        
        if (!fileResponse.ok) {
          return new Response(JSON.stringify({ success: false, message: 'Erro ao baixar o arquivo' }), { status: 500 });
        }
        
        const fileBuffer = await fileResponse.arrayBuffer();
        const fileBlob = new Blob([fileBuffer], { type: mimeType });

        // Detect file extension from MIME type
        const ext = mimeType.split('/')[1]; // Exemplo: 'image/jpeg' -> 'jpeg'
        const fileExtension = ext ? `.${ext}` : '';

        // Garantir que o nome do arquivo tenha a extensão correta
        const fullFilename = filename.endsWith(fileExtension) ? filename : `${filename}${fileExtension}`;

        const metadata = {
          name: fullFilename,
          parents: [DRIVE_FOLDER_ID]
        };

        const formData = new FormData();
        formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        formData.append('file', fileBlob, fullFilename);

        for (let attempt = 1; attempt <= MAX_UPLOAD_ATTEMPTS; attempt++) {
          try {
            const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
              method: 'POST',
              headers: { Authorization: `Bearer ${accessToken}` },
              body: formData
            });

            if (!response.ok) {
              throw new Error(`Failed to upload file (HTTP ${response.status})`);
            }

            const result = await response.json();
            //await sendMessage(`File uploaded successfully: ${fullFilename}`, env);
            //return new Response(JSON.stringify({ success: true, message: 'File uploaded successfully', data: result }), { status: 200 });
            return result.id;

          } catch (error) {
            await sendMessage(`Error uploading file (Attempt ${attempt} of ${MAX_UPLOAD_ATTEMPTS}): ${error.message}`, env);

            if (attempt === MAX_UPLOAD_ATTEMPTS) {
              return new Response(JSON.stringify({ success: false, message: 'Max upload attempts reached' }), { status: 500 });
            }
          }
      }
}

async function downloadGdrive(fileId, env) {
  const MAX_DOWNLOAD_ATTEMPTS = 3;
  const RETRY_DELAY = 2000;

  const accessToken = await getAccessToken(env);
  if (!accessToken) {
    await sendMessage("❌ Falha ao obter access token.", env);
    throw new Error("Failed to retrieve access token");
  }

  for (let attempt = 1; attempt <= MAX_DOWNLOAD_ATTEMPTS; attempt++) {
    try {
      await sendMessage(`🔁 Tentativa ${attempt} de obter metadados do arquivo`, env);

      // 1. Obter metadados (nome do arquivo)
      const metadataRes = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?fields=name`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (metadataRes.status === 404) {
        await sendMessage("❌ Arquivo não encontrado (404). Verifique o fileId e permissões.", env);
        throw new Error("File not found");
      }

      if (!metadataRes.ok) {
        await sendMessage(`❌ Falha ao obter metadados (HTTP ${metadataRes.status})`, env);
        throw new Error(`Failed to fetch file metadata (HTTP ${metadataRes.status})`);
      }

      const metadata = await metadataRes.json();
      const fileName = metadata.name || `${fileId}.bin`;

      await sendMessage(`📁 Nome do arquivo: ${fileName}`, env);

      // 2. Fazer download do arquivo
      const fileRes = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (!fileRes.ok) {
        await sendMessage(`❌ Falha ao baixar o arquivo (HTTP ${fileRes.status})`, env);
        throw new Error(`Failed to download file (HTTP ${fileRes.status})`);
      }

      const arrayBuffer = await fileRes.arrayBuffer();

      await sendMessage(`✅ Download concluído com sucesso!`, env);

      return {
        buffer: arrayBuffer,
        name: fileName,
        mimeType: fileRes.headers.get("content-type") || "application/octet-stream"
      };

    } catch (err) {
      await sendMessage(`⛔ Tentativa ${attempt} falhou: ${err.message}`, env);

      if (attempt < MAX_DOWNLOAD_ATTEMPTS) {
        await sendMessage("⏳ Nova tentativa em 2 segundos...", env);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      } else {
        await sendMessage("🚫 Número máximo de tentativas atingido.", env);
        throw new Error("Max download attempts reached");
      }
    }
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

async function hash(user, password) {
  const encoder = new TextEncoder();
  let key = encoder.encode(password);

  // Criando um hash iterativo da senha (Mega.nz usa 65536 iterações)
  for (let i = 0; i < 65536; i++) {
    const  keyHash = await crypto.subtle.digest("SHA-256", key);
  }

  const keyBytes = new Uint8Array(key);
  const emailBytes = encoder.encode(user);
  const mergedBytes = new Uint8Array(keyBytes.length + emailBytes.length);
  mergedBytes.set(keyBytes);
  mergedBytes.set(emailBytes, keyBytes.length);

  const userHash = await crypto.subtle.digest("SHA-256", mergedBytes);
  return Array.from(new Uint8Array(userHash))
      .map(byte => byte.toString(16).padStart(2, "0"))
      .join("");
}