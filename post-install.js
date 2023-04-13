const fs = require('fs');
const fsp = fs.promises;

const pkgJsonPath = require.main.paths[0].split('node_modules')[0] + 'node_modules/react-scripts/config/webpack.config.js';
const cursor = 13941;

(async () => {
    const handle = await fsp.open(pkgJsonPath, "r+");
    const data = fs.readFileSync(pkgJsonPath, 'utf-8');
    const bufferSwap = Buffer.alloc(data.length - 13941)
    const bytesRead = await handle.read(bufferSwap, 0, bufferSwap.length, cursor);
    const buffer = Buffer.from('\n\t\t\tfallback: {\n\t\t\t\tcrypto: require.resolve("crypto-browserify"),\n\t\t\t},\n'); 
    const bytesToWrite = Buffer.concat([buffer, bytesRead.buffer]);
    try {
        await handle.write(bytesToWrite, 0, bytesToWrite.length, cursor);
        console.log('Fixed webpack.config.js file!');
    } catch (err) {
        console.log(`Cant write to file: ${err.message || String(err)}`);
    } finally {
        handle.close();
    }
})()
.catch(err => {
    console.log(`Error: ${err.message || String(err)}`);
});