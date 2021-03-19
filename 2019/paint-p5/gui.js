var obj = {
    // Option Paint
    color : [255, 100, 154, 255],
    backcolor : [50, 50, 50, 255],
    type  : 'free draw',
    fillShape : false,
    sizePaint : 5,
    getColor : false,
    getColorF : function(){
        noFill();
        ellipse(mouseX, mouseY , 10, 10);
        fill(255);
        text('Click to apply Color', mouseX, mouseY);
    },

    // Tool
        // Paint Random
        paintRandom : 'off',
        numOfShape : 20,

        // Load file
        imagePath : 'https://static.pexels.com/photos/355465/pexels-photo-355465.jpeg', 
        loadImagePath : function(){
            loadImage(obj.imagePath, function(img){
                gr.copy(img , 0, 0, img.width, img.height, 0, 0, w, h);
            } );
        },
        loadOffline : function(){
          alert('Just DRAG image file into Browser to open it');
        },

        // Save file
        filename : 'filename',
        save : function(){
            save(gr, obj.filename  + '.jpg');
        },


        // Another tool
        erase : false,
        clear : function(){
            gr.background(50);
            obj.backcolor = [50, 50, 50, 255];
        },
        clearWithColor : function(){
            gr.background(this.color);
            this.backcolor = this.color;
        },
        help : function(){
            alert('Designer : Hoang Tran \n'+
                  'Make with: P5js and dat.gui\n\n'+
                  'Key :\n'+
                  '      E -> Erase \n'+
                  '      G -> Get color  \n'+
                  '      F -> Fill shape \n'+
                  '      Mouse Wheel -> Size of Paint \n'+
                  '      To open Offline image file, just drag image into browser\n\n'+
                  'Note : \n'+
                  '    + Work better on chrome \n\n'+
                  '    + Choose "off" in "Type Paint Random" to switch to "Normal Paint"\n\n'+
                  '    + "Link" to image in tab File, you can take it in "google image" \n'+
                  '             by "Right Click" then "Open image in new tab" then "Copy Link"\n\n'+
                  '    + If your image "not display" after press Load, please get "another link"\n\n'
                  );
        }
};

function createGui(){
// create GUI 
  var gui = new dat.GUI();
  //gui.remember(obj);

  var f1 = gui.addFolder('Option Paint');
      f1.addColor(obj, 'color').name('Color').listen();
      f1.add(obj, 'getColor').name('Get Color').listen();
      f1.add(obj, 'sizePaint', 0, 100).name('Size of Paint').step(1).listen();
      f1.add(obj, 'type', ['free draw', 'line', 'line follow mouse', 'circle', 'rectangle']).name('Type Paint').listen();
      f1.add(obj, 'fillShape').name('Fill Shape').listen();
      f1.open();

  var f2 = gui.addFolder('Tool');

      f2.add(obj, 'erase').name('Erase').listen();
      f2.add(obj, 'clear').name('Clear all color');
      f2.add(obj, 'clearWithColor').name('Clear & Fill Color');
      f2.add(obj, 'help').name('Help');
      var fPr = f2.addFolder('Paint Random');
          fPr.add(obj, 'paintRandom', ['off', 'circle', 'line', 'rect', 'point', 'randomShape']).name('Type Paint random');
          fPr.add(obj, 'numOfShape', 0, 100).name('NumShape/Click').step(1);
      var fFile = f2.addFolder('Load image online');
          fFile.add(obj, 'imagePath').name('Link of Image').listen();
          fFile.add(obj, 'loadImagePath').name('Load');
      var fFileOff = f2.addFolder('Load image offline');
          fFileOff.add(obj, 'loadOffline').name('How to load Offline file');
      var fSave = f2.addFolder('Save image');
          fSave.add(obj, 'filename').name('File name').listen();
          fSave.add(obj, 'save').name('Save');

}
