const options = {
   threshold : 1 
};
const callback = function(entries, observer){
   entries.forEach(function(elem, index) {
    if(elem.isIntersecting){
 elem.target.classList.add("displayed");
    }
    else{
       elem.target.classList.remove("displayed");
    }
	
});

    
};
const observer = new IntersectionObserver(callback,options);
const targets = document.querySelectorAll('.content__snap-page');

targets.forEach(p=>{observer.observe(p)});



