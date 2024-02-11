const puppeteer = require('puppeteer');

const signInIntoGreyHr = async (req, res) => {
    const signInText = 'You have Successfully Signed in'
    const signOutText = 'You have Successfully Signed out'
    const browser = await puppeteer.launch({
    executablePath: process.env.NODE_ENV === 'production' ? process.env.PUPPETEER_EXECUTABLE_PATH: puppeteer.executablePath(),
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    // args: ['--no-sandbox', '--disable-setuid-sandbox','--single-process', '--no-zygote'],
    });
    console.log('Browser launched');
    let successText = null;
    let retryCount = 0;
    while (!successText && retryCount < 3) {
        try {
            const page = await browser.newPage();
            console.log('New page created');
            await page.goto('https://sunovaatech.greythr.com/');
            console.log('Navigated to GreyHR website');

            await page.waitForSelector('#username', { timeout: 10000 }); // Wait until input with id 'username' appears
            console.log('Username input field found');
            await page.type('#username', process.env.GREYHR_USERNAME); // Type in username
            console.log('Username typed');
            await page.type('#password', process.env.GREYHR_PASSWORD); // Type in password
            console.log('Password typed');
            await page.click('button[type="submit"]'); // Click on submit button
            console.log('Submit button clicked');
            await page.waitForSelector('.home-dashboard', { timeout: 10000 }); // Wait until the class 'home-dashboard' appears in the DOM
            console.log('Dashboard loaded');
            await page.waitForSelector('gt-button', { timeout: 10000 }); // Wait until the custom element 'gt-button' with class name 'hydrate' and attribute 'shade' equal to 'primary' appears in the DOM
            console.log('gt-button element found');
            await page.waitForSelector('gt-home-dashboard > div > div:nth-child(2) > gt-component-loader > gt-attendance-info > div > div', { timeout: 10000 }); // Wait until the custom element 'gt-attendance-info' appears in the DOM
            const gtButton = await page.$('gt-home-dashboard > div > div:nth-child(2) > gt-component-loader > gt-attendance-info > div > div ');
            console.log('gt-attendance-info element found');
            await gtButton.waitForSelector('div.btn-container > gt-button', { timeout: 10000 }); // Wait until the custom element 'gt-button' with class name 'hydrate' and attribute 'shade' equal to 'primary' appears in the DOM
            const btnContainer = await gtButton.$('div.btn-container > gt-button');
            console.log('gt-button element found');
            await btnContainer.click('>>> button'); // Click on the sign in button
            console.log('sign in/out Button clicked');
            await page.waitForSelector('.alert-success', { timeout: 20000 }); // Wait until the success alert appears
            console.log('Success alert appeared');
            await page.waitForSelector('.alert-success p', { timeout: 20000 }); // Wait until the paragraph inside the success alert appears
            console.log('Paragraph inside success alert appeared');
            successText = await page.$eval('.alert-success p', element => element.textContent); // Get the text content of the paragraph inside the success alert
            console.log('Success text obtained:', successText);
            await browser.close();
            console.log('Browser closed');
        } catch (error) {
            console.error('Error:', error);
            await browser.close();
            console.log('Browser closed');
            retryCount++;
        }
    }

    if (successText === signInText) {
        console.log('Signed in');
        res.send('Signed in');
    } else if (successText === signOutText) {
        console.log('Signed out');
        res.send('Signed out');
    } else {
        console.log('Failed to sign in/out');
        res.send('Failed to sign in/out');
    }
}

exports.signInIntoGreyHr = signInIntoGreyHr;
