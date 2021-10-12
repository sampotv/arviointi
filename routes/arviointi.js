var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display books page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM arviointi ORDER BY idArviointi',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/arviointi/index.ejs
            res.render('arviointi',{data:''});   
        } else {
            // render to views/arviointi/index.ejs
            res.render('arviointi',{data:rows});
        }
    });
});

// display add book page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('arviointi/add', {
        Paivamaara: '',
        Arvosana: '',
        idOpiskelija: '',
        idOpintojakso: ''
    })
})

// add a new book
router.post('/add', function(req, res, next) {    

    let Paivamaara = req.body.Paivamaara;
    let Arvosana = req.body.Arvosana;
    let idOpiskelija = req.body.idOpiskelija;
    let idOpintojakso = req.body.idOpintojakso;
    let errors = false;

    if(Paivamaara.length === 0 || Arvosana.length === 0 || idOpiskelija === 0 || idOpintojakso === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Anna kurssin Paivamaara, Arvosana, opiskelijan id ja opintojakson id");
        // render to add.ejs with flash message
        res.render('arviointi/add', {
            Paivamaara: Paivamaara,
            Arvosana: Arvosana,
            idOpiskelija: idOpiskelija,
            idOpintojakso: idOpintojakso
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            Paivamaara: Paivamaara,
            Arvosana: Arvosana,
            idOpiskelija: idOpiskelija,
            idOpintojakso: idOpintojakso
        }
        
        // insert query
        dbConn.query('INSERT INTO arviointi SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('arviointi/add', {
                    Paivamaara: form_data.Paivamaara,
                    Arvosana: form_data.Arvosana,
                    idOpiskelija: form_data.idOpiskelija,
                    idOpintojakso: form_data.idOpintojakso
                })
            } else {                
                req.flash('success', 'arviointi lisätty');
                res.redirect('/arviointi');
            }
        })
    }
})

// display edit book page
router.get('/edit/(:idArviointi)', function(req, res, next) {

    let idArviointi = req.params.idArviointi;
   
    dbConn.query('SELECT * FROM arviointi WHERE idArviointi = ' + idArviointi, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'arviointi ei löydy idArviointi = ' + idArviointi)
            res.redirect('/arviointi')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('arviointi/edit', {
                title: 'Edit arviointi', 
                idArviointi: rows[0].idArviointi,
                Paivamaara: rows[0].Paivamaara,
                Arvosana: rows[0].Arvosana,
                idOpiskelija: rows[0].idOpiskelija,
                idOpintojakso: rows[0].idOpintojakso

            })
        }
    })
})

// update book data
router.post('/update/:idArviointi', function(req, res, next) {

    let idArviointi = req.params.idArviointi;
    let Paivamaara = req.body.Paivamaara;
    let Arvosana = req.body.Arvosana;
    let idOpiskelija = req.body.idOpiskelija;
    let idOpintojakso = req.body.idOpintojakso;
    let errors = false;

    if(Paivamaara.length === 0 || Arvosana.length === 0 || idOpiskelija.length === 0 || idOpintojakso.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Ole hyvä ja anna kurssin Paivamaara, Arvosana, opiskelijan id ja opintojakson id");
        // render to add.ejs with flash message
        res.render('arviointi/edit', {
            idArviointi: req.params.idArviointi,
            Paivamaara: Paivamaara,
            Arvosana: Arvosana,
            idOpiskelija: idOpiskelija,
            idOpintojakso: idOpintojakso
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            Paivamaara: Paivamaara,
            Arvosana: Arvosana,
            idOpiskelija: idOpiskelija,
            idOpintojakso: idOpintojakso
        }
        // update query
        dbConn.query('UPDATE arviointi SET ? WHERE idArviointi = ' + idArviointi, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('arviointi/edit', {
                    idArviointi: req.params.idArviointi,
                    Paivamaara: form_data.Paivamaara,
                    Arvosana: form_data.Arvosana,
                    idOpiskelija: form_data.idOpiskelija,
                    idOpintojakso: form_data.idOpintojakso
                })
            } else {
                req.flash('success', 'arviointi päivitetty onnistuneesti');
                res.redirect('/arviointi');
            }
        })
    }
})
   
// delete book
router.get('/delete/(:idArviointi)', function(req, res, next) {

    let idArviointi = req.params.idArviointi;
     
    dbConn.query('DELETE FROM arviointi WHERE idArviointi = ' + idArviointi, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/arviointi')
        } else {
            // set flash message
            req.flash('success', 'arviointi tuhottu! idArviointi = ' + idArviointi)
            // redirect to books page
            res.redirect('/arviointi')
        }
    })
})

module.exports = router;