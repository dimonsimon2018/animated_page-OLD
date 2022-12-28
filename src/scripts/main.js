var currWindow;

const options = {
   threshold : 1 
};
const callback = function(entries, observer){
   entries.forEach(function(elem, index) {
    if(elem.isIntersecting){
 elem.target.classList.add("displayed");
    }
    else{
        if(elem.target.classList.contains('displayed')){
             elem.target.classList.remove("displayed");
        }
      
    }
	checkDisplayedWindow();
    
});

    
};
const observer = new IntersectionObserver(callback,options);
const targets = document.querySelectorAll('.content__snap-page');

targets.forEach(p=>{observer.observe(p)});



function checkDisplayedWindow(){
  targets.forEach(function(elem, index) {
	if(elem.classList.contains('displayed')){        
        currWindow = index;
        // событие смены номера окна
        console.log(currWindow);
       
    }
 
});
}



