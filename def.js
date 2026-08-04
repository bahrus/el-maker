import {ElementMaker} from './ElementMaker.js';
if(!customElements.get('el-maker')){
    customElements.define('el-maker', ElementMaker);
}