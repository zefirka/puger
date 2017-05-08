'use strict';

export default function () {
    $('.js-remove').click(function () {
        const $el = $(this);
        const file = $el.attr('data-item');

        $.post(`/remove/${file}/`)
            .done(({ok}) => ok ? $el.parent().remove() : null)
            .fail(err => console.error(err));
    });
}

