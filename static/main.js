'use strict';

$(function () {
    var jsTextArea = $('.js-codemirror');
    var cssTextArea = $('.css-codemirror');
    var file = jsTextArea.attr('file-name');

    var jsCodeMirror = CodeMirror.fromTextArea(jsTextArea[0], {
        mode: 'json'
    });

    var cssCodeMirror = CodeMirror.fromTextArea(cssTextArea[0], {
        mode: 'css'
    });

    var updateView = debounce(function (event) {
        $.post('/update/', {
            file: file,
            value: event.getValue()
        }).then(function (data) {
            $('.js-content').html(data);
        })
    }, 300);


    var updateCss = debounce(function (event) {
        $('style.main').html(event.getValue())
    }, 250);

    jsCodeMirror.on('change', updateView);
    cssCodeMirror.on('change', updateCss);
})

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};