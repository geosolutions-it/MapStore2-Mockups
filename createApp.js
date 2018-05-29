const fs = require('fs-extra');

fs.emptyDir('./www').then(() => {
    console.log('www empty!');

    fs.copy('./dist', './www/dist', err => {
        if (err) return console.error(err);
        console.log('dist moved!');

        fs.copy('./www/dist/js', './www/js', error => {
            if (err) return console.error(error);
            console.log('js moved!');
        });

        fs.copy('./www/dist/MapStore2', './www/MapStore2', error => {
            if (err) return console.error(error);
            console.log('MapStore2 moved!');
        });

        fs.copy('./www/dist/old_ms2_226bfec4', './www/old_ms2_226bfec4', error => {
            if (err) return console.error(error);
            console.log('old_ms2_226bfec4 moved!');
        });
    });

    fs.copy('./assets', './www/assets', err => {
        if (err) return console.error(err);
        console.log('assets moved!');
    });

    fs.copy('./index.html', './www/index.html', err => {
        if (err) return console.error(err);
        console.log('index.html moved!');
    });

    fs.copy('./localConfig.json', './www/localConfig.json', err => {
        if (err) return console.error(err);
        console.log('localConfig.json moved!');
    });

}).catch(err => {
    console.error(err);
});

