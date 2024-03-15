const cvCheack = document.getElementById('cv-check')
const downloadBtn = document.getElementById('download-btn')


downloadBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    cvCheack.style.opacity = "1";
    cvCheack.style.transition = "0.3s all";


    setTimeout(() => {
        cvCheack.style.opacity = "0";
    }, 1000);
} ) 
