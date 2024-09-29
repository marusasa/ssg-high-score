# ssg-high-score.js

A helper java script file for using a free online high score service api [highscore.sasagu.com](https://highscore.sasagu.com/)

## Usage

1. Go to [highscore.sasagu.com](https://highscore.sasagu.com/). Follow the instructions and create an account and high score list(s).

2. Use this helper component in your code. You can have multiple high score lists.
Example:
```
let gameObjArray = [new SsgGameObj("your-highscore-id-here","dom-id-to-show-scores"),
        new SsgGameObj("your-highscore-id-here","dom-id-to-show-scores")];
let hsObj = new SsgHighScore(gameObjArray);
```

3. Render high score:
```
hsObj.loadHS();
```

4. Check if new score can be added to any of the high score list.
```
let score = 100;
if(hsObj.isNewHS(score)){
    //show dialog to ask for a name to use.
}
```

5. Validate the name, then add score
```
let score = 100;
let name = 'NAME';  //name retrieved from dialog.
if(hsObj.validate(score, name)){
    //add score to the appropriate high score list.
    //list will be updated with new values.
    hsObj.addScore(score, name);  
}else{
    //an alert dialog will be displayed by the component.
}
```