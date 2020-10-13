const elements = {
    realWortldTestingHeader: 'h2=Real World Testing',
}

class ListingPage {
    constructor () { }

    get realWorldTestingHeader () {
        return $(elements.realWorldTestingHeader);
    }
}

export default ListingPage;
