(function () {
    var KEY = 'sidebarScrollPos';

    document.addEventListener('DOMContentLoaded', function () {
        var nav = document.querySelector('.sidebar-nav');
        if (!nav) return;

        var saved = sessionStorage.getItem(KEY);
        if (saved !== null) {
            nav.scrollTop = parseInt(saved, 10) || 0;
        }

        var timer;
        nav.addEventListener('scroll', function () {
            clearTimeout(timer);
            timer = setTimeout(function () {
                sessionStorage.setItem(KEY, nav.scrollTop);
            }, 100);
        });
    });
})();
