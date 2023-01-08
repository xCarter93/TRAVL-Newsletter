const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const { url } = require('inspector');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));


app.get('/', (req, res) => {

    res.sendFile(`${__dirname}/signup.html`);

})

app.post('/', (req, res) => {

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [{
            email_address: email,
            status: 'subscribed',
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };

    const jsonData = JSON.stringify(data);
    const url = 'https://us17.api.mailchimp.com/3.0/lists/1aef6f2294';
    const options = {
        method: 'POST',
        auth: 'patrick1:d25ee497bdf9e1f90470594154b6e404-us17'
    }

    const request = https.request(url, options, (response) => {

        if (response.statusCode === 200) {
            res.sendFile(`${__dirname}/success.html`)
        } else {
            res.sendFile(`${__dirname}/failure.html`)
        }

        response.on('data', (data) => {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.post('/failure', (req, res) => {
    res.redirect('/');
})


app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running`);
});


// API Key
// d25ee497bdf9e1f90470594154b6e404-us17

// List ID
// 1aef6f2294