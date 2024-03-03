// handle data read write
// dependencis
const fs = require('fs');
const path = require('path');

const fileLib = {};

// path
fileLib.path = path.join(__dirname, '../.data/');

fileLib.create = (dir, file, data, callback) => {
    fs.open(`${fileLib.path + dir}/${file}.json`, 'wx', (openErr, fileDescriptor) => {
        if (!openErr && fileDescriptor) {
            const stringData = JSON.stringify(data);

            // write file
            fs.writeFile(fileDescriptor, stringData, (writeErr) => {
                if (!writeErr) {
                    fs.close(fileDescriptor, (closeErr) => {
                        if (!closeErr) {
                            callback(false);
                        } else {
                            callback('error in closing file');
                        }
                    });
                } else {
                    callback('Error in writing in file');
                }
            });
        } else {
            callback(`Error in file open${openErr.message}`);
        }
    });
};

// read data from file
fileLib.read = (dir, file, callback) => {
    fs.readFile(`${fileLib.path + dir}/${file}.json`, 'utf-8', (readErr, data) => {
        callback(readErr, data);
    });
};

// update existing data
fileLib.update = (dir, file, data, callback) => {
    fs.open(`${fileLib.path + dir}/${file}.json`, 'r+', (openErr, fileDescriptor) => {
        if (!openErr && fileDescriptor) {
            const stringData = JSON.stringify(data);
            fs.ftruncate(fileDescriptor, (truncatErr) => {
                if (!truncatErr) {
                    fs.writeFile(fileDescriptor, stringData, (writeErr) => {
                        if (!writeErr) {
                            callback('Succesfully Updated data');
                        } else {
                            callback('Fail to update data');
                        }
                    });
                } else {
                    callback('there is an Error Truncate');
                }
            });
        } else {
            callback('Error in open file. File may not exist');
        }
    });
};

// delete data
fileLib.delete = (dir, file, callback) => {
    fs.unlink(`${fileLib.path + dir}/${file}.json`, (openErr) => {
        if (!openErr) {
            callback('Succesfully delete data');
        } else {
            callback('fail to delete');
        }
    });
};

// export
module.exports = fileLib;
