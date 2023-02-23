const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d"); //context는 brush(붓)

const lineWidth = document.getElementById("line-width");
const color = document.getElementById("color");
const colorOptions = Array.from(document.getElementsByClassName("color-option")); //document.getElementsByClassName("color-option")은 HTML collection으로 주기 때문에 배열로 바꿈

const modeBtn = document.getElementById("mode-btn");
const destroyBtn = document.getElementById("destroy-btn");
const eraserBtn = document.getElementById("eraser-btn");
const saveBtn = document.getElementById("save-btn");

const fileInput = document.getElementById("file");
const textInput = document.getElementById("text");

canvas.width=800;
canvas.height=800; /*js에도 canvas의 크기 알려주려고 */ 

ctx.lineWidth = lineWidth.value; //html이 js보다 먼저 실행되어서 js가 실행되면 초기화해줘야 함
ctx.lineCap = "round"; //붓 모양을 둥글게


const colors = [
    "#f03e3e",
    "#e64980",
    "#be4bdb",
    "#7950f2",
    "#4c6ef5",
    "#228be6",
    "#15aabf",
    "#12b886",
    "#40c057",
    "#82c91e",
    "#fab005",
    "#fd7e14"
    ]
let isPainting = false; 
let isFilling = false;

function onMove(event){
    if(isPainting){ //마우스를 누른 상태에서만 그려지게
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        return;
    }
    ctx.moveTo(event.offsetX, event.offsetY); //마우스를 뗀 상태에서도 마우스를 따라가는 중
}
function onMouseDown(){
    isPainting = true;
}
function onMouseUp(){
    ctx.beginPath();
    isPainting = false;
}
function onLineWidthChange(event){
    ctx.lineWidth = event.target.value;
}
function onColorChange(event){
    //console.log(event.target.value); 웹에서 검사를 누르고 콘솔을 보면 선택한 색상 코드 보여줌
    ctx.strokeStyle = event.target.value;
    ctx.fillStyle = event.target.value;
}
function onColorClick(event){
    //console.dir(event.target.dataset.color); console의 dataset에서 클릭한 색상에 대한 정보 획득 가능(data-color덕분, data-~ 형태, ~는 아무거나 가능)
    ctx.strokeStyle = event.target.dataset.color;
    ctx.fillStyle = event.target.dataset.color;
    color.value = event.target.dataset.color; //색상이 선택된 것을 사용자가 알 수 있도록
}
function onCanvasClick(){
    if(isFilling) //filling모드이면 캔버스 크기의 사각형을 만들어 선택한 색으로 canvas를 채움
    {
        ctx.fillRect(0, 0, 800, 800);
    }
}
function onModeClick(){
    if(isFilling)
    {
        isFilling = false;
        modeBtn.innerText = "Fill";
    }else{
        isFilling=true;
        modeBtn.innerText = "Draw";
    }
}
function onDestroyClick(){
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 800, 800);
}
function onEraserClick(){
    ctx.strokeStyle = "white";
    isFilling = false;
    modeBtn.innerText = "Fill";

}
function onSaveClick(){
    const url = canvas.toDataURL();
    const a = document.createElement("a"); //<a href="" download/>를 사용하려고
    a.href = url;
    a.download = "mydrawing.jpg";
    a.click(); //a 태그를 클릭하는 것, 이것으로 download 창이 뜸
}
function onFileChange(event){
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    const image = new Image(); // <img src=""></img>랑 같은 의미, document.createElement("img")랑 같음
    image.src = url;
    image.onload = function(){ //addEventListener와 같은 의미, addEventListener는 하나의 event에 여러 함수 호출 가능
        ctx.drawImage(image, 0, 0, 800, 800);
        fileInput.value = NULL; //이미지를 그리는 중에 다른 이미지를 그리고 싶을까봐...(왜지?)
    }
}
function onDoubleClick(event){
    ctx.save(); //수정하기 전 상태 저장, 현재 상태를 저장
    const text = textInput.value;
    if(text !== "")
    {
        ctx.lineWidth = 1; //굵기 수정
        ctx.font = "48px serif"
        ctx.fillText(text, event.offsetX, event.offsetY);
        ctx.restore(); //수정 전 상태로 돌아감
    }
}
canvas.addEventListener("dblclick", onDoubleClick);
canvas.addEventListener("mousemove", onMove); //마우스를 움직이면 onMove함수 실행, canvas.onmousemove = onMove;와 같음
canvas.addEventListener("mousedown", onMouseDown); //mousedown은 마우스를 누른 상태
canvas.addEventListener("mouseup", onMouseUp); //mouseup은 마우스를 뗀 상태
canvas.addEventListener("mouseleave", onMouseUp); //캔버스를 벗어나면 마우스를 뗀 걸로 간주

lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);
colorOptions.forEach(color => color.addEventListener("click", onColorClick)); //색깔을 click하면 함수 호출, 각 color에 event listener를 추가해줌

canvas.addEventListener("click", onCanvasClick); //click은 mousedown과 mouseup이 같이 실행된 것
modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraserBtn.addEventListener("click", onEraserClick);
saveBtn.addEventListener("click", onSaveClick);

fileInput.addEventListener("change", onFileChange);

/*ctx.fillRect(200, 200, 50, 200); //왼쪽 벽
ctx.fillRect(400, 200, 50, 200); //오른쪽 벽
ctx.fillRect(300, 300, 50, 100); //문
ctx.fillRect(200, 200, 200, 20); //천장

ctx.moveTo(200, 200); 
ctx.lineTo(325, 100); 
ctx.fill(); //왼쪽 지붕
ctx.lineTo(450, 200);
ctx.fill(); //오른쪽 지붕
*/

/*
ctx.fillRect(210-40, 200-10, 15, 100); //왼팔
ctx.fillRect(350-40, 200-10, 15, 100); //오른팔
ctx.fillRect(260-40, 200-10, 60, 200); //몸통
ctx.arc(250, 100, 50, 0, 2*Math.PI); //얼굴
ctx.fill();

ctx.beginPath();
ctx.fillStyle = "white";
ctx.arc(260+10, 80, 8, Math.PI, 2*Math.PI); //왼쪽 눈
ctx.arc(220+10, 80, 8, Math.PI, 2*Math.PI); //오른쪽 눈
ctx.fill();
*/

/*ctx.rect(50, 50, 100, 100);
ctx.fill();
ctx.rect(150, 150, 100, 100);
ctx.rect(250, 250, 100, 100);
ctx.fill(); //위 3개는 같은 경로라 같은 색으로 칠해짐

ctx.beginPath(); //위와 같은 경로가 되지 않으려고(경로를 끊기 위해)
ctx.rect(350, 350, 100, 100);
ctx.rect(450, 450, 100, 100);
ctx.fillStyle = "red";
ctx.fill();
*/