function RulesOnChange(indexRules, value){
	getRules(indexRules, value);
	LsystemGui.generation--;
	LsystemGui.generate();
	grStrokeW = 3;
}

function getRules(index, inputRule){
	// reset
	Rule[index] = {
		a :"",
		b :""
	};
	// rule.a
	if(inputRule.charAt(0) != " ")
		Rule[index].a = inputRule.charAt(0);
	// rule.b
	for(var i = 1; i < inputRule.length; i++){
		var current = inputRule.charAt(i);
		if(current != "=" && current != " ") 
			Rule[index].b += current;
	}
}

function clearRule(){
	for(var i = 0; i < 5; i++){
		Rule[i] = {
			a : '',
			b : ''
		}
	}
}

function isDrawForwardKey(current){
	for(var i = 0; i < LsystemGui.drawForward.length; i++){
		if(current == LsystemGui.drawForward[i])
			return true;
	}
	return false;
}