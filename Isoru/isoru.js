function Isoru(canvasId, options) {
	Isoru.options = options || {};

	Isoru.canvasElement = document.getElementById(canvasId);
	Isoru.canvas = {
		id: canvasId,
		ctx: Isoru.canvasElement.getContext('2d'),
		width: Isoru.canvasElement.width,
		height: Isoru.canvasElement.height
	};

	Isoru.map = [];
	Isoru.heightMap = [];
	Isoru.cameraSpeed;
	Isoru.cameraX = Isoru.options.startCameraX || 0;
	Isoru.cameraY = Isoru.options.startCameraY || 0;
	window.onload = () => { Isoru.prototype.cameraMove(); }

	Isoru.heightMapGraph = [];
	Isoru.heightMapGraphicsToLoad = [Isoru.options.dirt] || [];
	for (var i = 0; i < Isoru.heightMapGraphicsToLoad.length; i++) {
		Isoru.heightMapGraph[i] = new Image();
		Isoru.heightMapGraph[i].src = 'Isoru/tiles/'+Isoru.heightMapGraphicsToLoad[i];
	}
}

Isoru.prototype.clear = () => {
	Isoru.canvas.ctx.clearRect(0, 0, Isoru.canvas.width, Isoru.canvas.height);
}

Isoru.tiles = [];
Isoru.tileGraphics = [];
Isoru.prototype.initMap = (map, images, heightMap) => {
	Isoru.tileGraphicsToLoad = images || [];
	Isoru.tileGraphicsLoaded = 0;
	for (var i = 0; i < Isoru.tileGraphicsToLoad.length; i++) {
		Isoru.tiles[i] = Isoru.tileGraphicsToLoad[i];
		Isoru.tileGraphics[i] = new Image();
		var a = Isoru.tileGraphicsToLoad[i].split('/');
		var b = a.indexOf('buildings');
		if(b == -1){ 
			Isoru.tileGraphics[i].src = 'Isoru/tiles/'+Isoru.tileGraphicsToLoad[i]; 
		} else {
			Isoru.tileGraphics[i].src = 'Isoru/'+Isoru.tileGraphicsToLoad[i]; 
		}
		Isoru.tileGraphics[i].onload = function() {
			Isoru.tileGraphicsLoaded++;
			if (Isoru.tileGraphicsLoaded === Isoru.tileGraphicsToLoad.length) {
				Isoru.prototype.drawMap(map, heightMap);
			}
		}
	}
}

Isoru.prototype.drawMap = (map, heightMap, camX, camY) => {
	Isoru.tileH = Isoru.options.tilesDistance;
	Isoru.mapX = 200;
	Isoru.mapY = 152;

	Isoru.camX = camX || 0;
	Isoru.camY = camY || 0;

	Isoru.map = map;
	Isoru.heightMap = heightMap;

	Isoru.canvas.ctx.clearRect(0, 0, Isoru.canvas.width, Isoru.canvas.height);

	var drawTile;
	for (var y = 0; y < map.length; y++) {
		for (var x = 0; x < map[y].length; x++) {
			drawTile = map[y][x];

			let w, h;

			var a = Isoru.tiles[drawTile].split('/');
			var b = a.indexOf('buildings');
			var isBuilding; if(b == -1){ isBuilding = false; } else { isBuilding = true; }

			if(isBuilding){
				Isoru.canvas.ctx.drawImage(Isoru.tileGraphics[drawTile], ((x - y) * Isoru.tileH + Isoru.mapX)+Isoru.camX, (((x + y) * Isoru.tileH / 2 +Isoru.mapY)-Isoru.options.buildingDEEPland)+Isoru.camY, Isoru.options.buildingWland, Isoru.options.buildingHland);
				
			} else if(heightMap[y][x] == 0){
				 	Isoru.canvas.ctx.drawImage(Isoru.tileGraphics[drawTile], ((x - y) * Isoru.tileH + Isoru.mapX)+Isoru.camX, ((x + y) * Isoru.tileH / 2 + Isoru.mapY)+Isoru.camY, Isoru.options.tileW, Isoru.options.tileH);
			} else if(heightMap[y][x] == 1){
				Isoru.canvas.ctx.drawImage(Isoru.tileGraphics[drawTile], ((x - y) * Isoru.tileH + Isoru.mapX)+Isoru.camX, ((x + y) * Isoru.tileH / 2 + Isoru.mapY)+Isoru.camY, Isoru.options.tileW, Isoru.options.tileH);
				Isoru.canvas.ctx.drawImage(Isoru.tileGraphics[drawTile], ((x - y) * Isoru.tileH + Isoru.mapX)+Isoru.camX, (((x + y) * Isoru.tileH / 2 +Isoru.mapY)-16)+Isoru.camY, Isoru.options.tileW, Isoru.options.tileH);
			} else if(heightMap[y][x] > 1){
				for(var i = 0; i < heightMap[y][x]; i++){
					if(i+1 != heightMap[y][x]){
						Isoru.canvas.ctx.drawImage(Isoru.heightMapGraph[0], ((x - y) * Isoru.tileH + Isoru.mapX)+Isoru.camX, (((x + y) * Isoru.tileH / 2 +Isoru.mapY)-16*i)+Isoru.camY, Isoru.options.tileW, Isoru.options.tileH);
					} else {
						Isoru.canvas.ctx.drawImage(Isoru.tileGraphics[drawTile], ((x - y) * Isoru.tileH + Isoru.mapX)+Isoru.camX, (((x + y) * Isoru.tileH / 2 +Isoru.mapY)-15.5*(i+1))+Isoru.camY, Isoru.options.tileW, Isoru.options.tileH);
					}
				}
			}
		}
	}
}

Isoru.prototype.initCameraMove = (cameraSpeed, startX, startY) => {
	Isoru.cameraSpeed = cameraSpeed;

	if(Isoru.startCameraX != 0){
		Isoru.cameraX = startX || -Isoru.startCameraX;
	} else {
		Isoru.cameraX = startX || 0;
	}

	if(Isoru.startCameraY != 0){
		Isoru.cameraY = -startY || -Isoru.startCameraY;
	} else {
		Isoru.cameraY = -startY || 0;
	}

	window.onload = () => { Isoru.prototype.cameraMove(); }
}

Isoru.prototype.cameraMove = (key) => {
	if(key){
		var key = String.fromCharCode(key.which);

		if(key == 'd' || key == 'D' || key == 'В' || key == 'в'){
			Isoru.cameraX -= Isoru.cameraSpeed;
		} else if(key == 'a' || key == 'A' || key == 'Ф' || key == 'ф'){
			Isoru.cameraX += Isoru.cameraSpeed;
		} else if(key == 'w' || key == 'W' || key == 'Ц' || key == 'ц'){
			Isoru.cameraY += Isoru.cameraSpeed;
		} else if(key == 's' || key == 'S' || key == 'Ы' || key == 'ы'){
			Isoru.cameraY -= Isoru.cameraSpeed;
		}
	}

	Isoru.prototype.drawMap(Isoru.map, Isoru.heightMap, Isoru.cameraX, Isoru.cameraY);
}

//GAME.initCameraMove(5, 100, 184);
//document.addEventListener("keypress", function(e){
//	GAME.cameraMove(e);
//});