const Dark = document.getElementById("switchDark");
const savedTheme = localStorage.getItem('theme');


if (savedTheme) {
    applyTheme(savedTheme);
} else {

    applyTheme('light');
}


function applyTheme(theme) {
    if (theme === 'dark') {

        console.log('dark mode');

        document.documentElement.setAttribute('data-theme', 'dark');

        const Icon = document.getElementById("switchIcon");

        Icon.classList.remove('fa-moon');
        Icon.classList.add('fa-sun');

        document.documentElement.style.setProperty('--mtext', '#ffffff');
        document.documentElement.style.setProperty('--bg', '#1a1922');
        document.documentElement.style.setProperty('--s-border', '#ffffff');
        document.documentElement.style.setProperty('--allpro-b', '#c7c9d3');
        document.documentElement.style.setProperty('--stext', '#c7c9d3');
        document.documentElement.style.setProperty('--d-button-bg', 'rgba(255, 255, 255, 0.8)');
        document.documentElement.style.setProperty('--d-button-color', '#000000');
        document.documentElement.style.setProperty('--d-button-hover', '#ffffff');
        document.documentElement.style.setProperty('--social-bg', 'rgba(255, 255, 255, 0.8)');
        document.documentElement.style.setProperty('--social-icon', 'rgb(75, 75, 75)');
        document.documentElement.style.setProperty('--social-icon-hover', 'rgb(0, 0, 0)');
        document.documentElement.style.setProperty('--bottom-icon', 'rgba(179, 179, 179, 0.8)');
        document.documentElement.style.setProperty('--bottom-icon-hover', 'rgb(255, 255, 255)');
        document.documentElement.style.setProperty('--blog-button', '#fff');
        document.documentElement.style.setProperty('--blog-button-hover', '#ffffff');
        document.documentElement.style.setProperty('--bgImg', 'url(/images/dark-bg.jpg)');
        document.documentElement.style.setProperty('--gtop', 'rgba(245, 245, 241, 0)');
        document.documentElement.style.setProperty('--gbottom', 'rgba(245, 245, 241, 0)');
        document.documentElement.style.setProperty('--pras-logo', 'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(7454%) hue-rotate(22deg) brightness(101%) contrast(86%)');
        document.documentElement.style.setProperty('--blog-g-top', 'rgba(1,3,20,0)');
        document.documentElement.style.setProperty('--blog-g-bottom', 'rgba(0,0,0,1)');
        document.documentElement.style.setProperty('--bottom-border', '#c7c9d3');
    } else {

        const Icon = document.getElementById("switchIcon");

        Icon.classList.add('fa-moon');
        Icon.classList.remove('fa-sun');

        console.log('light mode');
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.style.setProperty('--mtext', '#000');
        document.documentElement.style.setProperty('--bg', '#ffffff');
        document.documentElement.style.setProperty('--s-border', '#000');
        document.documentElement.style.setProperty('--allpro-b', '#444444');
        document.documentElement.style.setProperty('--stext', '#444444');
        document.documentElement.style.setProperty('--d-button-bg', 'rgba(0, 0, 0, 0.800)');
        document.documentElement.style.setProperty('--d-button-color', '#fff');
        document.documentElement.style.setProperty('--d-button-hover', '#000000');
        document.documentElement.style.setProperty('--social-bg', 'rgba(0, 0, 0, 0.800)');
        document.documentElement.style.setProperty('--social-icon', 'rgba(255, 255, 255, 0.5)');
        document.documentElement.style.setProperty('--social-icon-hover', '#fff');
        document.documentElement.style.setProperty('--bottom-icon', 'rgba(90, 90, 90, 0.8)');
        document.documentElement.style.setProperty('--bottom-icon-hover', '#000');
        document.documentElement.style.setProperty('--blog-button', '#000');
        document.documentElement.style.setProperty('--blog-button-hover', '#ffffff');
        document.documentElement.style.setProperty('--bgImg', 'url(/images/white-bg.jpg)');
        document.documentElement.style.setProperty('--gtop', 'rgba(245, 245, 241, 0)');
        document.documentElement.style.setProperty('--gbottom', 'rgb(212, 212, 212)');
        document.documentElement.style.setProperty('--pras-logo', 'brightness(0) saturate(100%) invert(0%) sepia(100%) saturate(0%) hue-rotate(21deg) brightness(97%) contrast(103%)');
        document.documentElement.style.setProperty('--blog-g-top', 'rgba(1,3,20,0)');
        document.documentElement.style.setProperty('--blog-g-bottom', 'rgba(255,255,255,1)');
        document.documentElement.style.setProperty('--bottom-border', '#000');
    }
}

Dark.addEventListener('click', function () {

    const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(currentTheme);


    localStorage.setItem('theme', currentTheme);
});
