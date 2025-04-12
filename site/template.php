<?php  //users - assets - config
$bgbody='';$title='farm';
require ('../WaranasLibrary/waranas.php');
 $section=[];$grids=[];
$produtos=[];

//Carregar dados do bot
$url = '';
    $pageToken = '';
    $parametro = '';
    $authToken = '';
    $dataHeader = getJsonData($url, $parametro, $authToken, $pageToken);

    $head[]='<script src="https://kit.fontawesome.com/b42a2f6a22.js" crossorigin="anonymous"></script>';
  $menu=[['url'=>'contato.html','content'=>'Contato'],['url'=>'sm.html','content'=>'Saiba mais...']];

if(filter_image($data_header[1])){$data_header[1]=null}	//'Logo' - 'Nome do comercio' - 'descrição breve da imagem' / [botões do menu]
	$header[]= "<img aria-label='Imagem de logo do {$data_header[0]}' alt='logo do {$data_header[0]' id='logo' loading='lazy' title='logo {$data_header[0]}' src='{$data_header[1]}'><h1 class='ttl' id='topo'>{$data_header[0]}</h1>";}
 
	$header[]= menu($menu,'#F2EDF0');
  $section[]= '<figure id="img"></figure>';
  $section[]= '<h1 class="ttl">Conheça Nosso comércio</h1><p>Na Farmácia Farmacêutica, o seu atendimento é a nossa maior prioridade. Nossa equipe está dedicada a oferecer um serviço personalizado e atencioso. Venha viver a diferença de um atendimento que realmente cuida de você e aproveite ofertas especiais feitas para suas necessidades!</p><a>Entre em Contato</a>'; 
	
	$main[] = section('hero',$section);

	
	$main[]= grid('pdt',$produtos,'Promoções e Ofertas');
	$main[]="	<div id='banners'><div class='banner'><h1>Nossos Serviços</h1>
				<aside><h2>Atendimento eficiente</h2>Suporte para resolver dúvidas, problemas ou fornecer informações sobre produtos e serviços.</aside>
				<aside><h2>Consultoria</h2>Serviços especializados para ajudar empresas ou indivíduos a resolver problemas específicos, melhorar processos ou alcançar objetivos.</aside>
				<aside><h2>Entrega Rápida</h2>Serviço de entrega eficiente e segura para sua conveniência.</aside>
				</div>
			<div class='banner'><h1>Opiniões de clientes</h1>
				<aside>'Atendimento impecável e produtos de alta qualidade. A melhor farmácia da região!'<h2>- Maria Oliveira</h2></aside>
				<aside>'Sempre encontro o que preciso e o atendimento é excelente. Recomendo a todos!'<h2>- João Santos</h2></aside>
                <aside>'Serviço de limpeza impecável, minha casa nunca esteve tão limpa! Super recomendo.'<h2>- Ana Costa</h2></aside>
                <aside>'Atendimento rápido e eficiente. Sempre solucionam minhas dúvidas com muita paciência.'<h2>- João Silva</h2></aside>
				</div>
			 <div id='contact'><h1>Entre em Contato</h1>
                ".formwhats('ctt1','62994805555','#CA0011')."
                </div></div>";
    $footer[]="<h1> Desenvolvido por: @victor.macedo2001 | E-mail:victormacedo2001@hotmail.com <a href='#topo' style='font-size:1.5rem;position:absolute;bottom:1;right:1vw;'><i class='fa-solid fa-arrow-up'style='color:#ffffff;'></i></a>";

$style[]='
    *{font-family:arial,roboto,sans-serif;}
    body, html{overflow-x:hidden;}
    main{display:flex;flex-direction:column;justify-content:start;align-items:center;overflow-x:hidden;overflow-y:visible;}
    header{width:100vw;box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);position:relative;display:flex;flex-direction:column;text-align:center;justify-content:space-between;background:#C10010;color:; height:auto;
    position: sticky;
    }
    header .ttl, footer h1{color:#EAE5E7;}header .ttl{font-size:3rem;
  }
    .navegation{border-bottom:groove 0.01rem rgba(79,79,79,0.3)}.navegation a{color:#CA0011;}

    .hero{width:100vw;padding:0.9rem 0;display:flex;flex-direction:column;align-items:center;justify-content:space-around;background:#F2EEED;box-shadow: 0 4px 8px rgba(90, 90, 90, 0.2);}
    #img{width:90vw;height:45vw;border-radius:1.2vh;background:#F1EDEF;background:#c3c3c3;background-size:cover;}
    .hero .ttl{font-size:3.3rem;color:#CA0011;text-align:center;font-weight:bold;}
    .hero p{width:69vw;font-size:1.2rem;color:#666666;text-align:center;line-height:2.1rem;}
    .hero a{padding:1.2vw 2.1vw;border-radius:0.6vh;background:#C10010;color:#FFFFFF;font-size:1.2rem;text-align:center;}
    #pdt,#pdt h1{color:#C10010;background:#F2EEED;}
    #banners{width:81vw;min-height:auto;gap:3vw;display:flex;flex-wrap:wrap;}
        #banners div{width:24vw;padding:1.8rem 0;display:flex;flex-direction:column;gap:3rem;justify-content:start;align-items:center;background:#F2EEED;border-radius:0.9rem;}
            #banners div h1{width:84%;max-height:12%;display:flex;align-items:center;color:#C10010;border-bottom:solid 0.3rem #C10010;}
            #banners div aside{width:90%;color:#787878;background:#F1EDEF;border-left:solid 0.6rem #C10010;border-radius:0.9rem;padding:1.5rem;box-shadow:1px 1px 3px 3px rgba(78,78,78,0.3);}#banners div aside h2{color:#C10010;}

    footer{margin-top:9rem;padding:0.9rem;background:#C10010;}footer h1{font-size:0.9rem;}
  ';
$mobile[]="
    #banners {width:100vw}
        #banners div{width:45%;}
            #banners div h1{font-size:1.5rem;}
            #banners div aside{min-width:81%;padding:0.3rem;text-align:center;}
            #banners div aside h2{font-size:1.2rem;}
            #banners #contact{width:93%;}
   .hero{padding-top:1.2rem;}
";

$script[]="
let lastScrollTop = 0;
const header = document.querySelector('header .ttl');
const main = document.querySelector('main');

function handleScroll() {
    const scrollTop = main.scrollTop;

    if (scrollTop > lastScrollTop) {
        // Rolando para baixo
        header.style = 'display:none;opacity:0;';
    } else {
        // Rolando para cima
        header.style= 'display:flex;';
    }
    lastScrollTop = scrollTop;
}

// Adicionando o evento de rolagem ao main
main.addEventListener('scroll', function() {
    if (window.innerWidth < 990) {
        handleScroll();
    }
});

// Opcional: adicionar um listener para redimensionamento da janela
window.addEventListener('resize', function() {
    if (window.innerWidth >= 990) {
        // Caso a largura seja maior ou igual a 990px, reseta a transformação do cabeçalho
        header.style.display = 'flex';
    }
});

        ";
html('real-time');
