const tools = document.querySelectorAll('.tool_link');
const handle = document.querySelector('.handle');
const toolsNav = document.querySelector('.tools_nav');
const body = document.querySelector('.outputBody');
//transform nodelist to array
var toolsArr = Array.from(tools);

/*setup the toolsbar*/
window.addEventListener('load',()=>{
    toolsArr[0].style.background = "#fff";
    //toolsArr[0].style.boxShadow = "0 -1px 5px 0 rgba(0,0,0,.5)";
    toolsArr[0].style.border ="solid #dfe4ea 2px";
    toolsArr[0].style.zIndex = 2;
  
  body.style.width = window.innerWidth - handle.getBoundingClientRect().left+"px";
  body.style.height = window.innerHeight+"px";
});


/*highlight selected tab*/

toolsArr.forEach(elem=> { 
  
  elem.addEventListener('click',()=>{
  toolsArr.forEach(v =>{
                   v.style.background = "#f1f2f6";
                   v.style.border = "none";
    v.style.zIndex = 1;
                   });
    elem.style.background = "#fff";
    //elem.style.boxShadow = "0 -10px 0px 1px #dfe4ea";
    elem.style.border = "solid #dfe4ea 2px";
    elem.style.zIndex = 2;
  });
});

/*
*resize function, resizing the toolsbar on drag
*/
handle.addEventListener('mousedown',resize);
const sidebar =document.querySelector('.sidebar');

function resize(){
  window.addEventListener('mousemove',mousemove);
  window.addEventListener('mouseup',mouseup);
  
  function mousemove(e){
    e.preventDefault();
    
    let pos = {
      "x": e.clientX|| e.pageX,
      "y": e.clientY|| e.pageY
    };
    
    //hide the toolbar buttons if the toolbar is getting to narrow
    let mostRightRect= toolsArr[toolsArr.length-1].getBoundingClientRect();
    if(pos.x> 50  ){
      sidebar.style.width = pos.x+"px";
      handle.left = pos.x+"px";
      body.style.width = window.innerWidth - sidebar.getBoundingClientRect().left+"px";
  body.style.height = window.innerHeight+"px";
    }
    else
    {
      sidebar.style.width = "50px";
    }
  }
  
  function mouseup(){
    window.removeEventListener('mousemove',mousemove);
    window.removeEventListener('mouseup',mouseup);
  }
  
}
