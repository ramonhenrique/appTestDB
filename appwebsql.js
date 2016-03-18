if (Meteor.isClient) {
    var select, db;
    var cont = 0;
    Template.formTest.onRendered(function () {
        select = document.getElementById('select');
        setupDatabase();
    });

    Template.formTest.events({
        'click #incluir': function () {
            save();
        }
    });


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
        db = openDatabase('testeDB', '1.0', 'banco de teste', 30 * 1024 * 1024);
        db.transaction(function (tx) {
            //tx.executeSql('DROP TABLE IF EXISTS testeDB');
            //tx.executeSql('CREATE TABLE IF NOT EXISTS testeDB (id unique, text)');
        });
    }
}