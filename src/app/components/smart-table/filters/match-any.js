const matchAny = (input, rules) => {
    let separator = rules.separator ? rules.separator : '';

    if (rules.matchAny.items.length === 0) {
        return true;
    }

    if (!input) {
        return false;
    }

    return rules.matchAny.items.reduce((matching, item) => {
        let inp = (separator + input + separator).toLowerCase();
        let itm = (separator + item + separator).toLowerCase();
        if (rules.matchAny.matchFull) {
            return matching || inp === itm;
        } else {
            return matching || inp.indexOf(itm) > -1;
        }
    }, false);
};

export { matchAny };
