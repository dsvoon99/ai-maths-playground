let n1, n2;
let score = 0;
let backgroundImages = [];

function nextQuestion() {
    n1 = Math.floor(Math.random() * 5);
    document.getElementById('n1').innerHTML = n1;
    n2 = Math.floor(Math.random() * 5);
    document.getElementById('n2').innerHTML = n2;
}

function checkAnswer() {
    const prediction = predictImage()[0];

    if(prediction == (n1 + n2)) {
        score++;
        if(score < 6) {
            backgroundImages.push(`url('images/background${score}.svg')`);
            document.body.style.backgroundImage = backgroundImages;
        } else {
            alert("Well Done! Your math garden is in full bloom! Want to start again?");
            score = 0;
            backgroundImages = [];
            nextQuestion();
            document.body.style.backgroundImage = backgroundImages;
        }
        
    } else {
        score == 0 ? null: score--;
        alert("Oops! Check your calculation!");
        setTimeout(function() {
            backgroundImages.pop();
            document.body.style.backgroundImage = backgroundImages;
        }, 1000)
    }
}