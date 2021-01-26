import { reactToAngularComponent } from './angular-react-helper.jsx';
import ChplEllipsis from './chpl-ellipsis.jsx';

angular
    .module('chpl.components')
    .component('chplEllipsisBridge', reactToAngularComponent(ChplEllipsis));
