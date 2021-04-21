const puppeteer = require("puppeteer");
var ks = require('node-key-sender');
const browserLaunchPromise = puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
    executablePath: "C:\\Users\\Aditya\\AppData\\Local\\Microsoft\\Edge SxS\\Application\\msedge.exe",
    slowMo: 50
});

let cTab;
let globalBrowserInstance;

browserLaunchPromise.then(function (browserInstance) {
    globalBrowserInstance=browserInstance;
    let allTabsPromise = browserInstance.pages();
    return allTabsPromise;
})
    .then(function (tabsArr) {
        cTab = tabsArr[0];
        const homePageOpenedPromise = cTab.goto("https://www.indiatoday.in",{
            timeout:0
        });
        return homePageOpenedPromise;
    })
    .then(function () {
        let allTheTopStoriesURLArrayPromise =cTab.evaluate(function () {
            let ansArr=[];
            document.querySelectorAll("body .top-n-most-popular-stories a")
                .forEach(function (the_a_Tag) {
                    ansArr.push(the_a_Tag.getAttribute("href"));

                });
            return ansArr;
        });
        return allTheTopStoriesURLArrayPromise;
    })
    .then(function(allTheTopStoriesURLArray){
        // console.log(allTheTopStoriesURLArray.length);
        // console.log(allTheTopStoriesURLArray);

        let validTopStories = allTheTopStoriesURLArray.filter(function(givenURL){
            if(givenURL.indexOf("https") != -1 || givenURL.indexOf("live") != -1 ){
                //then does not include it, may break the code
                return false;
            }
            else{
                return true;
            }
        }); 

        console.log(validTopStories.length);
        // console.log(validTopStories);
        // let fullLink=`https://www.indiatoday.in${urlForAnArticle}`;

        //return singleArticleReader("https://www.indiatoday.in/impact-feature/story/oppo-debuts-the-f19-in-india-boasts-the-sleekest-design-with-5000mah-battery-33w-flash-charging-and-more-1788820-2021-04-08");
        // return singleArticleReader(  `https://www.indiatoday.in${validTopStories[0]}`  );

        let oneArticleReadingCompletedPromise = singleArticleReader(  `https://www.indiatoday.in${validTopStories[0]}`  );
        
        for(let i=1;i<validTopStories.length;i++){
            oneArticleReadingCompletedPromise = oneArticleReadingCompletedPromise.then(function(){
                return singleArticleReader( `https://www.indiatoday.in${validTopStories[i]}` );
            });
        }
        return oneArticleReadingCompletedPromise;
    })
    .then(function(){
        console.log("All work done. Closing the browser");
        return globalBrowserInstance.close();
    })
    .then(function(){
        console.log("browser closed");
    })
    .catch(function(){
        console.log("some error happened");
    })







function singleArticleReader(urlForAnArticle) {

    return new Promise(function (resolve, reject) {
        
        let articlePageOpenedPromise=cTab.goto(urlForAnArticle,{
            timeout:0
        });
        articlePageOpenedPromise.then(function(){
            return  ks.sendCombination(['control', 'shift', 'u']);
        })
        .then(function(){
            return cTab.waitForTimeout(1000);
        })                                                               
        .then(function(){
            const waitForSelectorToVanishPromise = cTab.waitForSelector(".node.node-story.view-mode-full .msreadout-word-highlight",{
                hidden:true,
                timeout:0
            });
            return waitForSelectorToVanishPromise;
        })
        // .then(function(){
        //     return cTab.goto("https://www.google.com");
        // })
        .then(function(){
            console.log(`The article ${urlForAnArticle} work is completed`);
            resolve();
        })
        .catch(function(err){
            console.log(err);
            reject()
        })
    });
}

//body.top - n - most - popular - stories a //selector for the home page