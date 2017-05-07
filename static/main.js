'use strict';

$(function () {
    var jsTextArea = $('.js-codemirror');
    var cssTextArea = $('.css-codemirror');
    var pugTextArea = $('.pug-codemirror');

    var file = jsTextArea.attr('file-name');

    function initJs() {
        return CodeMirror.fromTextArea(jsTextArea[0], {
            mode: 'json',
            lineNumbers: true
        });
    }

    function initCss() {
        return  CodeMirror.fromTextArea(cssTextArea[0], {
            mode: 'css',
            lineNumbers: true
        });
    }

    function initPug() {
        return CodeMirror.fromTextArea(pugTextArea[0], {
            mode: 'pug',
            lineNumbers: true
        });
    }

    function updateText(c) {
        var $el = $(`[tab="${c}"] h2`);
        if (!$el.attr('data-updated')) {
            $el.text($el.text() + ' *')
            $el.attr('data-updated', 'true')
        }
    }

    var jsCodeMirror = initJs();
    var cssCodeMirror = initCss();
    var pugCodeMirror = initPug();

    var mirrors = {
        js: jsCodeMirror,
        css: cssCodeMirror,
        pug: pugCodeMirror
    };
    
    var updateView = debounce(function (event) {
        updateText('js')
        $.post('/update/', {
            file: file,
            value: event.getValue()
        }).then(function (data) {
            $('.js-content').html(data);
        })
    }, 300);

    var updateCss = debounce(function (event) {
        updateText('css');
        $('style.main').html(event.getValue())
    }, 250);

    var updatePug = debounce(function (event) {
        updateText('pug');
        $.post('/update/', {
            type: 'pug',
            json: jsCodeMirror.getValue(),
            file: file,
            value: event.getValue()
        }).then(function (data) {
            $('.js-content').html(data);
        });
    }, 400);

    $('.js-tabs a').click(function (e) {
        e.preventDefault()
        $(this).tab('show');
        var tab = $(this).attr('tab');

        mirrors[tab].refresh();
    });

    jsCodeMirror.on('change', updateView);
    cssCodeMirror.on('change', updateCss);
    pugCodeMirror.on('change', updatePug);
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