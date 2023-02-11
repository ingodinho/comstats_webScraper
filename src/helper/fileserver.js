import fs from 'fs';

const saveFile = (data, path) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, (err) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
}

export {
    saveFile,
}
