
let browserOpenP=puppeteer.launch({
    headless:false
});

browserOpenP.then(function(browserInstance){
    console.log("Browser Opened");
    let alltabsPromise=browserInstance.pages();
    return alltabsPromise;
})
.then(function(tabs){
    let page=tabs[0];
    let googleHomePageOpenPromise= page.goto("https://www.google.com");
    return googleHomePageOpenPromise;
})
.then(function(){
    console.log("google home page openedddddddddddd");
})
;

