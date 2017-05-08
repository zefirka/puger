'use strict';

import 'babel-polyfill';
import 'bootstrap';

import indexModule from './modules/indexModule';
import newModule from './modules/new';
import templateModule from './modules/template';

const MODULES = {
    __new__: newModule,
    __template__: templateModule,
    __index__: indexModule
};

$(() => {
    $('[js-module]').each((i, elem) => {
        const moduleName = $(elem).attr('js-module');
        const module = MODULES[moduleName];
        const moduleParams = ($(elem).attr('module-params') || '').split(',');

        module && typeof module === 'function' && module.apply(null, moduleParams);
    });
});

