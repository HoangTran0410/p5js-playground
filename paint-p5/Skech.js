// graphic and canvas
var w;
var h;
var gr;
var img;

// draw
var d;
var drag = false;
var pPosmouseX;
var pPosmouseY;

// Gui 
var config;
//var fFile;
var fImage;
var saved = false;
var tam = [];

function gotFileLocal(file) {
  if (file.type === 'image') {
    img = createImg(file.data).hide();
    gr.image(img, 0, 0, w, h);
  } else {
    alert('Not an image file! , Please choose another file');
  }
}

function setup(){
    // create canvas
        w = windowWidth - 260;
        h = windowHeight - 20;
        var c = createCanvas(w + 260, h).position(0, 0);
        c.drop(gotFileLocal);
  
        pixelDensity(1);
    
        createGui();

    // create graphic
        gr = createGraphics(w, h);
        d = new Draw();
        gr.background(50);

    // first cursor
        cursor('cursor.cur');
}

function draw(){
    if (focused ){
        // display picture
        clear();
        image(gr, 0, 0, w, h);
        
        // function get color
        if(obj.getColor)
            obj.getColorF();
        else {
            // if(true)
            //     obj.color = [random(255),random(255),random(255),random(255)];

            // animation at mouse position
                fill(obj.color);
                stroke(255 - obj.color[0], 255 - obj.color[1], 255 - obj.color[2]);
                strokeWeight(1);
                ellipse(mouseX, mouseY, obj.sizePaint, obj.sizePaint);

            // change cursor + eraser mode
                if(obj.erase){
                    if(!saved){
                        tam[0] = obj.color;
                        tam[1] = obj.type;
                        saved = true;
                        cursor('erase.cur');
                        obj.color = obj.backcolor;
                        obj.type = 'free draw';
                    }
                }else{
                    if(saved){
                        obj.color = tam[0];
                        obj.type = tam[1];
                        saved = false;
                        cursor('cursor.cur');
                    }
                }

            // animate shapes before save to picture
            if(drag){
                switch(obj.type){
                    case 'line':
                        d.Dline(mouseX, mouseY, pPosmouseX, pPosmouseY, false);
                        break;

                    case 'circle':
                        d.Dcircle(mouseX, mouseY, pPosmouseX, pPosmouseY,false);
                        break;

                    case 'rectangle':
                        d.Drect(mouseX, mouseY, pPosmouseX, pPosmouseY,false);
                        break;
                }
            }
        }
    }
}

function mouseDragged(){
    if(mouseX < w && mouseY < h){
        drag = true;
        switch(obj.type){
            case 'free draw':
                d.Dfree();
                break;

            case 'line':
                d.Dline(mouseX, mouseY, pPosmouseX, pPosmouseY,false);
                break;

            case 'line follow mouse':
                d.DlineF();
                break;

            case 'circle':
                d.Dcircle(mouseX, mouseY, pPosmouseX, pPosmouseY,false);
                break;

            case 'rectangle':
                d.Drect(mouseX, mouseY, pPosmouseX, pPosmouseY,false);
                break;
        }
    }
}

function mousePressed(){
    if(mouseX < w && mouseY < h){
        pPosmouseX = mouseX;
        pPosmouseY = mouseY;
        if(obj.getColor){
            var c = get(mouseX, mouseY);
            for(var i = 0; i < 3; i++)
                obj.color[i] = c[i];
        }
        else if(obj.paintRandom != 'off' && mouseX < w && mouseY < h){
            switch(obj.paintRandom){
                case 'circle':
                    d.Drand('circle', obj.numOfShape);
                    break;

                case 'line':
                    d.Drand('line', obj.numOfShape);
                    break;

                case 'rect':
                    d.Drand('rect', obj.numOfShape);
                    break;

                case 'point':
                    d.Drand('point', obj.numOfShape);
                    break;

                case 'randomShape':
                    d.Drand('all', obj.numOfShape);
                    break;
            }
        }
    }
}

function mouseReleased(){
    if(mouseX < w && mouseY < h){
        if(obj.type == 'free draw' && obj.paintRandom === 'off' && !obj.getColor)
            d.Dpoint(mouseX, mouseY);
        if(obj.getColor) obj.getColor = false;
        if(drag){
            switch(obj.type){
                case 'circle':
                    d.Dcircle(mouseX, mouseY, pPosmouseX, pPosmouseY,true);
                    break;

                case 'line':
                    d.Dline(mouseX, mouseY, pPosmouseX, pPosmouseY,true);
                    break;

                case 'rectangle':
                    d.Drect(mouseX, mouseY, pPosmouseX, pPosmouseY,true);
                    break;
            }
            drag = false;
        }
    }
}

function mouseWheel(event) {
    obj.sizePaint -= event.delta/50;
    if(obj.sizePaint < 0) obj.sizePaint = 0;
}

function keyPressed() {
  switch(keyCode) {
    case 69:
        obj.erase = !obj.erase;
        break;
    case 71:
        obj.getColor = !obj.getColor;
        break;

    case 70:
        obj.fillShape = !obj.fillShape;
        break;
  }
}
