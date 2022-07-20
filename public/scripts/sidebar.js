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
		let status = [true, true, true, true];
		let menus = [document.querySelector("#data"), document.querySelector("#option"), document.querySelector("#files"), document.querySelector("#graph")];

		dataBtn.addEventListener("click", ()=>{hide(0)});
		optionBtn.addEventListener("click", ()=>{hide(1)});
		filesBtn.addEventListener("click", ()=>{hide(2)});
		graphBtn.addEventListener("click", ()=>{hide(3)});

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