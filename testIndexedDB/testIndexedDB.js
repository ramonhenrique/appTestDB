if (Meteor.isClient) {
    var _cont_muitos = new ReactiveVar();

    Meteor.autorun(function () {
        indexedDBModule.init('testeIndexedDB', 'teste');
        _cont_muitos.set(0);
    });


    Template.formTest.helpers({
        cont: function () {
            return _cont_muitos.get()
        }
    });

    Template.formTest.events({
        'click #incluir': function () {
            indexedDBModule.createItem(null, document.getElementById('texto').value, 'teste', false);
        },
        'click #muitos': function () {
            if (document.getElementById('muitos').checked)
                muitosIndexedDB();
        }
    })

    function muitosIndexedDB() {
        var mais = document.getElementById('muitos');
        var k = [];
        for (var i = 1; i <= 1024; i++)
            k.push('-');
        k = k.join('');
        var m = [];
        for (var i = 1; i <= 1024; i++)
            m.push(k);
        m = m.join('');
        function inclui() {
            _cont_muitos.set(_cont_muitos.get() + 1);
            indexedDBModule.createItem(null, m, 'teste', false, function (res) {
                console.log(res)
                if (mais.checked)
                    setTimeout(inclui, 1);
            });
        }
        setTimeout(inclui, 1);
    }
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
