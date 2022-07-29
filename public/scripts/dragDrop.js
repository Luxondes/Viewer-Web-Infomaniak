//script pour initialiser le drag and drop
export function dragDrop(){

    // le drag and drop se fait sur deux éléments, la zone de drop et le canvas du rendu
    let drop_area = document.getElementById("drop-area");
    let canvas = document.getElementById ("canvas");

    // preventDefault les événements liés au drag & drop sur la zone de drop, sur le canvas du rendu et sur la page en général
    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    canvas.addEventListener(eventName, preventDefaults, false);  
    drop_area.addEventListener(eventName, preventDefaults, false);   
    document.body.addEventListener(eventName, preventDefaults, false);
    })

    // lorsque l'on entre sur le canvas, on affichage la zone de drop
    canvas.addEventListener('dragenter', unhide);
    // lorsque l'on quitte la zone de drop, on cache la zone de drop
    drop_area.addEventListener('dragleave', hide);
    // lorsque l'on drop quelque part sur la page (plus dans une situation de drag), on cache aussi la zone de drop
    drop_area.addEventListener('drop', hide);

    // fonctions affichage ou non de la zone de drop
    function unhide(){
        drop_area.classList.remove('hidden');
    }
    function hide(){
        drop_area.classList.add('hidden');
    }

    // fonction preventDefault
    function preventDefaults(e){
    e.preventDefault();
    e.stopPropagation();
    }
}