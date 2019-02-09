let puppeteer = require('puppeteer');

async function lookup_dates(browser, checkin_id, checkout_id) {
  console.log(`Selecting dates: ${checkin_id} ${checkout_id}`);

  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();

  await page.goto('https://www3.hilton.com/en/hotels/california/hilton-san-francisco-financial-district-SFOFDHF/index.html');

  await page.click('#checkin');
  await page.waitFor(1000);
  await page.click(`#${checkin_id}`);
  await page.waitFor(500);

  await page.click('#checkout'); 
  await page.waitFor(1000);
  await page.click(`#${checkout_id}`);
  await page.waitFor(500);

  console.log('Submitting request');

  await Promise.all([
    page.click('#check_availability'),
    page.waitForNavigation({ waitUntil: 'networkidle2' })
  ])

  await page.waitFor(500);

  const element = await page.$('.rate-wrapper .priceamount-wrapper span');

  if (!element) {
    console.log("Can't find price!");
    return;
  }

  const text = await (await element.getProperty('textContent')).jsonValue();

  console.log(`Result: ${text.trim()}`);
}


async function run() {
  const browser = await puppeteer.launch({
      headless: false
  });

  // HACK: Don't judge me. This will break in a week.
  await lookup_dates(browser, 'ui-datepicker-col0-dRow3-0-18', 'ui-datepicker-col0-dRow3-0-23');
  await lookup_dates(browser, 'ui-datepicker-col0-dRow4-0-25', 'ui-datepicker-col1-dRow0-0-2');
  await lookup_dates(browser, 'ui-datepicker-col1-dRow1-0-4', 'ui-datepicker-col1-dRow1-0-9');
  await lookup_dates(browser, 'ui-datepicker-col1-dRow2-0-11', 'ui-datepicker-col1-dRow2-0-16');
  await lookup_dates(browser, 'ui-datepicker-col1-dRow3-0-18', 'ui-datepicker-col0-dRow3-0-23');

  await browser.close();
}

run();