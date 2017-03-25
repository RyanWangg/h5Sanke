/*
 *未完善功能：碰到自身做出检测。
 *时间：2017/3/25
 *
 */

//豆子半径
const BEAN_RADIUS = 4;
// 画布宽高
const CAN_WIDTH = 600;
const CAN_HEIGHT = 500;
//定义豆子数组
var beans = [];
//定义蛇对象
var snake = {};
//蛇的身体
var snakeBody = [];
//蛇的初始节点个数
snake.nodes = 4;
//蛇的初始节点xy坐标
snake.nodeInitX = 180;
snake.nodeInitY = 240;
//蛇节点半径
snake.nodeRadius = 8;
// 蛇前进的速度
snake.speed = 10;
// 蛇的前进方向
snake.direction = 'right';
// 判定开始游戏按钮按了几次，每局游戏只能按1次
snake.start = 1;


window.onload = function() {
	var btnStartGame = document.getElementById("startGame");
	var btnRestartGame = document.getElementById("restartGame");
	btnStartGame.addEventListener('click', startGame, true);
	btnRestartGame.addEventListener('click', restartGame, true);
	window.addEventListener('blur', noteFocus, true);
};



// 监听页面焦点，失去焦点做出提示
function noteFocus() {
	var msgList = document.getElementById("msgList");
	var newMsg = document.createElement("li");
	var msgText = document.createTextNode("游戏页面失去焦点，请点击页面！");
	newMsg.appendChild(msgText);
	msgList.appendChild(newMsg);
}
// 重新开始游戏，刷新页面
function restartGame() {
	location.reload();
}
// 开始游戏
function startGame() {
	if (snake.start) {
		snake.start = 0;
		//在消息框中显示游戏开始
		var msgList = document.getElementById("msgList");
		var newMsg = document.createElement("li");
		var msgText = document.createTextNode("游戏开始！");
		newMsg.appendChild(msgText);
		msgList.appendChild(newMsg);

		// top层显示蛇snake
		var top = document.getElementById("top");
		//bot层显示豆子bean
		var bot = document.getElementById("bot");

		if (bot.getContext) {
			var botCtx = bot.getContext("2d");
			//画第一个豆子
			getBean(botCtx);
		}

		if (top.getContext) {
			var topCtx = top.getContext("2d");
			//初始化生成蛇节点坐标
			initSnake();
			// 监听键盘事件，控制蛇前进方向
			window.addEventListener('keydown', doKeyDown,true);
			// 每一帧
			var flame = setInterval(function(){
				go(snakeBody);
				clearCanvas(topCtx);
				for (var k = snakeBody.length - 1; k >= 0; k--) {
					drawSnakeNode(snakeBody[k][0], snakeBody[k][1], topCtx);
				}
				// 是否吃到豆子
				isTouchBean(snakeBody, beans, botCtx);
				// 是否碰壁
				isWall(snakeBody, flame);
			},400);
		}
	}
}

// 是否吃到豆子
function isTouchBean(snakeBody, beans, botCtx) {
	var headNodeX = snakeBody[snakeBody.length-1][0];
	var headNodeY = snakeBody[snakeBody.length-1][1];
	var lastBeanX = parseInt(beans[beans.length-1][0]);
	var lastBeanY = parseInt(beans[beans.length-1][1]);
	
	if (headNodeX > lastBeanX - snake.nodeRadius && headNodeX < lastBeanX + snake.nodeRadius) {
		if (headNodeY > lastBeanY - snake.nodeRadius && headNodeY < lastBeanY + snake.nodeRadius) {
			clearCanvas(botCtx);
			getBean(botCtx);
			getOneMoreSnakeNode(headNodeX, headNodeY, snakeBody);
		}
	}
}

// 吃完豆子在蛇头前增长一节
function getOneMoreSnakeNode(x, y, snakeBody) {
	if (snake.direction === 'right') {
		x += snake.speed;
	} else if (snake.direction === 'left') {
		x -= snake.speed;
	} else if (snake.direction === 'up') {
		y -= snake.speed;
	} else {
		y += snake.speed;
	}
	var aNode = [x, y];
	snakeBody.push(aNode);
}

// 检测是否碰壁
function isWall(snakeBody, flame) {
	var headNodeX = snakeBody[snakeBody.length-1][0];
	var headNodeY = snakeBody[snakeBody.length-1][1];
	if (headNodeX < snake.nodeRadius || headNodeX > CAN_WIDTH - snake.nodeRadius || headNodeY < snake.nodeRadius || headNodeY > CAN_HEIGHT - snake.nodeRadius) {
		clearInterval(flame);
		//在消息框中显示游戏结束
		var msgList = document.getElementById("msgList");
		var newMsg = document.createElement("li");
		var msgText = document.createTextNode("游戏结束！");
		var num = beans.length - 1;
		newMsg.appendChild(msgText);
		msgList.appendChild(newMsg);
		var text = "你吃到了" + num + "颗豆子！";
		var newMsg2 = document.createElement("li");
		var msgText2 = document.createTextNode(text);
		newMsg2.appendChild(msgText2);
		msgList.appendChild(newMsg2);
		var newMsg3 = document.createElement("li");
		var msgText3 = document.createTextNode("再玩一局吧！");
		newMsg3.appendChild(msgText3);
		msgList.appendChild(newMsg3);
	}
}

