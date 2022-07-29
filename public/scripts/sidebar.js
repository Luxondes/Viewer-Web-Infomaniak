// script pour affichage des menus
import { mainRender } from "./heightMap.js";



	// script pour agrandir le menu
        let sidebar = document.querySelector(".sidebar");
		let menu_button = document.querySelector("#menu_button");

		menu_button.addEventListener("click", ()=>{
			sidebar.classList.toggle("open");
			menuBtnChange();
		});
		// fonction qui change le css du menu
		function menuBtnChange() {
			if(sidebar.classList.contains("open")){
				menu_button.classList.replace("bx-menu", "bx-menu-alt-right");
			}else {
				menu_button.classList.replace("bx-menu-alt-right","bx-menu");
			}
		}



	// script pour gerer l'ouverture des sous-menus
		// on récupère tout les boutons
		let data_button = document.querySelector("#data_button");
		let option_button = document.querySelector("#option_button");
		let files_button = document.querySelector("#files_button");
		let graph_button = document.querySelector("#graph_button");
		let setting_button = document.querySelector("#setting_button");
		// liste des status de chaque sous-menu, dans l'ordre (status[i] = true   =>  menu i est caché )
		let liste_status = [true, true, true, true, true];
		// liste des sous-menus à afficher ou non, dans l'ordre
		let liste_menus = [document.querySelector("#data"), document.querySelector("#option"), document.querySelector("#files"), document.querySelector("#graph"), document.querySelector("#setting")];

		// affecte la fonction d'affichage de chaque sous-menu avec système d'index
		data_button.addEventListener("click", ()=>{hide(0)});
		option_button.addEventListener("click", ()=>{hide(1)});
		files_button.addEventListener("click", ()=>{hide(2)});
		graph_button.addEventListener("click", ()=>{hide(3)});
		setting_button.addEventListener("click", ()=>{hide(4)});

		// fonction pour afficher ou non les sous-menus
		// pour afficher/cacher un élément, on lui ajoute ou non la classe 'hidden' qui fait un 'display: none;' dans le css
		function hide(i){

			// si menu i est caché
			if (liste_status[i]){
				// affiche et modifie statut dans la liste des status
				liste_menus[i].classList.remove('hidden');
				liste_status[i] = false;

				// on cache tout les autres sous-menus de la même façon
				for (let index = 0; index < liste_status.length; index++) {
					if ((index != i ) && !(liste_status[index])){
						liste_menus[index].classList.add('hidden');
						liste_status[index] = true;
					}
				}
			}else{
				// sinon cache simplement et modifie statut dans la liste des status
				liste_menus[i].classList.add('hidden');
				liste_status[i] = true;
			}
		}
	


	//script pour retirer un des data du rendu
		let remove_data_1 = document.querySelector("#remove_file_1");
		let remove_data_2 = document.querySelector("#remove_file_2");

		// remove data 1
		remove_data_1.addEventListener("click", ()=>{

			//on remet toutes les valeurs globales concernant le data 1 par defaut
			is_data_1_empty = true;
			is_sphere_1 = false;
			size_X_1 = 1;
			size_Y_1 = 1;
			lines_number_X_1 = null;
			lines_number_Y_1 = null;
			data_tab_1 = null;

			// on retire l'image et le xml des menus concernant le data 1
			let gallery = document.getElementById("gallery_1");
            if (gallery.firstElementChild){gallery.removeChild(gallery.firstElementChild);}
			let container = document.getElementById("container_1");
            if (container.firstElementChild){container.removeChild(container.firstElementChild);}

			// on retire les options du rendu 1
			document.getElementById("render_options_1").classList.add('hidden');
			document.getElementById("file_1").classList.add('hidden');

			// s'il n'y a plus de data 1 et qu'il n'y avais pas de data 2, on retire les menus qui apparaisent lors de la présence d'un seul des datas (exemple: graphe)
			if (is_data_2_empty){
				document.getElementById("coupe_options").classList.add('hidden');
                document.getElementById("render_options_3").classList.add('hidden');
			}

			// on supprime le rendu pour le recommencer sans les data 1
			section.removeChild(document.getElementById ("canvas"));
			mainRender();
		});
		
		// remove data 2
		remove_data_2.addEventListener("click", ()=>{

			//on remet toutes les valeurs globales concernant le data 2 par defaut
			is_data_2_empty = true;
			is_sphere_2 = false;
			size_X_2 = 1;
			size_Y_2 = 1;
			lines_number_X_2 = null;
			lines_number_Y_2 = null;
			data_tab_2 = null;

			// on retire l'image et le xml des menus concernant le data 2
			let gallery = document.getElementById("gallery_2");
            if (gallery.firstElementChild){gallery.removeChild(gallery.firstElementChild);}
			let container = document.getElementById("container_2");
            if (container.firstElementChild){container.removeChild(container.firstElementChild);}

			// on retire les options du rendu 2
			document.getElementById("render_options_2").classList.add('hidden');
			document.getElementById("file_2").classList.add('hidden');

			// s'il n'y a plus de data 2 et qu'il n'y avais pas de data 1, on retire les menus qui apparaisent lors de la présence d'un seul des datas (exemple: graphe)
			if (is_data_1_empty){
				document.getElementById("coupe_options").classList.add('hidden');
                document.getElementById("render_options_3").classList.add('hidden');
			}

			// on supprime le rendu pour le recommencer sans les data 1
			section.removeChild(document.getElementById ("canvas"));
			mainRender();
		});



	// script affichage stats ou non
		let stat_status = true;     // variable état affichage des stats
		let stats = document.querySelector("#display_stats");

		stats.addEventListener("change", ()=>{

			// au changement, si les stats étaient affichées, on les affiche
			if (stat_status){
				document.getElementById("stat1").classList.remove('hidden');
				document.getElementById("stat2").classList.remove('hidden');
				document.getElementById("stat3").classList.remove('hidden');
				stat_status = false;

			// sinon, si les stats étaient affichées, on les cache
			}else{
				document.getElementById("stat1").classList.add('hidden');
				document.getElementById("stat2").classList.add('hidden');
				document.getElementById("stat3").classList.add('hidden');
				stat_status = true;
			}
		})