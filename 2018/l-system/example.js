var colorGuide = false; // while choose Kevs Tree

var examName = ['Board', 'Box in Box', 'Chrismas Cross',
				 'Chroma Pyramid', 'Circles from Lines',
				 'Crystal', 'Dragon Curves', 'Fractal Plant',
				 'Hexagonal Gosper', 'Islands and Lakes',
				 'Joined Cross Curves', 'Koch Curves', 'Kevs Tree',
				 'Separate Lines', 'Sierpinski Box Carpet',
				 'Sierpinski Curves', 'Sierpinski Curves 6',
				 'Sierpinski Triangle', 'Snow Koch', 'Snow Flake',
				 'Space Filling Curves', 'Tiles', 'Tree', 'Tree2', 
				 'Penrose Tiling', 'Pentaplexity'];

function ExampleJs(){
	switch(LsystemGui.example){
		case 'Board':
			getRules(0, 'F=FF+F+F+F+FF');
			LsystemGui.drawForward = 'F';
			setValueFromExample('F+F+F+F', 90, 3); // axiom angle generation
			break;			

		case 'Box in Box':
			getRules(0, 'a=[F+f+ff+ff+ff+f]a');
			getRules(1, 'f=ff');
			getRules(2, 'F=FF');
			LsystemGui.drawForward = 'f';
			LsystemGui.moveForward = 'F';
			setValueFromExample('a', 90, 5); // axiom angle generation
			break;						

		case 'Chrismas Cross':
			getRules(0, 'F={{{FF}}}[F][--F][++F]');
			LsystemGui.drawForward = 'F';
			setValueFromExample('[F]--[F]--[F]--[F]', 45, 4); // axiom angle generation
			break;

		case 'Chroma Pyramid':
			getRules(0, 'f={{{ff}}}[f][--f][++f]');
			LsystemGui.drawForward = 'f';
			setValueFromExample('+[f]--[f]--[ff]--[f]--[ff]', 72, 4); // axiom angle generation
			break;				

		case 'Circles from Lines':
			getRules(0, 'x=x+yf');
			getRules(1, 'y=fx+y');
			LsystemGui.drawForward = 'f';
			setValueFromExample('fxy+fxy+fxy', 123, 7); // axiom angle generation
			break;							

		case 'Crystal':
			getRules(0, 'F=FF+F++F+F');
			LsystemGui.drawForward = 'F';
			setValueFromExample('F+F+F+F', 90, 4); // axiom angle generation
			break;

		case 'Dragon Curves':
			getRules(0, 'X=X+YF+');
			getRules(1, 'Y=-FX-Y');
			LsystemGui.drawForward = 'F';
			setValueFromExample('FX', 90, 10); // axiom angle generation
			break;

		case 'Fractal Plant':
			getRules(0,'F=FF');
			getRules(1,'X=F[-X][X]F[-X]+FX');
			LsystemGui.drawForward = 'FX';
			setValueFromExample('X', 25, 5); // axiom angle generation
			break;

		case 'Hexagonal Gosper':
			getRules(0, 'X=X+YF++YF-FX--FXFX-YF+');
			getRules(1, 'Y=-FX+YFYF++YF+FX--FX-Y')
			LsystemGui.drawForward = 'F';
			setValueFromExample('XF', 60, 4); // axiom angle generation
			break;

		case 'Islands and Lakes':
			getRules(0, 'F=FFFFFF');
			getRules(1, 'f=f+F-ff+f+ff+fF+ff-F+ff-f-ff-fF-fff')
			LsystemGui.drawForward = 'f';
			LsystemGui.moveForward = 'F';
			setValueFromExample('f+f+f+f', 90, 3); // axiom angle generation
			break;

		case 'Joined Cross Curves':
			getRules(0, 'F=');
			getRules(1, 'X=FX+FX+FXFY-FY-');
			getRules(2, 'Y=+FX+FXFY-FY-FY');
			LsystemGui.drawForward = 'F';
			setValueFromExample('XYXYXYX+XYXYXYX+XYXYXYX+XYXYXYX', 90, 3); // axiom angle generation
			break;

		case 'Koch Curves':
			getRules(0,'F=F+F-F-F+F');
			LsystemGui.drawForward = 'F';
			setValueFromExample('F', 90, 4); // axiom angle generation
			break;

		case 'Kevs Tree' :
			getRules(0, 'F = <762FF>-[<162-F+F+F>]+[<162+F-F-F>]');
			LsystemGui.drawForward = 'F';
			setValueFromExample('F', 22, 4); // axiom angle generation
			if(!colorGuide)
				alert('This example made with color\n'+
				 'Color guide in "Help / Note"');
			colorGuide = true;
			break;

		case 'Separate Lines':
			getRules(0, 'a=[-f+fa]+f-fa');
			getRules(1, 'f=ff');
			LsystemGui.drawForward = 'f';
			setValueFromExample('a', 60, 6); // axiom angle generation
			break;

		case 'Sierpinski Box Carpet':
			getRules(0, 'f=f+f-f-f-F+f+f+f-f');
			getRules(1, 'F=FFF');
			LsystemGui.drawForward = 'f';
			LsystemGui.moveForward = 'F';
			setValueFromExample('f', 90, 4); // axiom angle generation
			break;
				
		case 'Sierpinski Curves':
			getRules(0, 'A=B-A-B');
			getRules(1, 'B=A+B+A');
			LsystemGui.drawForward = 'AB';
			setValueFromExample('A', 60, 6); // axiom angle generation
			break;

		case 'Sierpinski Curves 6':
			getRules(0, 'A=B-A-B');
			getRules(1, 'B=A+B+A');
			LsystemGui.drawForward = 'AB';
			setValueFromExample('AB++A++B[-A]A', 60, 6); // axiom angle generation
			break;

		case 'Sierpinski Triangle':
			getRules(0, 'F=F-G+F+G-F');
			getRules(1, 'G=GG');
			LsystemGui.drawForward = 'FG';
			setValueFromExample('F-G-G', 120, 4); // axiom angle generation
			break;

		case 'Snow Koch':
			getRules(0, 'F=F-F++F-F');
			LsystemGui.drawForward = 'F';
			setValueFromExample('F++F++F', 60, 4); // axiom angle generation
			break;

		case 'Snow Flake':
			getRules(0, 'F={FFF}[F][-F][+F]');
			LsystemGui.drawForward = 'F';
			setValueFromExample('[F]-[F]-[F]-[F]-[F]-[F]', 60, 3); // axiom angle generation
			break;						

		case 'Space Filling Curves':
			getRules(0, 'X=-YF+XFX+FY-');
			getRules(1, 'Y=+XF-YFY-FX+');
			LsystemGui.drawForward = 'F';
			setValueFromExample('X', 90, 6); // axiom angle generation
			break;

		case 'Tiles':
			getRules(0, 'F=FF+F-F+F+FF');
			LsystemGui.drawForward = 'F';
			setValueFromExample('F+F+F+F', 90, 4); // axiom angle generation
			break;

		case 'Tree':
			getRules(0, 'V = [+++W][---W]YV');
			getRules(1, 'W = +X[-W]Z');
			getRules(2, 'X = -W[+X]Z');
			getRules(3, 'Y = YZ');
			getRules(4, 'Z = [-FFF][+FFF]F');
			LsystemGui.drawForward = 'F';
			setValueFromExample('VZFFF', 20, 7); // axiom angle generation
			break;				

		case 'Tree2':
			getRules(0, 'F = F[+FF][-FF]F[-F][+F]F');
			LsystemGui.drawForward = 'F';
			setValueFromExample('F', 35, 4); // axiom angle generation
			break;				

		case 'Penrose Tiling':
			getRules(0, '6=81++91----71[-81----61]++');
			getRules(1, '7=+81--91[---61--71]+');
			getRules(2, '8=-61++71[+++81++91]-');
			getRules(3, '9=--81++++61[+91++++71]--71');
			getRules(4, '1=');
			LsystemGui.drawForward = '6789';
			setValueFromExample('[7]++[7]++[7]++[7]++[7]', 36, 4); // axiom angle generation
			break;

		case 'Pentaplexity':
			getRules(0, 'F=F-F++F+F-F-F');
			LsystemGui.drawForward = 'F';
			setValueFromExample('F-F-F-F-F', 72, 4); // axiom angle generation
			break;
			}
}

function setValueFromExample(axiom, angle, generation){
	LsystemGui.axiom = axiom;
	LsystemGui.sentence = axiom;
	LsystemGui.angle = angle;
	LsystemGui.generation = generation - 1 ;
	LsystemGui.rule1 = Rule[0].a + ' = ' + Rule[0].b;
	LsystemGui.rule2 = Rule[1].a + ' = ' + Rule[1].b;
	LsystemGui.rule3 = Rule[2].a + ' = ' + Rule[2].b;
	LsystemGui.rule4 = Rule[3].a + ' = ' + Rule[3].b;
	LsystemGui.rule5 = Rule[4].a + ' = ' + Rule[4].b;
}