export function dragDrop(){
    let dropArea = document.getElementById("drop-area");
    let canvas = document.getElementById ("canvas");

    // preventDefault les événements liés au drag & drop
    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    canvas.addEventListener(eventName, preventDefaults, false);  
    dropArea.addEventListener(eventName, preventDefaults, false);   
    document.body.addEventListener(eventName, preventDefaults, false);
    })

    canvas.addEventListener('dragenter', unhide);
    dropArea.addEventListener('dragleave', hide);
    dropArea.addEventListener('drop', hide);

    // fonctions affichage ou non
    function unhide(){
        dropArea.classList.remove('hidden');
    }
    function hide(){
        dropArea.classList.add('hidden');
    }

    // fonction preventDefault
    function preventDefaults(e){
    e.preventDefault();
    e.stopPropagation();
    }
}