// 对键盘事件作出响应
function doKeyDown(e) {
	var keyID = e.keyCode ? e.keyCode :e.which;
	 if(keyID === 38 || keyID === 87)  { // up arrow and W  
	 	if (snake.direction !== 'down' && snake.direction !== 'up') {
	 		snake.direction = 'up';
	 		goUp(snakeBody);
	 	}
	 }
	 if(keyID === 39 || keyID === 68)  { // right arrow and D  
       if (snake.direction !== 'left' && snake.direction !== 'right') {
       		snake.direction = 'right';
       		goRight(snakeBody);
       }
    }  
    if(keyID === 40 || keyID === 83)  { // down arrow and S  
       if (snake.direction !== 'up' && snake.direction !== 'down') {
       		snake.direction = 'down';
       		goDown(snakeBody);
       } 
    }  
    if(keyID === 37 || keyID === 65)  { // left arrow and A  
        if (snake.direction !== 'right' && snake.direction !== 'left') {
       		snake.direction = 'left';
       		goLeft(snakeBody);
       }  
    }  
}

// 确定蛇的每个点坐标
function move(snakeBody) {
	for (var i = 0; i < snakeBody.length - 1; i++) {
		snakeBody[i][0] = snakeBody[i + 1][0];
		snakeBody[i][1] = snakeBody[i + 1][1];
	}
}
function goRight(snakeBody) {
	snakeBody[snakeBody.length - 1][0] += snake.speed;
}
function goLeft(snakeBody) {
	snakeBody[snakeBody.length - 1][0] -= snake.speed;
}
function goUp(snakeBody) {
	snakeBody[snakeBody.length - 1][1] -= snake.speed;
}
function goDown(snakeBody) {
	snakeBody[snakeBody.length - 1][1] += snake.speed;
}

function go(snakeBody) {
	move(snakeBody);
	if (snake.direction === 'right') {
		goRight(snakeBody);
	} else if (snake.direction === 'left') {
		goLeft(snakeBody);
	} else if (snake.direction === 'up') {
		goUp(snakeBody);
	} else {
		goDown(snakeBody);
	}
}

// 游戏开始，初始化蛇
function initSnake() {
	// 游戏开始是蛇每个节点坐标
	for (var i = 0; i < snake.nodes; i++) {
		var x = snake.nodeInitX - snake.speed * i;
		var arr = [x, snake.nodeInitY];
		snakeBody.push(arr);
	}
}

// 清除画布
function clearCanvas(canvas) {
	canvas.clearRect(0, 0, CAN_WIDTH, CAN_HEIGHT);
}


// 画蛇每个节点
function drawSnakeNode(x, y, topCtx) {
	topCtx.beginPath();
	topCtx.arc(x, y, snake.nodeRadius, 0, 2 * Math.PI, false);
	topCtx.fillStyle = "#d9b3e6";
	topCtx.fill();
}


//随机生成豆子
function getBean(botCtx) {
	// 获取豆子坐标
	var beanX = getRandomBeanX();
	var beanY = getRandomBeanY();

	//判断豆子是否在边界
	//canvas的高宽不在上下文对象中获取
	if (beanX > (BEAN_RADIUS * 3) && beanX < CAN_WIDTH - (3 * BEAN_RADIUS)) {
		if (beanY > (3 * BEAN_RADIUS) && beanY < CAN_HEIGHT - (3 * BEAN_RADIUS)) {
			//画豆子
			drawBean(botCtx, beanX, beanY);
			//向豆子数组中添加一个，并返回最新数组长度
			var aBean = [beanX, beanY];
			beans.push(aBean);
		}
	} else {
		getBean(botCtx);
	}

}

//随机获取豆子坐标
function getRandomBeanX() {
	//随机生成豆子的x坐标
	var beanX = Math.round(Math.random() * 600 );
	return beanX;
}

function getRandomBeanY() {
	//随机生成豆子的y坐标
	var beanY = Math.round(Math.random() * 500);
	return beanY;
}
// 画豆子
function drawBean(botCtx, beanX, beanY) {
	botCtx.beginPath();
	botCtx.fillStyle = "#83fcd8";
	botCtx.arc(beanX, beanY, BEAN_RADIUS, 0, 2 * Math.PI, false);
	botCtx.fill();
}