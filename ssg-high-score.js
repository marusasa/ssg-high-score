class SsgGameObj{
    constructor(gameId, domElemId){
        this.gameId = gameId;
        this.domElemId = domElemId;
        this.urlBase = 'https://highscore.sasagu.com';
        this.bottomScore = 0;
        this.hsList = [];
        this.scoreToKeep = 0;
        this.dataLoaded = false;
    }
    isNewHS(score){
        let result = false;
        if(this.dataLoaded && score != 0){
            if(this.scoreToKeep > this.hsList.length){
                if(score >= this.bottomScore){
                    result = true;
                }
            }else{
                if(score > this.bottomScore){
                    result = true;
                }
            }
        }
        return result;        
    }
    addScore(score, name){
        let reqBody = {
            "gameId": this.gameId,
            "name": name,
            "score": score
        }
        let obj = {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify(reqBody)
        };
        try{
            fetch(this.urlBase + '/addscore',obj)
                .then((response) => {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    return response.json();
                })
                .then((data) => {
                    if(data.success){
                        this.hsList = data.scores;
                        this.scoreToKeep = data.score_to_keep;
                        this.bottomScore = data.bottom_score;
                        this.render();
                    }else{
                        throw Error(data.errors);
                    }
                });
        }catch(err){
            console.error(err);
            alert("Error adding score. Reason: " + err);
        }
    }
    reload(){
        //fetch high score
        try{
            fetch(this.urlBase + '/scores/' + this.gameId)                
                .then((response) => {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    return response.json();
                })
                .then((data) => {
                    if(data.success){
                        this.hsList = data.scores;
                        this.scoreToKeep = data.score_to_keep;
                        this.bottomScore = data.bottom_score;
                        this.dataLoaded = true;
                        this.render();
                    }else{
                        throw Error(data.errors);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    this.renderError();
                });
        }catch(err){
            console.error(err);
            this.renderError();
        }
    }
    render(){
        //clear dom children
        const parent = document.getElementById(this.domElemId);
        while (parent.firstChild) {
            parent.firstChild.remove();
        }
        //create html for list
        const liChild = document.createElement('li');
        liChild.textContent = ' # SCORE NAME';
        parent.appendChild(liChild);
        for(let x = 0;x < this.scoreToKeep;x++){
            let score = 0;
            let name = '..........';
            if(x < this.hsList.length){
                score = this.hsList[x].score;
                name  = this.hsList[x].name;
            }
            const liChild = document.createElement('li');
            liChild.textContent = String(x+1).padStart(2,' ') + ' ' + String(score).padStart(5,' ') + ' ' + name.padEnd(10,' ');
            parent.appendChild(liChild);
         }
    }
    renderError(){
        const parent = document.getElementById(this.domElemId);
        while (parent.firstChild) {
            parent.firstChild.remove();
        }
        const liChild = document.createElement('li');
        liChild.textContent = 'ERROR!';
        parent.appendChild(liChild);
        const liChild2 = document.createElement('li');
        liChild2.textContent = 'DATA NOT OBTAINED.';
        parent.appendChild(liChild2);
    }
}
class SsgHighScore {
    constructor(gameObjArray){
        this.gameObjArray = [];
        //validate parameter
        gameObjArray.forEach(gameObj =>{
            if(gameObj.constructor.name != 'SsgGameObj'){
                console.error("Invalid High Score parameter object: " + gameObj.constructor.name
                        + ". High Score will not work.");  
            }else{
                this.gameObjArray.push(gameObj);
            }
        });
    }
    isNewHS(score){
        let result = false;
        this.gameObjArray.every(gameObj => {
            if(gameObj.isNewHS(score)){
                result = true;
                return false;   //this breaks out of 'every' loop.
            }
            return true;
        });
        return result;
    }
    loadHS(){
        this.gameObjArray.forEach(gameObj => {
            gameObj.reload();
        });
    }
    addScore(score, name){
        this.gameObjArray.forEach(gameObj => {
            if(gameObj.isNewHS(score)){
                gameObj.addScore(score, name);
            }
        })
    }
    showHSDialog(score){
        const elemDiv = document.createElement('div');
        elemDiv.style.cssText = 'position:absolute;top:0;right:0;width:100%;height:100%;opacity:0.3;z-index:100;background:#000';
        const elemDivDlg = document.createElement('div');
        elemDivDlg.innerHTML = `<p>NEW HIGH SCORE!</p>
                                <p>SCORE: <span id='hs_score_disp'>${score}</span></p>
                                <p>
                                    Name: <input type="text" name="nameField" maxlength="10" size="12"
                                        style="font-size: 32px;margin-bottom: 10px;"  autocomplete="off"><br>
                                    <input type="button" name="submitButton" value="SUBMIT" style="font-size: 32px;">
                                    <input type="button" name="cancelButton" value="CANCEL" style="font-size: 32px;">
                                </p>
                                `
        elemDivDlg.className = "center-screen";
        //document.body.appendChild(elemDiv);
        document.getElementById('game-loc').appendChild(elemDiv);
        document.getElementById('game-loc').appendChild(elemDivDlg);
    }
    validate(score, name){
        let result = false;
        let errors = [];
        if(score == 0){
            errors.push("Score cannot be 0.");
        }
        if(name.trim() == ""){
            errors.push("Name is missing.");
        }
        if(name.length > 10){
            errors.push("Name longer than 10 characters.");
        }
        if(errors.length == 0){
            result = true;
        }else{
            alert(errors);
        }
        return result;
    }    
}