import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

/* Uncomment if working with UI for hot reload
try {
  require('electron-reloader')(module);
} catch (_) {}
*/

let window: BrowserWindow;
let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

open({
    filename: path.join(__dirname, "../db/database.db"),
    driver: sqlite3.Database
}).then((openeded) => {
    console.log('db opened');
    db = openeded;
}).catch((error) => {
    console.error(error);
})

app.on('ready', () => {
    window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
    });
    window.loadFile(path.join(__dirname, '../src/addData/addData.html'));
});

app.on('window-all-closed', async () => {
    await db?.close();
    app.quit();
})

ipcMain.handle('insertData', async (event: Electron.IpcMainInvokeEvent, args: any[]) => {
    if(args.length != 2) return undefined;
    if(typeof(args[0]) != 'string' || typeof(args[1]) != 'number') return undefined;
    await saveProductPrice(args[0], args[1]);
});

ipcMain.handle('getData', async (event: Electron.IpcMainInvokeEvent, args: any[]) => {
    if(args.length != 1) return;
    if(typeof(args[0]) != 'string') return;
    return await getProductPrices(args[0]);
});

async function saveProductPrice(product: string, price: number){
    if(db == null) return;
    await db.exec(`INSERT INTO tPRICE (
                product,
                price,
                date
            )
            VALUES (
                '${product}',
                '${price}',
                '${new Date()}'
            )`);
}

async function getProductPrices(product: string) : Promise<ProductPriceData[]>{
    if(db == null) return [];
    var products : Array<ProductPriceData> = [];
    await db.each(`SELECT * FROM tPRICE WHERE product = "${product}"`, (error: Error | null, row: any) => {
        if(error != null){
            console.error(error);
        }
        products.push({
            name: row.product,
            price: row.price,
            date: row.date
        });
    });
    products.sort((a: ProductPriceData, b: ProductPriceData) => {
        if(a.date == b.date) return 0;
        if(a.date < b.date) return -1;
        return 1;
    });
    return products;
}