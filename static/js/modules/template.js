'use strict';

import CodeMirror from 'codemirror';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/pug/pug';

import debounce from 'lodash.debounce';

function initCodeMirror(type, textArea) {
    const settings = ({
        json: {
            mode: {
                name: 'javascript',
                json: true
            },
            theme: 'monokai',
            lineNumbers: true
        },
        css: {
            mode: 'css',
            theme: 'monokai',
            lineNumbers: true
        },
        pug: {
            mode: 'pug',
            theme: 'monokai',
            lineNumbers: true
        }
    })[type];

    return CodeMirror.fromTextArea(textArea, settings);
}

function updateText(c, drop = false) {
    var $el = $(`a[tab="${c}"] h2`);

    if (!$el.attr('data-updated')) {
        $el.text($el.text() + ' *');
        $el.attr('data-updated', 'true');

        $('.buttons-row').show();
    }

    if (drop) {
        $el.text($el.text().slice(0, -2));
        $el.removeAttr('data-updated');
        $('.buttons-row').hide();
    }
}

function showError(error) {
    const html = JSON.stringify(error.responseJSON.error)
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t');

    $('.js-error').html(html).show();
}

function hideError() {
    $('.js-error').html('').hide();
}

const updateCss = debounce(function (mirror, event) {
    if (event.origin !== 'setValue') {
        updateText('css');
    }

    $('style.main').html(mirror.getValue());
}, 250);

export default function templateModule(file) {
    const jsonTextArea = $('.json-codemirror');
    const cssTextArea = $('.css-codemirror');
    const pugTextArea = $('.pug-codemirror');

    const jsonCodeMirror = initCodeMirror('json', jsonTextArea[0]);
    const cssCodeMirror = initCodeMirror('css', cssTextArea[0]);
    const pugCodeMirror = initCodeMirror('pug', pugTextArea[0]);

    const mirrors = {
        json: jsonCodeMirror,
        css: cssCodeMirror,
        pug: pugCodeMirror
    };

    const updatePug = debounce(function (mirror, event) {
        if (event.origin !== 'setValue') {
            updateText('pug');
        }

        $.post('/update/', {
            type: 'pug',
            json: jsonCodeMirror.getValue(),
            file: file,
            value: mirror.getValue()
        })
            .done(data => {
                $('.js-content').html(data);
                hideError();
            })
            .fail(showError);

    }, 400);

    const updateView = debounce(function (mirror, event) {
        if (event.origin !== 'setValue') {
            updateText('json');
        }

        $.post('/update/', {
            file: file,
            value: mirror.getValue()
        })
            .done(data => {
                $('.js-content').html(data);
                hideError();
            })
            .fail(showError);
    }, 300);

    $('.js-tabs a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        var tab = $(this).attr('tab');

        mirrors[tab].refresh();
    });

    $('.js-save').click(() => {
        var tab = $('.active.tab-pane').attr('tab');

        $.post('/save/', {
            value: mirrors[tab].getValue(),
            type: tab,
            file: file,
        }).done(data => {
            data.ok ? updateText(tab, true) : showError(data.error);
        }).fail(showError);
    });

    $('.js-drop').click(() => {
        var tab = $('.active.tab-pane').attr('tab');

        $.get('/view/', {
            file: file,
            type: tab
        }).done(data => {
            mirrors[tab].setValue(data);
            updateText(tab, true);
            hideError();
        });
    });

    jsonCodeMirror.on('change', updateView);
    cssCodeMirror.on('change', updateCss);
    pugCodeMirror.on('change', updatePug);
}
