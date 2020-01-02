const cheerio = require('cheerio');
const fs = require('fs');
const _ = require('lodash');
const customers = require('./customers');
const indexFilePath = 'dist/index.html';

console.log('After build script started...')
writeSeparator();
writeBlankLine();

console.log('About to rewrite file: ', indexFilePath);
writeSeparator();
writeBlankLine();

fs.readFile(indexFilePath, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }

    try {
        const $ = cheerio.load(data)
        const base = $('base');
        const metaClientName = $('[name=clientName]');
        const metaPort = $('[name=port]');
        //const logoImg = $('#logoImg');

        _.forEach(customers, (customer, key) => {
            writeSeparator();
            console.log(`Creating file for customer: ${customer.name}`);
            writeSeparator();

            base.attr('href', `/${customer.name}`);
            metaClientName.attr('content', customer.name);
            metaPort.attr('content', customer.apiPort);
            //logoImg.attr('src', customer.logoPath);
            const filePath = `dist/${customer.name}/`;
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath);
            }
            console.log(`Index file created: ${JSON.stringify(customer)}`);

            fs.writeFileSync(`${filePath}/index.html`, $.html());

            console.log('Successfully rewrote index html');
            writeBlankLine();
        });
    } catch (err) {
        console.log('Error: ', err);
    }
});

function writeBlankLine(num = 1) {
    for (let index = 0; index < num; index++) {
        console.log('');
    }
};

function writeSeparator(num = 1) {
    for (let index = 0; index < num; index++) {
        console.log('============================================');
    }
}