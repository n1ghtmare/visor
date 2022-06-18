const RACE_DATA_URL = "http://apex-timing.com/live-timing/lemans-karting2/";
import cheerio from "cheerio";
import puppeteer, { Browser, HTTPResponse, Page } from "puppeteer";

export async function getServerSideProps() {
    const browser: Browser = await puppeteer.launch();
    const page: Page = await browser.newPage();

    await page.goto(RACE_DATA_URL);
    await page.waitForSelector("#tgrid>tbody", { visible: true });

    const k = await page.content();

    const $ = cheerio.load(k);

    console.log({ data: $("#tgrid").html() });

    // const browser = await playwright["chromium"].launch();
    // const context = await browser.newContext();
    // const page = await context.newPage();
    //
    // await page.goto(RACE_DATA_URL);
    //
    // const pageContent = await page.content();
    //
    // const $ = cheerio.load(pageContent);
    // const data = $("tgrid").text();
    // console.log({ d: data });
    // const response = await fetch(RACE_DATA_URL);
    //
    // const htmlData = await response.text();
    // const $ = cheerio.load(htmlData);
    //
    // const data = $("#live").text();
    //
    // console.log({ data });

    return {
        props: {
            data: null
        }
    };
}

export default function Test({ data }) {
    return (
        <div>
            <h1>Hello</h1>
        </div>
    );
}
