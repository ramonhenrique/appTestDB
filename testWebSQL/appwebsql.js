if (Meteor.isClient) {
    var select, db;
    var cont = 0;
    var _cont_muitos = new ReactiveVar();
    Template.formTest.onRendered(function () {
        select = document.getElementById('select');
        setupDatabase();
    });

    Template.formTest.helpers({
        cont: function () {
            return _cont_muitos.get()
        }
    });
    Template.formTest.events({
        'click #incluir': function () {
            save();
        },
        'click #muitos': function () {
            debugger
            if (document.getElementById('muitos').checked)
                muitos();
        }
    });


    function muitos() {
        debugger
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
            db.transaction(function (tx) {
                tx.executeSql('INSERT INTO testeDB VALUES (?, ?)', [_cont_muitos.get(), m], function (tx, res) {
                    console.log(res)
                    if (res.rowsAffected != 1) alert('erro no insert')
                    if (mais.checked)
                        setTimeout(inclui, 1);
                });
            });
        }
        setTimeout(inclui, 1);
    }

    function save() {
        var texto = document.getElementById('texto');
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO testeDB VALUES (?, ?)', [cont++, texto.value]);
            texto.value = '';
        });
        show();

    }

    function show() {
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM testeDB', [], function (tx, results) {
                var html = [];
                select.innerHTML = '';
                if (results.rows && results.rows.length) {
                    for (var i = 0; i < results.rows.length; i++) {
                        html.push('<li>' + results.rows.item(i).text + '</li>');
                    }
                    select.innerHTML = html.join('');
                }
            });
        });
    }


    function setupDatabase() {
        if (!window.openDatabase) {
            select.innerHTML = '<li>Web SQL Database API is not available in this browser, please try nightly Opera, Webkit or Chrome.</li>';
            return;
        }
        db = openDatabase('testeDB', '1.0', 'banco de teste', 30 * 1024 * 1024 * 1024);
        db.transaction(function (tx) {
            debugger
            // tx.executeSql('DROP TABLE IF EXISTS testeDB');
            tx.executeSql('CREATE TABLE IF NOT EXISTS testeDB (id unique, text)');
            tx.executeSql('select count(*) as cont from testeDB', [], function (tx, res) {
                _cont_muitos.set(res.rows[0].cont);
            });
        });
    }
}