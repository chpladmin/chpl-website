import { getAngularService } from './angular-react-helper.jsx';

class chplLogService {
    constructor () {
        this.$log = getAngularService('$log');
    }

    debug (...args) {
        this.$log.debug(...args);
    }

    info (...args) {
        this.$log.info(...args);
    }
}

export default new chplLogService();
