var test =  function(){

	 this.name = "sharad";
	 return this;
}

module.exports = function(){
   
     var obj =  new test();
     return obj;
}