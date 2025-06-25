@path: '/odata/dummy'
//@(requires: 'authenticated-user')
service BtpDummyService {
    // @cds.persistence.skip
    // @(restrict: [
    //     {
    //         grant: ['READ'],
    //         to   : ['authenticated-user']
    //     },
    //     {
    //         grant: ['UPDATE'],
    //         to   : ['admin']
    //     }
    // ])
    entity Message {
        key id       : String; // id to identify this query
            message  : String; // message to display
    };
}
