function generateStars() {
    for (var i = 0; i < 200; i++) {
        document.getElementById('stars').innerHTML += '<div class="star"></div>';
    }

    var stars = document.getElementsByClassName('star');
    for (var t = 0; t < stars.length; t++) {
        stars[t].style.left = (Math.random() * 110) + "%";
        stars[t].style.top = (Math.random() * 90) + "%";
        var size = Math.random() * 4;
        stars[t].style.height = size + "px";
        stars[t].style.width = size + "px";
        var animationTime = (Math.random() * 2) + 1;
        stars[t].style.animation = "twinkle " + animationTime + "s infinite";
    }
}