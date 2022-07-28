import { main } from "./heightMap.js";

        let sidebar = document.querySelector(".sidebar");
		let closeBtn = document.querySelector("#btn");

		closeBtn.addEventListener("click", ()=>{
			sidebar.classList.toggle("open");
			menuBtnChange();
		});
		function menuBtnChange() {
			if(sidebar.classList.contains("open")){
				closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
			}else {
				closeBtn.classList.replace("bx-menu-alt-right","bx-menu");
			}
		}


		let dataBtn = document.querySelector("#dataBtn");
		let optionBtn = document.querySelector("#optionBtn");
		let filesBtn = document.querySelector("#filesBtn");
		let graphBtn = document.querySelector("#graphBtn");
		let settingBtn = document.querySelector("#settingBtn");
		let status = [true, true, true, true, true];
		let menus = [document.querySelector("#data"), document.querySelector("#option"), document.querySelector("#files"), document.querySelector("#graph"), document.querySelector("#setting")];

		dataBtn.addEventListener("click", ()=>{hide(0)});
		optionBtn.addEventListener("click", ()=>{hide(1)});
		filesBtn.addEventListener("click", ()=>{hide(2)});
		graphBtn.addEventListener("click", ()=>{hide(3)});
		settingBtn.addEventListener("click", ()=>{hide(4)});

		function hide(i){
			if (status[i]){
				menus[i].classList.remove('hidden');
				status[i] = false;

				for (let index = 0; index < status.length; index++) {
					if ((index != i ) && !(status[index])){
						menus[index].classList.add('hidden');
						status[index] = true;
					}
				}
			}else{
				menus[i].classList.add('hidden');
				status[i] = true;
			}
		}

		let remove1 = document.querySelector("#fileElemRemove1");
		let remove2 = document.querySelector("#fileElemRemove2");

		

		remove1.addEventListener("click", ()=>{
			isEmpty1 = true;
			sphere1 = 0;
			let container = document.getElementById("container1");
            if (container.firstElementChild){container.removeChild(container.firstElementChild);}
			let gallery = document.getElementById("gallery1");
            if (gallery.firstElementChild){gallery.removeChild(gallery.firstElementChild);}
			sizeX1 = 1;
			sizeY1 = 1;
			numberX1 = null;
			numberY1 = null;
			datlines1 = null;
			document.getElementById("render1Options").classList.add('hidden');
			document.getElementById("file1").classList.add('hidden');
			if (isEmpty2){
				document.getElementById("coupeOptions").classList.add('hidden');
                document.getElementById("render3Options").classList.add('hidden');
			}
			section.removeChild(document.getElementById ("canvas"));
			main();
		});
		
		remove2.addEventListener("click", ()=>{
			isEmpty2 = true;
			sphere2 = 0;
			let container = document.getElementById("container2");
            if (container.firstElementChild){container.removeChild(container.firstElementChild);}
			let gallery = document.getElementById("gallery2");
            if (gallery.firstElementChild){gallery.removeChild(gallery.firstElementChild);}
			sizeX2 = 1;
			sizeY2 = 1;
			numberX2 = null;
			numberY2 = null;
			datlines2 = null;
			document.getElementById("render2Options").classList.add('hidden');
			document.getElementById("file2").classList.add('hidden');
			if (isEmpty1){
				document.getElementById("coupeOptions").classList.add('hidden');
                document.getElementById("render3Options").classList.add('hidden');
			}
			section.removeChild(document.getElementById ("canvas"));
			main();
		});

		let stathide = true;
		let stat = document.querySelector("#displayStats");

		stat.addEventListener("change", ()=>{
			if (stathide){
				document.getElementById("stat").classList.remove('hidden');
				document.getElementById("stat2").classList.remove('hidden');
				document.getElementById("stat3").classList.remove('hidden');
				stathide = false;
			}else{
				document.getElementById("stat").classList.add('hidden');
				document.getElementById("stat2").classList.add('hidden');
				document.getElementById("stat3").classList.add('hidden');
				stathide = true;
			}
		})