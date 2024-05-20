const dotenv = require('dotenv');
dotenv.config();
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
let cron = require('node-cron');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL, // Replace with your email
    pass: process.env.PASS, // Replace with your email password or app-specific password
  },
});

// Add the stealth plugin to puppeteer
puppeteer.use(StealthPlugin());

async function scrapeData(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  //   const word = 'family reunion';

  try {
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );
    await page.goto(url, { waitUntil: 'load', timeout: 0 });

    const containsStudy = await page.evaluate(() => {
      const divs = Array.from(document.querySelectorAll('div'));
      return divs.some((div) =>
        div.textContent.toLowerCase().includes('family reunion')
      );
    });

    if (containsStudy) {
      console.log(`The page contains a div with the word = 'family reunion'.`);
      sendEmailNotification();
    } else {
      console.log(
        `The page does not contain a div with the word = 'family reunion'.`
      );
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  } finally {
    await browser.close();
  }
}

const emails = [
  'asimrazzaqj@gmail.com',
  'saqib.idrees95@gmail.com',
  'ranamkhan1996@gmail.com',
  'aliharris727@gmail.com',
];

// Function to send email notification
function sendEmailNotification() {
  const mailOptions = {
    from: process.env.EMAIL, // Replace with your email
    // to: emails.join(', '), // Replace with recipient's email
    to: 'asimrazzaqj@gmail.com', // Replace with recipient's email
    subject: 'Word Found on Page',
    text: 'The page contains a div with the word "family".',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error(`Error: ${error.message}`);
    }
    console.log('Email sent: ' + info.response);
  });
}

// URL of the webpage you want to scrape
// const url =
//   'https://www.google.com/search?q=pakistan&sca_esv=137e48d954afa8b7&sxsrf=ADLYWILxf2LzwBKu-LcCCWkuRAlj6ejGxg%3A1716188376325&source=hp&ei=2PRKZqeKEeKK7NYP4oWs6Ac&iflsig=AL9hbdgAAAAAZksC6Kvivj2392_dZjcMaiHOA7eQt0b_&ved=0ahUKEwin1qT005uGAxViBdsEHeICC30Q4dUDCBU&uact=5&oq=pakistan&gs_lp=Egdnd3Mtd2l6IghwYWtpc3RhbjIKECMYgAQYJxiKBTILEAAYgAQYkQIYigUyCxAAGIAEGJECGIoFMgsQABiABBiRAhiKBTILEAAYgAQYkQIYigUyCBAAGIAEGLEDMgsQLhiABBixAxiDATILEC4YgAQYsQMYgwEyBRAuGIAEMg4QABiABBixAxiDARiKBUiRDFCcBFjJCnABeACQAQCYAekCoAHbDaoBBzAuNS4yLjG4AQPIAQD4AQGYAgmgAvQNqAIKwgIHECMYJxjqAsICDRAuGMcBGCcY6gIYrwHCAhEQABiABBiRAhixAxiDARiKBcICBRAAGIAEwgILEAAYgAQYsQMYgwHCAgQQIxgnwgILEC4YgAQY0QMYxwGYAwWSBwcxLjQuMy4xoAfIaA&sclient=gws-wiz';
const url =
  'https://service2.diplo.de/rktermin/extern/choose_categoryList.do?locationCode=isla&realmId=108';

// Call the function to scrape data

// cron.schedule('*/1 * * * *', () => {
scrapeData(url);
console.log('running a task every one minutes');
// });
