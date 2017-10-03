var soap = require('soap');
var fs = require('fs');
var express = require('express');
var pug = require('pug');
var bodyParser = require('body-parser');
var jsonexport = require('jsonexport');
var path = require('path');
var url = 'https://services.contactatonce.com/directmerchantreportingservice.asmx?wsdl';

var app = express();
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use('/public', express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/lead-detail', (req, res) => {
    var args = req.body;
    soap.createClient(url, function(err, client) {
        client.GetLeadDetail(args, function(err, result) {
            var resp = result.GetLeadDetailResult.LeadStat;
            var rows = [];
            for (var i = 0; i < resp.length; i++) {
                rows.push(resp[i]);
            }
            jsonexport(rows, (err, csv) => {
                if (err) return console.log(err);
                fs.writeFile('./public/csv/lead-detail.csv', csv, err => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                    res.sendFile(path.resolve(__dirname, './public/csv/lead-detail.csv'));
                });
            });
        });
    });
});

app.post('/im-detail', (req, res) => {
    var args = req.body;
    soap.createClient(url, function(err, client) {
        client.GetImDetail(args, function(err, result) {
            console.log(result.GetImDetailResult.ImPartnerDetail[0]);
            var resp = result.GetImDetailResult.ImPartnerDetail;
            var rows = [];
            for (var i = 0; i < resp.length; i++) {
                rows.push(resp[i]);
            }
            jsonexport(rows, (err, csv) => {
                if (err) return console.log(err);
                fs.writeFile('./public/csv/im-detail.csv', csv, err => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                    res.sendFile(path.resolve(__dirname, './public/csv/im-detail.csv'));
                });
            });
        });
    });
});

app.post('/performance-statistical-summary', (req, res) => {
    var args = req.body;
    soap.createClient(url, function(err, client) {
        client.GetPerformanceStatisticalSummary(args, function(err, result) {
            var resp = result.GetPerformanceStatisticalSummaryResult.ImPartnerReportStat;
            var rows = [];
            for (var i = 0; i < resp.length; i++) {
                rows.push(resp[i]);
            }
            jsonexport(rows, (err, csv) => {
                if (err) return console.log(err);
                fs.writeFile('./public/csv/performance-statistical-summary.csv', csv, err => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                    res.sendFile(path.resolve(__dirname, './public/csv/performance-statistical-summary.csv'));
                });
            });
        });
    });
});

app.listen(3001, () => console.log('app listening on port 3001'));
