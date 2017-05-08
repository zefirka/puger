'use strict';

export default function () {
    $('.js-create').click(() => {
        const name = $('#name').val();
        const url = $('#url').val() || '';

        if (!name) {
            alert('Specify template name');
            return;
        }

        $.post('/create/', {name, url})
            .done(data => {
                window.location.href = data.url;
            })
            .fail(err => console.error(err));
    });
}
